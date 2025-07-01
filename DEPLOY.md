# 免費部署指南

這個指南會幫助您免費部署AI聊天應用到網路上，讓所有人都能訪問。

## 🚀 Railway 部署 (推薦 - 最簡單)

Railway 提供免費額度，非常適合這個項目。

### 步驟 1: 準備 GitHub 倉庫
1. 前往 [GitHub](https://github.com)，登入或註冊帳戶
2. 創建新的倉庫 (Repository)
3. 上傳您的項目文件

### 步驟 2: 部署到 Railway
1. 前往 [Railway.app](https://railway.app)
2. 用 GitHub 帳戶登入
3. 點擊 "New Project"
4. 選擇 "Deploy from GitHub repo"
5. 選擇您剛創建的倉庫
6. Railway 會自動檢測並開始部署

### 步驟 3: 設置環境變量
在 Railway 項目中：
1. 點擊您的服務
2. 前往 "Variables" 標籤
3. 添加以下變量：
   ```
   TOGETHER_API_KEY=your_together_ai_key
   OPENAI_API_KEY=your_openai_key (可選)
   ```

### 步驟 4: 添加數據庫
1. 在 Railway 項目中點擊 "New"
2. 選擇 "Database" -> "PostgreSQL"
3. Railway 會自動設置 DATABASE_URL

## 🌐 Render 部署

Render 也提供免費服務，部署步驟類似。

### 步驟：
1. 前往 [Render.com](https://render.com)
2. 註冊並連接 GitHub
3. 創建新的 "Web Service"
4. 連接您的 GitHub 倉庫
5. 設置構建命令：`npm run build`
6. 設置啟動命令：`npm start`
7. 在環境變量中添加 API keys

## 🔑 獲取 API Keys

### Together AI (推薦)
1. 前往 [together.ai](https://together.ai)
2. 註冊帳戶
3. 前往 API 設置頁面
4. 創建新的 API key
5. 複製密鑰

Together AI 價格便宜，支援多種優秀模型：
- DeepSeek-V3 (推薦)
- Llama-3 70B
- Mixtral 8x7B

### OpenAI (可選)
1. 前往 [platform.openai.com](https://platform.openai.com)
2. 註冊並驗證手機號碼
3. 前往 API Keys 頁面
4. 創建新的 API key
5. 複製密鑰

## 💰 成本估算

### 完全免費選項：
- **Railway**: 每月 $5 免費額度
- **Render**: 免費方案 (有限制)
- **數據庫**: PostgreSQL 免費方案
- **域名**: 免費的 .railway.app 或 .render.com 子域名

### API 使用成本：
- **Together AI**: 約 $0.0002 - $0.002 每1000 tokens
- **OpenAI**: 約 $0.0015 - $0.03 每1000 tokens

一般聊天使用每月成本不到 $1。

## ✅ 部署檢查清單

部署完成後，確認以下功能正常：

- [ ] 網站可以正常訪問
- [ ] 用戶註冊功能正常
- [ ] 用戶登入功能正常
- [ ] 可以創建新對話
- [ ] AI 回覆正常工作
- [ ] 對話歷史正確保存
- [ ] 手機版界面正常

## 🆘 常見問題

**Q: 部署失敗怎麼辦？**
A: 檢查構建日誌，通常是環境變量設置問題。

**Q: AI 不回覆怎麼辦？**
A: 檢查 API key 是否正確設置，並確認有剩餘額度。

**Q: 數據庫連接失敗？**
A: 確認 DATABASE_URL 已正確設置。

**Q: 如何更新部署？**
A: 推送新代碼到 GitHub，部署平台會自動重新部署。

## 🎉 部署成功！

部署完成後，您將獲得一個公開 URL，任何人都可以訪問您的AI聊天應用！

記得分享給朋友們體驗！