import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const [tokenType, tokenValue] = authHeader.split(' ');

  if (tokenType !== 'Bearer' || !tokenValue) {
    return res.status(401).json({ message: '유효하지 않은 토큰 형식입니다.' });
  }

  try {
    // 토큰 검증
    const decodedToken = jwt.verify(tokenValue, process.env.ACCESS_SECRET_KEY);

    // 사용자 ID를 요청 객체에 저장
    req.userId = decodedToken.id;

    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: '토큰 검증에 실패했습니다.' });
  }
};

export default auth;
