import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3005',  // 클라이언트의 URL을 명시
  credentials: true,  // 쿠키 전송을 허용하려면 이 옵션을 추가
}));
app.use('/api', [usersRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
