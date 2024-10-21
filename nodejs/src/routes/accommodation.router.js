import express from 'express';
import { prisma } from '../utils/prisma/prisma.js'; // Prisma 클라이언트 가져오기
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import dayjs from 'dayjs';

const AccommodationsRouter = express.Router();

/*---------------------------------------------
    [숙박 업소 지역별, 파트별 조회]
---------------------------------------------*/
AccommodationsRouter.get('/part', async (req, res, next) => {
  try {
    let { keyword, checkIn, checkOut, personal = '2', minPrice, maxPrice } = req.query;

    // 체크인과 체크아웃 날짜 기본값 설정
    const today = dayjs().format('YYYY-MM-DD'); // 오늘 날짜를 YYYY-MM-DD 형식으로 설정
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD'); // 내일 날짜를 YYYY-MM-DD 형식으로 설정

    // 사용자가 제공하지 않은 경우 기본 체크인/체크아웃 날짜 설정
    checkIn = checkIn || today;
    checkOut = checkOut || tomorrow;

    console.log('Final checkIn:', checkIn, 'Final checkOut:', checkOut); // 체크인과 체크아웃 날짜 로그 출력

    // 숙소 검색 쿼리 실행
    const rawQuery = `
      SELECT
        l.lodging_id,
        l.name,
        l.part,
        l.area,
        l.sigungu,
        l.rating,
        l.tel,
        l.address,
        l.main_image,
        MIN(r.price_per_night) AS min_price_per_night
      FROM
        lodgings l
      LEFT JOIN
        rooms r ON l.lodging_id = r.lodging_id
      WHERE
        1=1
        ${keyword ? `AND (l.name LIKE '%${keyword}%' OR l.area LIKE '%${keyword}%' OR l.sigungu LIKE '%${keyword}%')` : ''}
        ${minPrice ? `AND r.price_per_night >= ${minPrice}` : ''}
        ${maxPrice ? `AND r.price_per_night <= ${maxPrice}` : ''}
      GROUP BY
        l.lodging_id;
    `;

    // Prisma를 사용하여 raw SQL 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery);

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    // 에러 발생 시 상태 코드와 에러 메시지를 반환
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

/*---------------------------------------------
    [숙박 업소 쿼리 조회]
---------------------------------------------*/
AccommodationsRouter.get('/', async (req, res, next) => {
  try {
    // req.query에서 쿼리 파라미터를 가져옵니다.
    let {
      keyword = '',
      checkIn,
      checkOut,
      personal = '2',
      minPrice = '0',
      maxPrice = '1000000',
    } = req.query;

    personal = Number(personal); // personal을 숫자로 변환
    console.log(req.query);

    console.log('Final checkIn:', checkIn, 'Final checkOut:', checkOut); // 체크인과 체크아웃 날짜 로그 출력

    // 숙소 검색 쿼리 실행
    const rawQuery = `
      SELECT 
        l.lodging_id, 
        l.name, 
        l.part, 
        l.area, 
        l.sigungu, 
        l.rating, 
        l.tel, 
        l.address, 
        l.main_image, 
        MIN(r.price_per_night) AS min_price_per_night, 
        SUM(r.room_count - IFNULL((
          SELECT COUNT(*) 
          FROM reservations res 
          WHERE res.room_id = r.room_id 
          AND res.check_in_date <= '${checkOut}' 
          AND res.check_out_date >= '${checkIn}'
        ), 0)) AS available_rooms 
      FROM 
        lodgings l 
      JOIN 
        rooms r ON l.lodging_id = r.lodging_id 
      WHERE 
        (l.name LIKE '%${keyword}%' OR l.area LIKE '%${keyword}%' OR l.sigungu LIKE '%${keyword}%') 
        AND r.price_per_night >= ${minPrice} 
        AND r.price_per_night <= ${maxPrice}
        AND r.min_occupancy <= ${personal} 
        AND r.max_occupancy >= ${personal} 
      GROUP BY 
        l.lodging_id 
      HAVING 
        available_rooms > 0;
    `;

    // Prisma를 사용하여 raw SQL 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery);
    console.log(rawQuery);
    // 검색 결과를 콘솔에 출력
    console.log('Search results:', accommodations);

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    // 에러 발생 시 상태 코드와 에러 메시지를 반환
    console.error('Error fetching accommodations:', error);
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

/*---------------------------------------------
    [숙박 업소 상세 조회]
---------------------------------------------*/
AccommodationsRouter.get('/:lodgingId', async (req, res, next) => {
  try {
    const { lodgingId } = req.params;
    const query = `
      SELECT l.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'room_id', r.room_id,
                 'room_name', r.room_name,
                 'room_count', r.room_count,
                 'price_per_night', r.price_per_night,
                 'min_occupancy', r.min_occupancy,
                 'max_occupancy', r.max_occupancy,
                 'room_photos', (
                   SELECT JSON_ARRAYAGG(photo_url)
                   FROM room_photos rp
                   WHERE rp.room_id = r.room_id
                 ),
                 'facilities', (
                   SELECT JSON_ARRAYAGG(
                     JSON_OBJECT(
                       'facility_id', f.facility_id,
                       'has_bathfacility', f.has_bathfacility,
                       'has_home_theater', f.has_home_theater,
                       'has_air_conditioning', f.has_air_conditioning,
                       'has_tv', f.has_tv,
                       'has_pc', f.has_pc,
                       'cable', f.cable,
                       'has_internet', f.has_internet,
                       'has_refrigerator', f.has_refrigerator,
                       'has_toiletries', f.has_toiletries,
                       'has_sofa', f.has_sofa,
                       'has_cook', f.has_cook,
                       'has_table', f.has_table,
                       'hairdryer', f.hairdryer
                     )
                   )
                   FROM facilities f
                   WHERE f.room_id = r.room_id
                 )
               )
             ) AS rooms,
             (
               SELECT JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'review_id', rev.review_id,
                   'user_id', rev.user_id,
                   'rating', rev.rating,
                   'comment', rev.comment,
                   'created_at', rev.created_at
                 )
               )
               FROM reviews rev
               WHERE rev.lodging_id = l.lodging_id
             ) AS reviews
      FROM lodgings l
      LEFT JOIN rooms r ON l.lodging_id = r.lodging_id
      WHERE l.lodging_id = ?
      GROUP BY l.lodging_id;
    `;

    const lodgingDetails = await prisma.$queryRawUnsafe(query, parseInt(lodgingId));

    if (!lodgingDetails.length) {
      return res.status(404).json({ message: 'Lodging not found' });
    }
    res.status(200).json(lodgingDetails[0]);
  } catch (error) {
    console.error('Error fetching lodging details:', error);
    next(error);
  }
});

export default AccommodationsRouter;
