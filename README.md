# Pixel Quiz Game (像素風闖關問答)

復古像素風格的問答遊戲，使用 React + Vite 開發，並以 Google Apps Script (GAS) 作為後端與資料庫。

## 🎮 遊戲特色
- **像素風格**: 2000 年代街機復古設計
- **關主挑戰**: 整合 DiceBear API 動態生成關主
- **即時排名**: 串接 Google Sheets 記錄成績與排名

## 🚀 快速開始

### 1. 安裝與執行
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 2. 環境變數設定
請參考 `.env.example` 建立 `.env` 檔案：
```bash
```bash
```bash
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyI3v7VLYxfw1p_3xoZrUjKpMZkWEY0elgRPj7K1nE-LP7CfiI1OsRq--YmaH45nRTz/exec
```
```
VITE_PASS_THRESHOLD=60
```markdown
VITE_QUESTION_COUNT=50
```
```
*完整的 GAS 後端設定請參考 `GAS_README.md`*

## 📦 部署到 GitHub Pages

本專案已設定 GitHub Actions 自動部署流程。

### 設定步驟
1. 將專案推送到 GitHub Repository。
2. 進入 Repo 的 **Settings** > **Secrets and variables** > **Actions**。
3. 點選 **New repository secret**，新增以下變數 (內容參考你的 `.env`)：
   - `VITE_GOOGLE_APP_SCRIPT_URL`
   - `VITE_PASS_THRESHOLD`
   - `VITE_QUESTION_COUNT`
4. 進入 **Settings** > **Pages**。
   - **Source**: 選擇 `GitHub Actions`。
5. 推送程式碼到 `main` 或 `master` 分支，GitHub Actions 將會自動觸發並部署。

---
Developed with ❤️ by [Your Name]
