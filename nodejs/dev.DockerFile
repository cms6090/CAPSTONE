# Node.js 개발 환경 설정
FROM node:22-alpine

# 작업 디렉토리 생성
WORKDIR /usr/back/app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성 (필요한 경우 주석 해제)
# RUN npx prisma generate

# 포트 노출
EXPOSE 3000