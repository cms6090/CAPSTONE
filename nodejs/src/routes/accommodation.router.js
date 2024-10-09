import express from 'express';
import { prisma } from '../utils/prisma/prisma.js'; // Prisma 클라이언트 가져오기
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import dayjs from 'dayjs';

const AccommodationsRouter = express.Router();

/*---------------------------------------------
    [숙박 업소 조회]
---------------------------------------------*/
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

/*---------------------------------------------
    [숙박 업소 상세 조회]
---------------------------------------------*/
AccommodationsRouter.get('/accommodations/:lodgingId', async (req, res, next) => {
  console.log("called")
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
      console.log("dd");
      return res.status(404).json({ message: 'Lodging not found' });
    }
    console.log("dl");
    res.status(200).json(lodgingDetails[0]);
  } catch (error) {
    console.error('Error fetching lodging details:', error);
    next(error);
  }
});
export default AccommodationsRouter;
