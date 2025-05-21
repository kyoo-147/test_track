FROM node:18-alpine

WORKDIR /app

# 1. Copy dependencies trước để tận dụng cache
COPY package.json package-lock.json ./
RUN npm install

# 2. Copy toàn bộ source (trừ các file .dockerignore)
COPY . .

# 3. Cấu hình live-reload an toàn
ENV CHOKIDAR_USEPOLLING=true \
    CHOKIDAR_INTERVAL=100 \
    CHOKIDAR_IGNORE=node_modules,build \
    NODE_OPTIONS=--max-old-space-size=1024

EXPOSE 3000

CMD ["npm", "start"]
