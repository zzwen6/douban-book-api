# VERSION 1.1
# Author: acdzh <acdzh@outlook.com>
FROM node:alpine

# npm 源，默认国内镜像；海外构建可用 --build-arg NPM_REGISTRY=https://registry.npmjs.org/ 覆盖
ARG NPM_REGISTRY=https://registry.npmmirror.com/

WORKDIR /data/app
VOLUME /cache
ENV CACHE_DIR=/cache

# 先只拷依赖清单，利用构建缓存；npm 会把 lock 里的 registry.npmjs.org 地址替换为配置的源
COPY package.json package-lock.json ./
RUN npm config set registry "${NPM_REGISTRY}" \
    && npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
