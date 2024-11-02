import express from 'express';
import { PrismaClient } from '@prisma/client'; // PrismaClient import
import auth from '../middlewares/auth.middleware.js'; // 인증 미들웨어

const prisma = new PrismaClient();
const reservationsRouter = express.Router();

// 예약 정보 받기
reservationsRouter.post('/', async (req, res) => {
  try {
    const {
      userId, // 사용자 ID
      roomId, // 객실 ID
      userName, // 사용자 이름
      phoneNumber, // 사용자 휴대폰 번호
      checkInDate, // 체크인 날짜
      checkOutDate, // 체크아웃 날짜
      roomPrice, // 객실 가격
      personNum, // 인원 수
    } = req.body;

    // 유효성 검사 (필수 데이터가 누락된 경우 처리)
    if (
      !userId ||
      !roomId ||
      !checkInDate ||
      !checkOutDate ||
      !roomPrice ||
      !personNum ||
      !userName ||
      !phoneNumber
    ) {
      console.log(userId, roomId, checkInDate, checkOutDate, roomPrice, personNum);
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    // 총 가격 계산 (예시: 객실 가격 * 숙박일수)
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)); // 숙박일수 계산
    const totalPrice = parseFloat(roomPrice) * nights; // 총 가격 계산

    // Prisma를 사용하여 reservations 테이블에 데이터 삽입
    const reservation = await prisma.reservations.create({
      data: {
        user_id: userId, // 사용자 ID
        room_id: roomId, // 객실 ID
        check_in_date: checkIn, // 체크인 날짜
        check_out_date: checkOut, // 체크아웃 날짜
        person_num: personNum, // 인원 수
        total_price: totalPrice, // 총 가격
        status: 'confirmed', // 예약 상태 (기본값: confirmed)
        username: userName,
        phonenumber: phoneNumber,
      },
    });

    // 성공 응답
    return res.status(201).json({
      message: '예약이 성공적으로 완료되었습니다.',
      reservation,
    });
  } catch (error) {
    console.error('예약 처리 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류로 예약을 처리할 수 없습니다.' });
  }
});

// 예약 내역 조회 API (사용자 ID를 기반으로)
reservationsRouter.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId; // JWT 토큰에서 가져온 사용자 ID

    // 사용자 ID로 예약 내역 조회
    const reservations = await prisma.reservations.findMany({
      where: {
        user_id: userId,
      },
      include: {
        rooms: {
          include: {
            lodgings: true, // lodgings 정보를 명시적으로 포함
          },
        },
      },
    });

    // 예약 내역이 없을 때도 오류가 아니므로 200 OK 반환
    if (reservations.length === 0) {
      return res.status(200).json({ message: '예약 내역이 없습니다.', reservations: [] });
    }

    // 예약 내역 반환
    console.log(reservations);
    return res.status(200).json(reservations);
  } catch (error) {
    console.error('예약 내역 조회 오류:', error);
    return res.status(501).json({ message: '서버 오류로 예약 내역을 가져올 수 없습니다.' });
  }
});

// 예약 내역 삭제 API (reservation_id를 기반으로)
reservationsRouter.delete('/:reservationId', auth, async (req, res) => {
  try {
    const { reservationId } = req.params;
    // 예약 존재 여부 확인
    const existingReservation = await prisma.reservations.findUnique({
      where: {
        reservation_id: parseInt(reservationId, 10),
      },
    });

    if (!existingReservation) {
      return res.status(404).json({ message: '해당 예약을 찾을 수 없습니다.' });
    }

    // 예약 정보 삭제
    const deletedReservation = await prisma.reservations.delete({
      where: {
        reservation_id: parseInt(reservationId, 10),
      },
    });

    // 삭제 성공 응답
    return res.status(200).json({
      message: '예약이 성공적으로 삭제되었습니다.',
      deletedReservation,
    });
  } catch (error) {
    console.error('예약 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류로 예약을 삭제할 수 없습니다.' });
  }
});

export default reservationsRouter;
