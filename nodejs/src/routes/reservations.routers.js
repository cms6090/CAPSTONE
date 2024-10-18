import express from 'express';
import { PrismaClient } from '@prisma/client'; // PrismaClient import

const prisma = new PrismaClient();
const reservationsRouter = express.Router();

// 예약 정보 받기
reservationsRouter.post('/', async (req, res) => {
  try {
    const {
      userId,            // 사용자 ID
      roomId,            // 객실 ID
      userName,          // 사용자 이름
      phoneNumber,       // 사용자 휴대폰 번호
      checkInDate,       // 체크인 날짜
      checkOutDate,      // 체크아웃 날짜
      roomPrice,         // 객실 가격
      personNum,         // 인원 수
    } = req.body;

    // 유효성 검사 (필수 데이터가 누락된 경우 처리)
    if (!userId || !roomId || !checkInDate || !checkOutDate || !roomPrice || !personNum) {
        console.log(userId, roomId , checkInDate, checkOutDate, roomPrice ,personNum)
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
        user_id: userId,                  // 사용자 ID
        room_id: roomId,                  // 객실 ID
        check_in_date: checkIn,           // 체크인 날짜
        check_out_date: checkOut,         // 체크아웃 날짜
        person_num: personNum,            // 인원 수
        total_price: totalPrice,          // 총 가격
        status: 'confirmed',              // 예약 상태 (기본값: confirmed)
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

export default reservationsRouter;
