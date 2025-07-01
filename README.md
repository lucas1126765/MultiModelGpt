# AI 多模型聊天應用

一個功能完整的AI聊天應用，支持多種AI模型，包含用戶認證系統和數據持久化。

## 功能特點

- 🤖 **多AI模型支持**: DeepSeek-V3、Llama-3 70B、Mixtral 8x7B、GPT-4o、GPT-3.5 Turbo
- 👤 **用戶系統**: 完整的註冊、登入功能
- 💬 **對話管理**: 創建、保存、切換多個對話
- 📱 **響應式設計**: 支持手機和桌面設備
- 🎨 **現代UI**: 使用 shadcn/ui 和 Tailwind CSS
- 💾 **數據持久化**: PostgreSQL 數據庫存儲

## 免費部署選項

### 1. Railway (推薦)
```bash
# 1. Fork 這個項目到你的 GitHub
# 2. 前往 railway.app 並用 GitHub 登入
# 3. 點擊 "New Project" -> "Deploy from GitHub repo"
# 4. 選擇你 fork 的項目
# 5. Railway 會自動檢測並部署
```

### 2. Render
```bash
# 1. 前往 render.com 並註冊
# 2. 創建新的 Web Service
# 3. 連接你的 GitHub 倉庫
# 4. 設置環境變量 (見下方)
# 5. 點擊部署
```

### 3. Vercel (僅前端)
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 環境變量設置

在部署平台中設置以下環境變量：

```env
# AI API Keys (至少需要一個)
OPENAI_API_KEY=your_openai_key_here
TOGETHER_API_KEY=your_together_ai_key_here

# 數據庫 (部署平台通常會自動提供)
DATABASE_URL=your_postgresql_url_here
```

## 本地運行

```bash
# 克隆項目
git clone your-repo-url
cd ai-chat-app

# 安裝依賴
npm install

# 設置環境變量
cp .env.example .env
# 編輯 .env 文件添加你的 API keys

# 推送數據庫結構
npm run db:push

# 啟動開發服務器
npm run dev
```

## 獲取 API Keys

### Together AI (推薦 - 便宜且功能強大)
1. 前往 [together.ai](https://together.ai)
2. 註冊帳戶
3. 前往 API Keys 頁面
4. 創建新的 API key
5. 複製 API key 到環境變量

### OpenAI
1. 前往 [platform.openai.com](https://platform.openai.com)
2. 登入或註冊
3. 前往 API Keys 頁面
4. 創建新的 API key
5. 複製 API key 到環境變量

## 部署後測試

1. 訪問你的部署URL
2. 註冊一個新帳戶
3. 創建新對話
4. 測試不同的AI模型
5. 確認對話歷史正確保存

## 技術棧

- **前端**: React + TypeScript + Tailwind CSS
- **後端**: Express.js + TypeScript
- **數據庫**: PostgreSQL + Drizzle ORM
- **AI服務**: Together AI + OpenAI
- **構建工具**: Vite + ESBuild

## 支援

如果遇到問題，請檢查：
1. 環境變量是否正確設置
2. API keys 是否有效
3. 數據庫連接是否正常
4. 查看部署平台的日誌

## 許可證

MIT License - 可自由使用和修改