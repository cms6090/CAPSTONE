import { StatusCodes } from 'http-status-codes';

/**
 * 에러 핸들러 미들웨어
 * @param {*} err - 발생한 에러 객체
 * @param {*} req - 요청 객체
 * @param {*} res - 응답 객체
 * @param {*} next - 다음 미들웨어 함수
 */
export default function (err, req, res, next) {
  // Joi 유효성 검사 오류 처리
  if (err.name === 'ValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `유효성 검사 실패: ${err.message}`,
    });
  }

  // Prisma 클라이언트 검증 오류 처리
  if (err.name === 'PrismaClientValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '요청 데이터값을 확인해주세요.',
    });
  }

  // JWT 인증 오류 처리
  if (err.name === 'JsonWebTokenError') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '유효하지 않은 토큰입니다. 인증이 필요합니다.',
    });
  }

  // 커스텀 에러 처리 (예: CustomError)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 기타 예상치 못한 오류 처리
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: '서버에서 오류가 발생했습니다.',
  });
}
