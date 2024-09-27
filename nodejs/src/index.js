const express = require('express');
const app = express();
const PORT = 3000;

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('node.js 서버가 3000번 포트에서 실행 중입니다!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`nodejs 서버가 ${PORT} 포트에서 실행 중입니다.`);
});
