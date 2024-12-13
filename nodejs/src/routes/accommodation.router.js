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
    const { keyword = '', checkIn, checkOut, personal = '2', minPrice, maxPrice } = req.query;

    console.log('Final checkIn:', checkIn, 'Final checkOut:', checkOut);

    // 조건 빌딩을 위한 파라미터 배열
    const queryParams = [];
    const whereConditions = ['1=1'];

    // 동적 조건 추가
    if (keyword) {
      whereConditions.push(`(l.name LIKE ? OR l.area LIKE ? OR l.sigungu LIKE ?)`);
      queryParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (minPrice) {
      whereConditions.push(`r.price_per_night >= ?`);
      queryParams.push(Number(minPrice));
    }
    if (maxPrice) {
      whereConditions.push(`r.price_per_night <= ?`);
      queryParams.push(Number(maxPrice));
    }
    if (personal) {
      whereConditions.push(`r.min_occupancy <= ? AND r.max_occupancy >= ?`);
      queryParams.push(Number(personal), Number(personal));
    }

    // 최종 쿼리 생성
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
        ${whereConditions.join(' AND ')}
      GROUP BY
        l.lodging_id;
    `;

    console.log('Executing SQL Query:', rawQuery);
    console.log('With parameters:', queryParams);

    // Prisma를 통해 raw SQL 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);

    // BigInt 값을 문자열로 변환하여 JSON으로 반환
    const sanitizedAccommodations = JSON.parse(
      JSON.stringify(accommodations, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(sanitizedAccommodations);
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    next(new StatusError(error.message, StatusCodes.BAD_REQUEST));
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
      age_group, // 연령대 필터 추가
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

    // 연령대 조건 추가
    const ageGroupCondition = age_group ? `AND CONCAT(FLOOR((YEAR(CURDATE()) - YEAR(u.birth)) / 10) * 10, '대') = ?` : '';

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
      ${age_group ? 'JOIN users u ON r.user_id = u.user_id' : ''} -- 연령대 조건이 있을 때만 사용자 정보와 연결
      WHERE 
        (l.name LIKE CONCAT('%', ?, '%') 
         OR l.area LIKE CONCAT('%', ?, '%') 
         OR l.sigungu LIKE CONCAT('%', ?, '%'))
        AND r.price_per_night BETWEEN ? AND ?
        AND r.min_occupancy <= ?
        AND r.max_occupancy >= ?
        ${tagQuery} -- 모든 태그를 포함하는 조건 추가
        ${ageGroupCondition} -- 연령대 조건 추가
      GROUP BY 
        l.lodging_id 
      HAVING 
        available_rooms > 0;
    `;

    // 쿼리 파라미터 설정
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
    if (age_group) {
      queryParams.push(age_group); // 연령대 필터 파라미터 추가
    }

    console.log('Executing SQL Query:', rawQuery);
    console.log('With parameters:', queryParams);

    // 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);

    // BigInt 값을 문자열로 변환하여 JSON으로 반환
    const sanitizedAccommodations = JSON.parse(
      JSON.stringify(accommodations, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    return res.status(StatusCodes.OK).json(sanitizedAccommodations);
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
    const { tag, personal = 2 } = req.query;

    // SQL 쿼리 생성 - 태그 조건 및 인원 수 조건에 맞는 숙소 검색
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
        ${tag ? `l.tag LIKE ?` : '1=1'} -- tag 조건 추가
        AND r.min_occupancy <= ? AND r.max_occupancy >= ? -- 인원 수 조건 추가
      GROUP BY
        l.lodging_id;
    `;

    // 쿼리 실행에 필요한 파라미터 설정
    const queryParams = [];
    if (tag) queryParams.push(`%${tag}%`);
    queryParams.push(Number(personal), Number(personal));

    // 생성된 쿼리 로그 출력
    console.log('Executing SQL Query:', rawQuery);
    console.log('With parameters:', queryParams);

    // Prisma로 raw SQL 쿼리 실행
    const accommodations = await prisma.$queryRawUnsafe(rawQuery, ...queryParams);

    // BigInt 값을 문자열로 변환하여 JSON으로 반환
    const sanitizedAccommodations = JSON.parse(
      JSON.stringify(accommodations, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(sanitizedAccommodations);
  } catch (error) {
    // 에러 발생 시 에러 메시지와 상태 코드 반환
    console.error('Error fetching accommodations by tag:', error);
    throw new StatusError(error.message, StatusCodes.BAD_REQUEST);
  }
});

/*---------------------------------------------
    [숙박 업소 연령대별 조회]
---------------------------------------------*/
AccommodationsRouter.get('/age-group', async (req, res, next) => {
  try {
    const { age_group, personal = 2 } = req.query;

    if (!age_group) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Age group is required' });
    }

    // 연령대와 인원 수에 맞는 숙소 조회 쿼리
    const rawQuery = `
      WITH AgeGroupReservations AS (
          SELECT 
              l.lodging_id, -- 숙소 ID
              l.name AS lodging_name, -- 숙소 이름
              l.part AS lodging_part, -- 숙소 파트
              l.area AS lodging_area, -- 숙소 지역
              l.sigungu AS lodging_sigungu, -- 숙소 시군구
              l.rating AS lodging_rating, -- 숙소 평점
              l.tel AS lodging_tel, -- 숙소 전화번호
              l.address AS lodging_address, -- 숙소 주소
              l.main_image AS lodging_main_image, -- 숙소 메인 이미지
              CONCAT(FLOOR((YEAR(CURDATE()) - YEAR(u.birth)) / 10) * 10, '대') AS age_group, -- 연령대 계산
              COUNT(r.reservation_id) AS reservation_count, -- 해당 숙소에서 해당 연령대의 예약 수
              MIN(rm.price_per_night) AS min_price_per_night -- 최소 1박 가격
          FROM 
              reservations AS r
          JOIN 
              rooms AS rm ON r.room_id = rm.room_id
          JOIN 
              lodgings AS l ON rm.lodging_id = l.lodging_id
          JOIN 
              users AS u ON r.user_id = u.user_id
          WHERE
              rm.min_occupancy <= ? AND rm.max_occupancy >= ? -- 인원 수 필터링
          GROUP BY 
              l.lodging_id, age_group
      ),
      MaxAgeGroupReservations AS (
          SELECT 
              lodging_id,
              MAX(reservation_count) AS max_reservation_count -- 각 숙소에서 가장 예약 수가 많은 연령대의 예약 수
          FROM 
              AgeGroupReservations
          GROUP BY 
              lodging_id
      )

      SELECT 
          agr.lodging_id,
          agr.lodging_name,
          agr.lodging_part,
          agr.lodging_area,
          agr.lodging_sigungu,
          agr.lodging_rating,
          agr.lodging_tel,
          agr.lodging_address,
          agr.lodging_main_image,
          agr.min_price_per_night
      FROM 
          AgeGroupReservations AS agr
      JOIN 
          MaxAgeGroupReservations AS mgr ON agr.lodging_id = mgr.lodging_id
          AND agr.reservation_count = mgr.max_reservation_count -- 가장 많은 예약 수인 연령대만 선택
      WHERE 
          agr.age_group = ? -- 사용자가 입력한 연령대 필터링
      ORDER BY 
          agr.reservation_count DESC
      LIMIT 12; -- 결과를 12개로 제한
    `;

    // 쿼리 실행 시 필요한 파라미터 (personal과 age_group)
    const accommodations = await prisma.$queryRawUnsafe(
      rawQuery,
      Number(personal),
      Number(personal),
      age_group,
    );

    // BigInt 값을 문자열로 변환하여 JSON으로 반환
    const sanitizedAccommodations = JSON.parse(
      JSON.stringify(accommodations, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    // 검색 결과를 클라이언트에게 반환
    return res.status(StatusCodes.OK).json(sanitizedAccommodations);
  } catch (error) {
    console.error('Error fetching accommodations by age group:', error);
    next(error);
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
