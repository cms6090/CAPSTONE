import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import jwt from 'jsonwebtoken';

const AdminRouter = express.Router();

// 관리자 권한 검증 미들웨어
const verifyAdmin = async (req, res, next) => {
  try {
    // 헤더에서 토큰을 가져옴
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      // 토큰이 없으면 인증 오류 발생
      throw new StatusError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    // 토큰을 검증하고 디코드된 정보를 가져옴
    let decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    if (decoded.permission !== '관리자') {
      // 관리자 권한이 없으면 접근 금지 오류 발생
      throw new StatusError('Forbidden', StatusCodes.FORBIDDEN);
    }
    req.user = decoded; // 요청에 디코드된 사용자 정보를 추가
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // 토큰이 만료된 경우
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    } else {
      // 다른 오류는 다음 미들웨어로 전달
      next(error);
    }
  }
};

/*---------------------------------------------
    [모든 사용자 정보 조회]
---------------------------------------------*/
AdminRouter.get('/users', verifyAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query; // 페이지네이션을 위한 쿼리 파라미터 설정
    const users = await prisma.users.findMany({
      skip: (page - 1) * limit, // 페이지에 따라 건너뛸 사용자 수 계산
      take: parseInt(limit), // 한 페이지에 가져올 사용자 수
    });
    return res.status(StatusCodes.OK).json(users); // 사용자 목록 반환
  } catch (error) {
    console.error('Error fetching user data:', error); // 사용자 데이터를 가져오는 중 오류 발생 시 로그 출력
    next(new StatusError('Failed to fetch user data', StatusCodes.INTERNAL_SERVER_ERROR)); // 오류 발생 시 오류 처리 미들웨어로 전달
  }
});

/*---------------------------------------------
    [사용자 업데이트]
---------------------------------------------*/
AdminRouter.put('/users/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 사용자 ID 추출
    const { user_name, phone_number, gender, birth, permission } = req.body; // 요청 본문에서 업데이트할 데이터 추출

    // 요청 데이터 출력 (디버깅 용도)
    console.log('요청된 업데이트 데이터:', req.body); // 전체 업데이트 데이터 출력
    console.log('추출된 user_name:', user_name); // 특정 필드 데이터 확인

    // 필수 필드가 모두 제공되었는지 확인
    if (!user_name || !phone_number || !gender || !birth || !permission) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '모든 필드를 올바르게 입력해야 합니다.',
      });
    }

    // 사용자 정보를 업데이트
    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: {
        user_name,
        phone_number,
        gender,
        birth,
        permission, // 수정할 권한 필드를 명시적으로 설정
        updated_at: new Date(), // 수정 시간 갱신
      },
    });

    return res.status(StatusCodes.OK).json({
      message: '사용자 정보 업데이트 성공',
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma 특정 오류: 업데이트할 레코드를 찾을 수 없음
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '사용자를 찾을 수 없습니다.',
      });
    } else {
      console.error('사용자 업데이트 오류:', error); // 사용자 업데이트 중 오류 발생 시 로그 출력
      return next(
        new StatusError(
          '사용자 정보를 업데이트하는 중 오류가 발생했습니다.',
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
});

/*---------------------------------------------
    [사용자 삭제]
---------------------------------------------*/
AdminRouter.delete('/users/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 사용자 ID 추출

    // ID가 유효한 숫자인지 확인
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user ID provided.' });
    }

    // 사용자 삭제 시도
    const deletedUser = await prisma.users.delete({
      where: { user_id: Number(id) },
    });

    // 삭제 성공 시 메시지 반환
    return res.status(StatusCodes.OK).json({ message: '사용자 삭제 성공', user: deletedUser });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma 특정 오류: 삭제할 레코드를 찾을 수 없음
      return res.status(StatusCodes.NOT_FOUND).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 오류를 로그로 출력하고 다음 미들웨어로 전달
    console.error('Error deleting user:', error);
    next(
      new StatusError(
        '사용자를 삭제하는 중 오류가 발생했습니다.',
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
    );
  }
});

/*---------------------------------------------
    [모든 예약 정보 조회]
---------------------------------------------*/
AdminRouter.get('/reservations', verifyAdmin, async (req, res, next) => {
  try {
    const reservations = await prisma.reservations.findMany(); // 모든 예약 정보를 조회
    return res.status(StatusCodes.OK).json(reservations); // 예약 정보 반환
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [예약 업데이트]
---------------------------------------------*/
AdminRouter.put('/reservations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 예약 ID 추출
    const { status, check_in, check_out } = req.body; // 업데이트할 예약 정보 추출
    const updatedReservation = await prisma.reservations.update({
      where: { reservation_id: Number(id) },
      data: {
        status,
        check_in,
        check_out,
        updated_at: new Date(), // 수정 시간 갱신
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '예약 정보 업데이트 성공', reservation: updatedReservation });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [예약 삭제]
---------------------------------------------*/
AdminRouter.delete('/reservations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 예약 ID 추출
    await prisma.reservations.delete({
      where: { reservation_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '예약 삭제 성공' });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [모든 숙소 정보 조회]
---------------------------------------------*/
AdminRouter.get('/accommodations', verifyAdmin, async (req, res, next) => {
  try {
    const accommodations = await prisma.accommodations.findMany(); // 모든 숙소 정보를 조회
    return res.status(StatusCodes.OK).json(accommodations); // 숙소 정보 반환
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [숙소 업데이트]
---------------------------------------------*/
AdminRouter.put('/accommodations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 숙소 ID 추출
    const { name, location, description } = req.body; // 업데이트할 숙소 정보 추출
    const updatedAccommodation = await prisma.accommodations.update({
      where: { accommodation_id: Number(id) },
      data: {
        name,
        location,
        description,
        updated_at: new Date(), // 수정 시간 갱신
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '숙소 정보 업데이트 성공', accommodation: updatedAccommodation });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [숙소 삭제]
---------------------------------------------*/
AdminRouter.delete('/accommodations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 숙소 ID 추출
    await prisma.accommodations.delete({
      where: { accommodation_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '숙소 삭제 성공' });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [모든 객실 정보 조회]
---------------------------------------------*/
AdminRouter.get('/rooms', verifyAdmin, async (req, res, next) => {
  try {
    const rooms = await prisma.rooms.findMany(); // 모든 객실 정보를 조회
    return res.status(StatusCodes.OK).json(rooms); // 객실 정보 반환
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [객실 업데이트]
---------------------------------------------*/
AdminRouter.put('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 객실 ID 추출
    const { name, type, price } = req.body; // 업데이트할 객실 정보 추출
    const updatedRoom = await prisma.rooms.update({
      where: { room_id: Number(id) },
      data: {
        name,
        type,
        price,
        updated_at: new Date(), // 수정 시간 갱신
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '객실 정보 업데이트 성공', room: updatedRoom });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [객실 삭제]
---------------------------------------------*/
AdminRouter.delete('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 객실 ID 추출
    await prisma.rooms.delete({
      where: { room_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '객실 삭제 성공' });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [모든 리뷰 정보 조회]
---------------------------------------------*/
AdminRouter.get('/reviews', verifyAdmin, async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.findMany(); // 모든 리뷰 정보를 조회
    return res.status(StatusCodes.OK).json(reviews); // 리뷰 정보 반환
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [리뷰 업데이트]
---------------------------------------------*/
AdminRouter.put('/reviews/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 리뷰 ID 추출
    const { content, rating } = req.body; // 업데이트할 리뷰 정보 추출
    const updatedReview = await prisma.reviews.update({
      where: { review_id: Number(id) },
      data: {
        content,
        rating,
        updated_at: new Date(), // 수정 시간 갱신
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '리뷰 정보 업데이트 성공', review: updatedReview });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
    [리뷰 삭제]
---------------------------------------------*/
AdminRouter.delete('/reviews/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 리뷰 ID 추출
    await prisma.reviews.delete({
      where: { review_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '리뷰 삭제 성공' });
  } catch (error) {
    next(error); // 오류 발생 시 다음 미들웨어로 전달
  }
});

export default AdminRouter;
