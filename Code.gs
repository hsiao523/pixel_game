function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet '題目' not found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  // Remove header row
  const headers = data.shift(); 
  
  // Format questions: { id, question, options: [A, B, C, D], answer }
  const questions = data.map((row, index) => ({
    id: row[0],
    text: row[1],
    options: [row[2], row[3], row[4], row[5]],
    answer: row[6] // Assuming answer is the text of the correct option or index (A/B/C/D)
  }));

  // Shuffle and pick N questions (default 10)
  const count = e.parameter.count ? parseInt(e.parameter.count) : 10;
  const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, count);

  // Return JSON without the answer field for security (optional, or kept for validation on client but insecure)
  // For security, better to validate on server, but for this simple game, sending answers is easier for client-side logic.
  // Requirement says "不包含解答欄位" in "題目來源" section? 
  // "題目來源：透過 Google Apps Script 從指定 Google Sheets 的「題目」工作表隨機撈取 N 題（不包含解答欄位）"
  // So we must remove answer from response.
  
  const clientQuestions = shuffled.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options,
    // No answer field
  }));
  
  // However, how do we grade? 
  // "成績計算：將作答結果傳送到 Google Apps Script 計算成績"
  // So client sends answers, server calculates score.
  // But wait, user wants immediate feedback? 
  // If we don't send answers, client acts as UI only.
  // Let's store the session or just validate answers in doPost?
  // User flow: "成績計算：將作答結果傳送到 Google Apps Script 計算成績"
  // So the client submits the choices, and server returns the score.
  // But usually quiz games show result immediately.
  // If we want immediate feedback per question (e.g. green/red highlight), we need answers or validatation API.
  // Given "闖關問答", maybe we submit at the end?
  // Let's assume submit at the end for "成績計算".
  // Or maybe verification per question?
  // The requirement says "成績計算：將作答結果傳送到 Google Apps Script 計算成績，並記錄"
  // This implies the calculation happens on server.
  // But for better UX, maybe we can send a hash of the answer? or just simple 
  // validation API.
  // HOWEVER, to keep it simple and match "不包含解答欄位", 
  // I will return questions without answers.
  // AND I'll provide a `doPost` that accepts answers and calculates score.
  // BUT the client needs to show "Correct/Incorrect" visually?
  // If so, client needs to know.
  // Maybe I'll add a `checkAnswer` endpoint? Or just return all answers encrypted?
  // To stick to requirements: 
  // Server returns questions (no answers).
  // Client collects user answers.
  // Client submits all answers to `doPost`.
  // `doPost` calculates score, records it, and returns the result (score, pass/fail).
  
  return ContentService.createTextOutput(JSON.stringify({ questions: clientQuestions }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const id = params.id;
    const userAnswers = params.answers; // Expect { questionId: "A", ... } or similar
    
    if (!id || !userAnswers) {
      throw new Error("Missing ID or answers");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Calculate Score
    const qSheet = ss.getSheetByName("題目");
    const qData = qSheet.getDataRange().getValues();
    qData.shift(); // header
    
    let score = 0;
    let correctCount = 0;
    const totalQuestions = Object.keys(userAnswers).length;
    
    // Create a map of correct answers
    const answerMap = {};
    qData.forEach(row => {
      // row[0] is ID, row[6] is Answer (e.g., "A", "B", "C", "D" or exact text)
      // Assuming Answer column contains the option TEXT or LABEL.
      // Let's assume verification is by exact match of the option text or "A"/"B"/"C"/"D".
      // We'll standardise in instructions.
      answerMap[row[0]] = String(row[6]).trim();
    });

    for (const [qId, ans] of Object.entries(userAnswers)) {
      if (answerMap[qId] && answerMap[qId] === String(ans).trim()) {
        score += 10; // 10 points per question? Or 100/total? 
        // Let's define 100/N later, but simply: score = (correct / total) * 100
        correctCount++;
      }
    }
    
    // Calculate final score
    // If totalQuestions passed is 0, score 0.
    const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Record to "回答" sheet
    const recordSheet = ss.getSheetByName("回答");
    if (!recordSheet) {
      throw new Error("Sheet '回答' not found");
    }
    
    const records = recordSheet.getDataRange().getValues();
    let rowIndex = -1;
    let attempts = 0;
    let currentHigh = 0;
    let firstScore = null;
    
    // Find existing user
    // records[0] is header
    for (let i = 1; i < records.length; i++) {
        if (String(records[i][0]) === String(id)) {
            rowIndex = i + 1; // 1-based index
            attempts = records[i][1];
            currentHigh = records[i][3];
            firstScore = records[i][4];
            break;
        }
    }
    
    const now = new Date();
    
    if (rowIndex === -1) {
        // New user
        recordSheet.appendRow([
            id, 
            1, // attempts
            finalScore, // score of this run (implied '總分' means 'Current Run Score' or 'Total Accumulated'? Usually 'Score' is this run)
            finalScore, // high score
            finalScore, // first score
            correctCount, // '花費幾次通關'? This field usually means 'Attempts to Pass'. 
            // If passed, we set it. If not, maybe leave blank?
            // Requirement: "花了幾次通關"
            // Let's logic: if score >= threshold and we haven't passed before... 
            // But we don't know threshold here easily unless passed.
            // Let's just record "Attempts" which is 1. 
            // Maybe "pass_attempts" logic needs client pass threshold? 
            // Or we assume a fixed threshold.
            // Let's write text "N/A" if not passed? 
            // Or just update it if this run is a pass.
            // For now, let's just use '1' as attempts count.
            // Wait, "ID、闖關次數、總分、最高分、第一次通關分數"
            // 3rd col "總分" might be "Last Score"? Or "Total Score across games" (unlikely for quiz).
            // I will assume "Last Score".
            now
        ]);
    } else {
        // Update existing
        const newAttempts = attempts + 1;
        const newHigh = Math.max(currentHigh, finalScore);
        // "第一次通關分數" - if already set, don't touch. If not set and this is a pass? 
        // We don't verify pass here strictly unless we know threshold. 
        // Let's keep existing logic: "若同 ID 已通關過，後續分數不覆蓋" -> implies we track if passed.
        // If firstScore is not empty/null, we preserve it. 
        // If it is empty, we update it IF this is a pass? OR just set it to current if it's the first time?
        // Requirement: "第一次通關分數（若同 ID 已通關過，後續分數不覆蓋...）"
        // This implies we write it only the first time they PASS. 
        // But we don't know if they pass without threshold. 
        // I will take 'pass_threshold' as a parameter or assume 60?
        // Better: client sends 'passed' boolean? No, insecure.
        // I will add a config variable at top of script or assume standard 60 or just record it if it's the *first run*?
        // "第一次通關分數" sounds like "Score of First *Successful* Run".
        
        // Let's assume we update 'Last Score', 'High Score', 'Attempts', 'Time'.
        // For 'First Pass Score', I'll leave logic simple: 
        // If (existing 'First Pass Score' is empty AND finalScore >= 60), update it.
        // Assuming 60 is pass. Or user sets it.
        
        recordSheet.getRange(rowIndex, 2).setValue(newAttempts);
        recordSheet.getRange(rowIndex, 3).setValue(finalScore); // Update last score
        recordSheet.getRange(rowIndex, 4).setValue(newHigh);
        
        // Logic for First Pass Score is tricky without config. 
        // I'll update it if it's empty, regardless of score, OR assume 60.
        // Let's just update it if (existing is blank).
        if (firstScore === "" || firstScore === null) {
           // recordSheet.getRange(rowIndex, 5).setValue(finalScore); 
           // Only if passed? I will leave a comment for user to adjust threshold.
           if (finalScore >= 60) { // Default threshold
              recordSheet.getRange(rowIndex, 5).setValue(finalScore);
              // "花了幾次通關" -> set to newAttempts
              recordSheet.getRange(rowIndex, 6).setValue(newAttempts);
           }
        }
        
        recordSheet.getRange(rowIndex, 7).setValue(now);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      score: finalScore, 
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      pass: finalScore >= 60 // Default, can be ignored by client
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
