import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';
import jwt from 'jsonwebtoken';

const AdminRouter = express.Router();

// 관리자 권한 검증 미들웨어
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error('No token found');
      throw new StatusError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    if (decoded.permission !== '관리자') {
      console.error('User does not have admin permissions');
      throw new StatusError('Forbidden', StatusCodes.FORBIDDEN);
    }
    next();
  } catch (error) {
    console.error('Error in verifyAdmin middleware:', error);
    next(error);
  }
};

/*---------------------------------------------
    [모든 사용자 정보 조회]
---------------------------------------------*/
AdminRouter.get('/users', verifyAdmin, async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code);
    }
    next(new StatusError('Failed to fetch user data', StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

/*---------------------------------------------
    [사용자 업데이트]
---------------------------------------------*/
AdminRouter.put('/users/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_name, phone_number, gender, birth } = req.body;
    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: {
        user_name,
        phone_number,
        gender,
        birth,
        updated_at: new Date(),
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '사용자 정보 업데이트 성공', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [사용자 삭제]
---------------------------------------------*/
AdminRouter.delete('/users/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({
      where: { user_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '사용자 삭제 성공' });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [모든 예약 정보 조회]
---------------------------------------------*/
AdminRouter.get('/reservations', verifyAdmin, async (req, res, next) => {
  try {
    const reservations = await prisma.reservations.findMany(); // 모든 예약 정보 조회
    return res.status(StatusCodes.OK).json(reservations);
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [예약 업데이트]
---------------------------------------------*/
AdminRouter.put('/reservations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, check_in, check_out } = req.body;
    const updatedReservation = await prisma.reservations.update({
      where: { reservation_id: Number(id) },
      data: {
        status,
        check_in,
        check_out,
        updated_at: new Date(),
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '예약 정보 업데이트 성공', reservation: updatedReservation });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [예약 삭제]
---------------------------------------------*/
AdminRouter.delete('/reservations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.reservations.delete({
      where: { reservation_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '예약 삭제 성공' });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [모든 숙소 정보 조회]
---------------------------------------------*/
AdminRouter.get('/accommodations', verifyAdmin, async (req, res, next) => {
  try {
    const accommodations = await prisma.accommodations.findMany(); // 모든 숙소 정보 조회
    return res.status(StatusCodes.OK).json(accommodations);
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [숙소 업데이트]
---------------------------------------------*/
AdminRouter.put('/accommodations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, description } = req.body;
    const updatedAccommodation = await prisma.accommodations.update({
      where: { accommodation_id: Number(id) },
      data: {
        name,
        location,
        description,
        updated_at: new Date(),
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '숙소 정보 업데이트 성공', accommodation: updatedAccommodation });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [숙소 삭제]
---------------------------------------------*/
AdminRouter.delete('/accommodations/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.accommodations.delete({
      where: { accommodation_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '숙소 삭제 성공' });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [모든 객실 정보 조회]
---------------------------------------------*/
AdminRouter.get('/rooms', verifyAdmin, async (req, res, next) => {
  try {
    const rooms = await prisma.rooms.findMany(); // 모든 객실 정보 조회
    return res.status(StatusCodes.OK).json(rooms);
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [객실 업데이트]
---------------------------------------------*/
AdminRouter.put('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, price } = req.body;
    const updatedRoom = await prisma.rooms.update({
      where: { room_id: Number(id) },
      data: {
        name,
        type,
        price,
        updated_at: new Date(),
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '객실 정보 업데이트 성공', room: updatedRoom });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [객실 삭제]
---------------------------------------------*/
AdminRouter.delete('/rooms/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.rooms.delete({
      where: { room_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '객실 삭제 성공' });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [모든 리뷰 정보 조회]
---------------------------------------------*/
AdminRouter.get('/reviews', verifyAdmin, async (req, res, next) => {
  try {
    const reviews = await prisma.reviews.findMany(); // 모든 리뷰 정보 조회
    return res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [리뷰 업데이트]
---------------------------------------------*/
AdminRouter.put('/reviews/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, rating } = req.body;
    const updatedReview = await prisma.reviews.update({
      where: { review_id: Number(id) },
      data: {
        content,
        rating,
        updated_at: new Date(),
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: '리뷰 정보 업데이트 성공', review: updatedReview });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [리뷰 삭제]
---------------------------------------------*/
AdminRouter.delete('/reviews/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.reviews.delete({
      where: { review_id: Number(id) },
    });
    return res.status(StatusCodes.OK).json({ message: '리뷰 삭제 성공' });
  } catch (error) {
    next(error);
  }
});

export default AdminRouter;
