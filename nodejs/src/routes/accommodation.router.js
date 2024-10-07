import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import dayjs from 'dayjs';
import JSONBig from 'json-bigint';

const AccommodationsRouter = express.Router();

/*---------------------------------------------
    [기본 경로 설정]
    - /accommodations 경로를 추가
---------------------------------------------*/
const routerBasePath = '/accommodations';

/*---------------------------------------------
    [숙소 검색]
    - keyword, checkIn, checkOut, personal 등 다양한 옵션을 필터링하여 숙소 검색
---------------------------------------------*/
AccommodationsRouter.get(routerBasePath + '/', async (req, res, next) => {
  try {
    let { keyword, checkIn, checkOut, personal = '2' } = req.query;

    // 체크인과 체크아웃 날짜 기본값 설정
    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    checkIn = checkIn || today;
    checkOut = checkOut || tomorrow;

    // 검색 조건 구성
    const searchConditions = {
      AND: [
        keyword ? {
          OR: [
            { name: { contains: keyword } },
            { description: { contains: keyword } }
          ],
        } : {},
        personal ? { maxOccupancy: { gte: parseInt(personal, 10) } } : {},
      ].filter(Boolean),
    };

    // 숙소 검색 쿼리 실행
    const rawQuery = `
      SELECT a.*, ar.area_name, s.sigungu_name
      FROM accommodations a
      LEFT JOIN areas ar ON a.area_id = ar.id
      LEFT JOIN sigungu s ON a.sigungu_id = s.id
      WHERE 1=1
      ${keyword ? `AND (a.name LIKE '%${keyword}%' OR a.description LIKE '%${keyword}%' OR ar.area_name LIKE '%${keyword}%' OR s.sigungu_name LIKE '%${keyword}%')` : ''}
      ${personal ? `AND a.maxOccupancy >= ${parseInt(personal, 10)}` : ''}
    `;

    const accommodations = await prisma.$queryRawUnsafe(rawQuery);

    // JSONBig을 사용하여 BigInt 직렬화 처리
    const formattedAccommodations = accommodations.map(acc => {
      return JSONBig.parse(JSONBig.stringify(acc));
    });

    return res.status(StatusCodes.OK).json(formattedAccommodations);
  } catch (error) {
    throw new StatusError(error, StatusCodes.BAD_REQUEST);
  }
});

export default AccommodationsRouter;
