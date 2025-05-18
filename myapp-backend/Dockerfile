# Sử dụng Node.js LTS làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Thiết lập biến môi trường
ENV PORT=5000
ENV NODE_ENV=production

# Mở cổng 5000
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "server"]