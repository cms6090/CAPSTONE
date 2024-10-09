import express from 'express';
import { prisma } from '../utils/prisma/prisma.js'; // Prisma 클라이언트 가져오기
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import dayjs from 'dayjs';

const AccommodationsRouter = express.Router();

AccommodationsRouter.get('/accommodations/', async (req, res, next) => {
  try {
    let { keyword, checkIn, checkOut, personal = '2' } = req.query;

    // 체크인과 체크아웃 날짜 기본값 설정
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    checkIn = checkIn || today;
    checkOut = checkOut || tomorrow;

    // 숙소 검색 쿼리 실행
    const rawQuery = `
      SELECT 
        lodging_id, 
        name, 
        part,
        area, 
        sigungu, 
        rating, 
        tel,
        address,
        main_image
      FROM 
        lodgings
      WHERE 
        1=1
      ${keyword ? `AND (name LIKE '%${keyword}%' OR area LIKE '%${keyword}%' OR sigungu LIKE '%${keyword}%')` : ''}
    `;

    const accommodations = await prisma.$queryRawUnsafe(rawQuery);

    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

export default AccommodationsRouter;
