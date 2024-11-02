import express from 'express';
import compression from 'compression'; // compression 라이브러리 가져오기
import { prisma } from '../utils/prisma/prisma.js'; // Prisma 클라이언트 가져오기
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import dayjs from 'dayjs';

const AccommodationsRouter = express.Router();

// 압축 미들웨어 추가
AccommodationsRouter.use(compression());

/*---------------------------------------------
    [숙박 업소 지역별, 파트별 조회]
---------------------------------------------*/
AccommodationsRouter.get('/part', async (req, res, next) => {
  try {
    let { keyword, checkIn, checkOut, personal = '2', minPrice, maxPrice } = req.query;

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
    console.log('Received request query:', req.query);

    let {
      keyword = '',
      checkIn,
      checkOut,
      personal = '2',
      minPrice = '0',
      maxPrice = '1000000',
      tag = [], // 여러 태그를 배열로 처리
    } = req.query;

    if (typeof tag === 'string') {
      tag = [tag]; // 단일 태그도 배열로 변환
    }

    personal = Number(personal);

    const today = dayjs().format('YYYY-MM-DD');
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');

    checkIn = checkIn || today;
    checkOut = checkOut || tomorrow;

    // 여러 태그 조건을 LIKE와 AND로 결합
    const tagConditions = tag.map(() => `l.tag LIKE CONCAT('%', ?, '%')`).join(' AND ');
    const tagQuery = tagConditions ? `AND (${tagConditions})` : '';

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
        SUM(r.room_count - IFNULL(reserved_rooms.reserved_count, 0)) AS available_rooms 
      FROM 
        lodgings l 
      JOIN 
        rooms r 
      ON 
        l.lodging_id = r.lodging_id 
      LEFT JOIN (
        SELECT 
          room_id, 
          COUNT(*) AS reserved_count 
        FROM 
          reservations 
        WHERE 
          check_in_date <= ? 
          AND check_out_date >= ? 
        GROUP BY 
          room_id
      ) reserved_rooms 
      ON 
        r.room_id = reserved_rooms.room_id 
      WHERE 
        (l.name LIKE CONCAT('%', ?, '%') 
         OR l.area LIKE CONCAT('%', ?, '%') 
         OR l.sigungu LIKE CONCAT('%', ?, '%'))
        AND r.price_per_night BETWEEN ? AND ?
        AND r.min_occupancy <= ?
        AND r.max_occupancy >= ?
        ${tagQuery} -- 모든 태그를 포함하는 조건 추가
      GROUP BY 
        l.lodging_id 
      HAVING 
        available_rooms > 0;
    `;

    // Prepare query parameters
    const queryParams = [
      checkIn,
      checkOut,
      keyword,
      keyword,
      keyword,
      minPrice,
      maxPrice,
      personal,
      personal,
      ...tag, // 각 태그를 파라미터에 추가
    ];

    console.log('Executing SQL Query:', rawQuery);
    console.log('With parameters:', queryParams);

    // Execute the query with the appropriate parameters
    const accommodations = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);

    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

/*---------------------------------------------
    [태그별 숙박 업소 조회]
---------------------------------------------*/
AccommodationsRouter.get('/tag', async (req, res, next) => {
  try {
    let { tag } = req.query;

    // SQL 쿼리 생성 - 태그 조건에 맞는 숙소 검색
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
        ${tag ? `l.tag LIKE '%${tag}%'` : '1=1'}  -- tag 조건 추가
      GROUP BY
        l.lodging_id;
    `;

    // 생성된 쿼리 로그 출력
    console.log('Executing SQL Query:', rawQuery);

    // Prisma로 raw SQL 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery);

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    // 에러 발생 시 에러 메시지와 상태 코드 반환
    console.error('Error fetching accommodations by tag:', error);
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

/*---------------------------------------------
    [숙박 업소 상세 조회]
---------------------------------------------*/
AccommodationsRouter.get('/:lodgingId', async (req, res, next) => {
  try {
    const { lodgingId } = req.params;
    const { checkIn, checkOut } = req.query;

    console.log(checkIn, checkOut);

    // 기본 숙소 정보 쿼리
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

    let lodgingDetails = await prisma.$queryRawUnsafe(query, parseInt(lodgingId));

    if (!lodgingDetails.length) {
      return res.status(404).json({ message: 'Lodging not found' });
    }

    // 잔여석 확인 쿼리 (checkIn과 checkOut이 있을 경우)
    if (checkIn && checkOut) {
      console.log(checkIn, checkOut);
      const availabilityQuery = `
        SELECT r.room_id, r.room_count - IFNULL(COUNT(res.room_id), 0) AS available_rooms
        FROM rooms r
        LEFT JOIN reservations res ON r.room_id = res.room_id
          AND res.check_in_date < ? AND res.check_out_date > ?
        WHERE r.lodging_id = ?
        GROUP BY r.room_id;
      `;

      const availabilityResult = await prisma.$queryRawUnsafe(
        availabilityQuery,
        checkOut,
        checkIn,
        parseInt(lodgingId),
      );

      // 방 별로 잔여석 수를 설정
      const roomsWithAvailability = lodgingDetails[0].rooms.map((room) => {
        const availability = availabilityResult.find((av) => av.room_id === room.room_id);
        return {
          ...room,
          available_count: availability ? availability.available_rooms : room.room_count,
        };
      });

      // 방 정보를 업데이트하여 반환
      lodgingDetails[0].rooms = roomsWithAvailability;
    }

    // BigInt를 문자열로 변환
    const sanitizedLodgingDetails = JSON.parse(
      JSON.stringify(lodgingDetails, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    console.log(sanitizedLodgingDetails);
    res.status(200).json(sanitizedLodgingDetails[0]);
  } catch (error) {
    console.error('Error fetching lodging details:', error);
    next(error);
  }
});

export default AccommodationsRouter;
