# Image Node gọn nhẹ
FROM node:22-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file khai báo thư viện trước để tận dụng cache khi build lại
COPY package*.json ./

# Chỉ cài thư viện production (bỏ nodemon)
RUN npm ci --omit=dev

# Copy mã nguồn
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# Không chạy bằng quyền root (bảo mật)
USER node

CMD ["node", "src/server.js"]