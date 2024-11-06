# 使用官方的Node.js镜像作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 使用一个轻量级的Web服务器来提供构建后的文件
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 3001

# 启动Nginx服务器
CMD ["nginx", "-g", "daemon off;"]