# 빌드
FROM node:20-alpine AS build

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 실행
FROM node:20-alpine

WORKDIR /app

# 실행에 필요한 파일 복사
COPY package*.json ./
RUN npm install --omit=dev

# 빌드 스테이지에서 생성된 정적 파일(dist)
COPY --from=build /app/dist ./dist

# 환경 변수 및 포트 설정
ENV NODE_ENV=production
EXPOSE 8081

# 실행 파일 경로가 dist/index.js 인지 확인해 주세요.
CMD ["node", "dist/app.js"]
