const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

export const fetchQuestions = async (count = 10) => {
    if (!GAS_URL) {
        console.warn("GAS URL not set. Returning mock data.");
        return mockQuestions(count);
    }

    try {
        console.log("Fetching from GAS URL:", GAS_URL);
        const response = await fetch(`${GAS_URL}?count=${count}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.questions;
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        throw error; // Propagate error to UI
    }
};

export const submitScore = async (id, answers) => {
    if (!GAS_URL) {
        console.warn("GAS URL not set. Mocking submission.");
        return { score: calculateMockScore(answers), pass: true };
    }

    try {
        // GAS doPost requires text/plain or preventing CORS preflight issues sometimes.
        // Standard fetch with POST and body usually works if GAS is set to Anyone.
        const response = await fetch(GAS_URL, {
            method: "POST",
            body: JSON.stringify({ id, answers }),
            // headers: { "Content-Type": "text/plain;charset=utf-8" } 
            // GAS doesn't like application/json content-type with CORS sometimes, 
            // text/plain is safer.
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to submit score:", error);
        throw error;
    }
};

// Mock Data for development
const mockQuestions = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `mock-${i}`,
        text: `Mock Question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"]
    }));
};

const calculateMockScore = (answers) => {
    // Random score
    return Math.floor(Math.random() * 100);
}
