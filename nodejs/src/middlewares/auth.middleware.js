import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  try {
    const [tokenType, tokenValue] = token.split(' ');

    if (tokenType !== 'Bearer' || !tokenValue) {
      return res.status(401).json({ message: '유효하지 않은 토큰 형식입니다.' });
    }

    const decodedToken = jwt.verify(tokenValue, process.env.ACCESS_SECRET_KEY);
    console.log(decodedToken);

    req.userId = decodedToken.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: '토큰 검증에 실패했습니다.' });
  }
};

export default auth;
