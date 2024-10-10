import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import accommodationsRouter from './routes/accommodation.router.js';
import cors from 'cors';

import errorMiddleware from './middlewares/error.middleware.js';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3005', // 클라이언트의 URL을 명시
    credentials: true, // 쿠키 전송을 허용하려면 이 옵션을 추가
    exposedHeaders: ['Authorization'], // 클라이언트에서 접근 가능한 헤더 설정
  }),
);

app.use('/api/users', usersRouter); // usersRouter는 /api/users 경로로 접근
app.use('/api/accommodations', accommodationsRouter); // accommodationsRouter는 /api/accommodations 경로로 접근
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
