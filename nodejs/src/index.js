import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(express.json());

app.use('/api', [usersRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
