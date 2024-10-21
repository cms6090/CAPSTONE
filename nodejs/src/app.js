import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import usersRouter from './routes/users.router.js';
import accommodationsRouter from './routes/accommodation.router.js';
import adminRouter from './routes/admin.router.js';
import cors from 'cors';
import errorMiddleware from './middlewares/error.middleware.js';
import reservationsRouter from './routes/reservations.routers.js';
import reviewsRouter from './routes/review.router.js';

// ES Module에서 __dirname 대체 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

dotenv.config();

// JSON 형식의 요청 본문을 처리하기 위한 미들웨어 설정
app.use(express.json());

// CORS 설정
app.use(
  cors({
    origin: 'http://localhost:3005', // 클라이언트의 URL을 명시
    credentials: true, // 쿠키 전송을 허용하려면 이 옵션을 추가
    exposedHeaders: ['Authorization'], // 클라이언트에서 접근 가능한 헤더 설정
  }),
);

// 정적 파일 서빙 설정: 업로드된 리뷰 이미지 등에 접근하기 위한 설정
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads', 'reviews')));

// 라우터 설정
app.use('/api/users', usersRouter); // usersRouter는 /api/users 경로로 접근
app.use('/api/accommodations', accommodationsRouter); // accommodationsRouter는 /api/accommodations 경로로 접근
app.use('/api/admin', adminRouter); // adminRouter는 /api/admin 경로로 접근
app.use('/api/reservations', reservationsRouter); // reservationsRouter는 /api/reservations 경로로 접근
app.use('/api/reviews', reviewsRouter); // reviewsRouter는 /api/reviews 경로로 접근

// 에러 처리 미들웨어 설정
app.use(errorMiddleware);

// 서버 시작
app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
