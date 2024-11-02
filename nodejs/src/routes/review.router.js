import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const reviewsRouter = express.Router();

// 특정 숙소의 리뷰와 사진 데이터 조회 API
reviewsRouter.get('/accommodation/:lodgingId', async (req, res) => {
  try {
    const { lodgingId } = req.params;
    console.log(lodgingId);

    // lodging_id를 기준으로 reviews와 review_photos 데이터 조회
    const reviews = await prisma.reviews.findMany({
      where: {
        lodging_id: parseInt(lodgingId, 10),
      },
      include: {
        users: { select: { user_name: true } },
        review_photos: true, // review_photos 테이블 데이터 포함
      },
      orderBy: {
        created_at: 'desc', // 최신순 정렬
      },
    });

    // 응답으로 리뷰 데이터 전달
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('리뷰 데이터 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류로 인해 리뷰 데이터를 가져올 수 없습니다.' });
  }
});

export default reviewsRouter;
