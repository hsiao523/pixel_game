# Google Apps Script (GAS) 配置說明

本專案使用 Google Sheets 作為簡易資料庫。請依照以下步驟設定後端。

## 1. 建立 Google Sheet
1. 建立一個新的 Google Sheet。
2. 將試算表命名為 `PixelQuizDB`（或其他你喜歡的名字）。
3. 建立兩個工作表 (Tabs)：
   - **題目**
   - **回答**

### 「題目」工作表欄位設定
請在第一列設定以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Question | Option A | Option B | Option C | Option D | Answer |

- **ID**: 題目唯一編號 (如 1, 2, 3...)
- **Question**: 題目內容
- **Option A~D**: 四個選項
- **Answer**: 正確解答 (請填寫完整選項文字，例如與 Option A 內容完全一致，或直接填寫 A/B/C/D 並且在 Code.gs 中調整邏輯。**預設 Code.gs 邏輯為比對「選項內容文字」**)

### 「回答」工作表欄位設定
請在第一列設定以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| UserID | Attempts | LastScore | HighScore | FirstPassScore | PassAttempts | LastPlayed |

- **UserID**: 玩家輸入的 ID
- **Attempts**: 總遊玩次數
- **LastScore**: 最近一次分數
- **HighScore**: 最高分
- **FirstPassScore**: 第一次通關時的分數
- **PassAttempts**: 通關時花費的嘗試次數
- **LastPlayed**: 最近遊玩時間

## 2. 設定 Google Apps Script
1. 在 Google Sheet 中，點選 `擴充功能` > `Apps Script`。
2. 將專案中的 `Code.gs` 內容複製貼上到編輯器中。
3. 儲存專案。

## 3. 部署 Web App
1. 點選右上角 `部署` > `新增部署`。
2. 點選「選取類型」齒輪圖示 > check `網頁應用程式`。
3. 設定如下：
   - **執行身分**: `我` (Me)
   - **存取權**: `任何人` (Anyone)  <-- **重要！否則前端無法呼叫**
4. 點選 `部署`。
5. 複製產生的 `網頁應用程式網址 (Web App URL)`。

## 4. 設定前端環境變數
1. 回到本專案，建立或編輯 `.env` 檔案。
2. 填入剛剛複製的網址：
   ```
   VITE_GOOGLE_APP_SCRIPT_URL=你的Web_App_URL
   ```
