# 使用 Node.js 18 LTS
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 暴露端口
EXPOSE 5000

# 設置環境變量
ENV NODE_ENV=production
ENV PORT=5000

# 啟動應用
CMD ["npm", "start"]