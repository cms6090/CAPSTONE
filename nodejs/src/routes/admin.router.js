import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

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
    const users = await prisma.users.findMany(); // 데이터베이스에서 모든 사용자 가져오기
    return res.status(StatusCodes.OK).json(users); // 사용자 목록 반환
  } catch (error) {
    console.error('Error fetching user data:', error); // 오류 발생 시 로그 출력
    next(new StatusError('Failed to fetch user data', StatusCodes.INTERNAL_SERVER_ERROR)); // 오류 처리 미들웨어로 전달
  }
});

/*---------------------------------------------
      [사용자 업데이트]
  ---------------------------------------------*/
AdminRouter.put('/users/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 사용자 ID 추출
    const { user_name, phone_number, gender, birth, permission } = req.body; // 요청 본문에서 업데이트할 데이터 추출

    // 필수 필드가 모두 제공되었는지 확인
    if (!user_name || !phone_number || !gender || !birth || !permission) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '모든 필드를 올바르게 입력해야 합니다.',
      });
    }

    // birth 값을 dayjs로 Date 객체로 변환
    const birthDate = dayjs(birth).toDate();

    // 사용자 정보를 업데이트
    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: {
        user_name,
        phone_number,
        gender,
        birth: birthDate, // 변환된 Date 객체 사용
        permission,
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
// AdminRouter.js
AdminRouter.get('/reservations', verifyAdmin, async (req, res, next) => {
  try {
    // 'users', 'rooms', 'lodgings' 관계를 올바르게 참조하여 사용자 이메일, 객실 이름, 숙소 이름을 포함한 예약 정보를 가져옴
    const reservations = await prisma.reservations.findMany({
      include: {
        users: {
          select: {
            email: true, // users 테이블에서 이메일 필드만 선택
          },
        },
        rooms: {
          select: {
            room_name: true, // rooms 테이블에서 room_name 필드만 선택
            lodging_id: true, // 나중에 숙소 정보를 찾기 위해 lodging_id 포함
            lodgings: {
              // lodgings 관계 추가
              select: {
                name: true, // lodgings 테이블에서 숙소 이름 선택
              },
            },
          },
        },
      },
    });

    // reservations 객체에 'user_email', 'room_name', 'lodging_name'을 포함하여 매핑
    const reservationsWithDetails = reservations.map((reservation) => ({
      ...reservation,
      user_email: reservation.users ? reservation.users.email : null, // 사용자 정보가 없을 경우 처리
      room_name: reservation.rooms ? reservation.rooms.room_name : null, // 객실 정보가 없을 경우 처리
      lodging_name:
        reservation.rooms && reservation.rooms.lodgings ? reservation.rooms.lodgings.name : null, // lodgings 정보를 이용해 숙소 이름 조회
    }));

    return res.status(StatusCodes.OK).json(reservationsWithDetails); // 수정된 예약 정보 반환
  } catch (error) {
    next(error); // 오류가 발생하면 다음 미들웨어로 전달
  }
});

/*---------------------------------------------
      [예약 업데이트]
  ---------------------------------------------*/
AdminRouter.put('/reservations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract reservation ID from URL
    const { status, check_in_date, check_out_date, person_num, total_price } = req.body; // Extract reservation info to update

    const updatedReservation = await prisma.reservations.update({
      where: { reservation_id: Number(id) },
      data: {
        status,
        check_in_date: new Date(check_in_date), // Update check-in date
        check_out_date: new Date(check_out_date), // Update check-out date
        person_num, // Update number of persons
        total_price, // Update total price if necessary
        updated_at: new Date(), // Update modification timestamp
      },
    });

    return res.status(StatusCodes.OK).json({
      message: '예약 정보 업데이트 성공',
      reservation: updatedReservation,
    });
  } catch (error) {
    next(error); // Pass errors to the next middleware
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
AdminRouter.get('/lodgings', verifyAdmin, async (req, res, next) => {
  try {
    // Fetch all lodgings without pagination
    const lodgings = await prisma.lodgings.findMany(); // Fetch all lodgings
    return res.status(StatusCodes.OK).json({ lodgings }); // Send all lodgings as response
  } catch (error) {
    console.error('Error fetching lodgings data:', error); // Log output when an error occurs
    next(new StatusError('Failed to fetch lodgings data', StatusCodes.INTERNAL_SERVER_ERROR)); // Passed to error handling middleware
  }
});

/*---------------------------------------------
      [숙소 업데이트]
  ---------------------------------------------*/
AdminRouter.put('/lodgings/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // Extract lodging ID from URL

    const { name, part, area, sigungu, address, rating, tel, main_image } = req.body; // Extract fields from request body

    // Validate that required fields are provided
    if (!name || !part || !area || !address) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '필수 필드를 모두 입력해야 합니다. (name, part, area, address)',
      });
    }

    // Check if the record exists before updating
    const existingLodging = await prisma.lodgings.findUnique({
      where: { lodging_id: Number(id) },
    });

    if (!existingLodging) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '숙소를 찾을 수 없습니다.',
      });
    }

    // Update the lodging information in the database
    const updatedLodging = await prisma.lodgings.update({
      where: { lodging_id: Number(id) },
      data: {
        name,
        part,
        area,
        sigungu,
        address,
        rating,
        tel,
        main_image,
        updated_at: new Date(), // Set the update time explicitly if needed
      },
    });

    // Respond with success message
    return res.status(StatusCodes.OK).json({
      message: '숙소 정보 업데이트 성공',
      lodging: updatedLodging,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma specific error: Record to update not found
      console.error('Prisma Error - Record Not Found:', error);
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '숙소를 찾을 수 없습니다.',
      });
    } else {
      console.error('숙소 업데이트 오류:', error);
      return next(
        new StatusError(
          '숙소 정보를 업데이트하는 중 오류가 발생했습니다.',
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
});

/*---------------------------------------------
      [숙소 삭제]
  ---------------------------------------------*/
AdminRouter.delete('/lodgings/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 숙소 ID 추출

    // ID가 유효한 숫자인지 확인
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid lodging ID provided.' });
    }

    // 숙소 삭제 시도
    const deletedLodging = await prisma.lodgings.delete({
      where: { lodging_id: Number(id) },
    });

    // 삭제 성공 시 메시지 반환
    return res.status(StatusCodes.OK).json({ message: '숙소 삭제 성공', lodging: deletedLodging });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma 특정 오류: 삭제할 레코드를 찾을 수 없음
      return res.status(StatusCodes.NOT_FOUND).json({ message: '숙소를 찾을 수 없습니다.' });
    }

    // 오류를 로그로 출력하고 다음 미들웨어로 전달
    console.error('Error deleting lodging:', error);
    next(
      new StatusError('숙소를 삭제하는 중 오류가 발생했습니다.', StatusCodes.INTERNAL_SERVER_ERROR),
    );
  }
});

/*---------------------------------------------
      [모든 객실 정보 조회]
  ---------------------------------------------*/
AdminRouter.get('/rooms', verifyAdmin, async (req, res, next) => {
  try {
    // Fetch all rooms and include the related lodging name
    const rooms = await prisma.rooms.findMany({
      include: {
        lodgings: {
          select: {
            name: true, // Include lodging name
          },
        },
      },
    });
    return res.status(StatusCodes.OK).json(rooms); // Return rooms correctly
  } catch (error) {
    console.error('Error fetching rooms data:', error); // Log output when an error occurs
    next(new StatusError('Failed to fetch rooms data', StatusCodes.INTERNAL_SERVER_ERROR)); // Pass to error handling middleware
  }
});

/*---------------------------------------------
      [객실 업데이트]
  ---------------------------------------------*/
AdminRouter.put('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 객실 ID 추출

    const { room_name, room_count, price_per_night, min_occupancy, max_occupancy } = req.body; // 업데이트할 객실 정보 추출

    // Validate that required fields are provided
    if (!room_name || !room_count || !price_per_night || !min_occupancy || !max_occupancy) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          '필수 필드를 모두 입력해야 합니다. (room_name, room_count, price_per_night, min_occupancy, max_occupancy)',
      });
    }

    // Check if the record exists before updating
    const existingRooms = await prisma.rooms.findUnique({
      where: { room_id: Number(id) },
    });

    if (!existingRooms) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '숙소를 찾을 수 없습니다.',
      });
    }

    const updatedRoom = await prisma.rooms.update({
      where: { room_id: Number(id) },
      data: {
        room_name,
        room_count,
        price_per_night,
        min_occupancy,
        max_occupancy,
      },
    });

    // Respond with success message
    return res.status(StatusCodes.OK).json({
      message: '객실 정보 업데이트 성공',
      lodging: updatedRoom,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma specific error: Record to update not found
      console.error('Prisma Error - Record Not Found:', error);
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '객실을 찾을 수 없습니다.',
      });
    } else {
      console.error('객실 업데이트 오류:', error);
      return next(
        new StatusError(
          '객실 정보를 업데이트하는 중 오류가 발생했습니다.',
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
});

/*---------------------------------------------
      [객실 삭제]
  ---------------------------------------------*/
AdminRouter.delete('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 객실 ID 추출

    // ID가 유효한 숫자인지 확인
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid room ID provided.' });
    }

    // 숙소 삭제 시도
    const deletedRoom = await prisma.rooms.delete({
      where: { room_id: Number(id) },
    });

    // 삭제 성공 시 메시지 반환
    return res.status(StatusCodes.OK).json({ message: '객실 삭제 성공', room: deletedRoom });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma 특정 오류: 삭제할 레코드를 찾을 수 없음
      return res.status(StatusCodes.NOT_FOUND).json({ message: '객실을 찾을 수 없습니다.' });
    }

    // 오류를 로그로 출력하고 다음 미들웨어로 전달
    console.error('Error deleting room:', error);
    next(
      new StatusError('객실을 삭제하는 중 오류가 발생했습니다.', StatusCodes.INTERNAL_SERVER_ERROR),
    );
  }
});

/*---------------------------------------------
      [모든 리뷰 정보 조회]
  ---------------------------------------------*/
AdminRouter.get('/reviews', verifyAdmin, async (req, res, next) => {
  try {
    // 리뷰 정보와 함께 숙소 이름 및 사진 정보도 가져오기
    const reviews = await prisma.reviews.findMany({
      include: {
        // 숙소 이름 가져오기 위해 lodgings 테이블과 조인
        lodgings: {
          select: {
            name: true, // 숙소 이름 필드만 선택
          },
        },
        // 리뷰에 연결된 사진 정보도 가져오기
        review_photos: {
          select: {
            review_photos_1: true,
            review_photos_2: true,
            review_photos_3: true,
            review_photos_4: true,
            review_photos_5: true,
          },
        },
      },
    });

    return res.status(StatusCodes.OK).json(reviews); // 리뷰 정보 반환
  } catch (error) {
    console.error('Error fetching reviews:', error); // 오류 메시지 출력
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
