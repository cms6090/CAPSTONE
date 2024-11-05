import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
const staticsRouter = express.Router();

// 1. 날짜별 예약 수
staticsRouter.get('/reservations', async (req, res) => {
  try {
    const reservationsByDate = await prisma.reservations.groupBy({
      by: ['check_in_date'],
      _count: {
        reservation_id: true,
      },
    });
    const formattedData = reservationsByDate.map((item) => ({
      date: item.check_in_date,
      count: item._count.reservation_id,
    }));
    res.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch reservation statistics:', error);
    res.status(500).json({ error: 'Failed to fetch reservation statistics' });
  }
});

// 2. 리뷰 평점 분포
staticsRouter.get('/reviews', async (req, res) => {
  try {
    const reviewRatings = await prisma.reviews.groupBy({
      by: ['rating'],
      _count: {
        review_id: true,
      },
    });
    const formattedData = reviewRatings.map((item) => ({
      rating: item.rating,
      count: item._count.review_id,
    }));
    res.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch review statistics:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

// 3. 사용자 연령대 및 성별 통계
staticsRouter.get('/demographics', async (req, res) => {
    try {
      const ageGroups = [
        { min: 20, max: 29, label: '20-29' },
        { min: 30, max: 39, label: '30-39' },
        { min: 40, max: 49, label: '40-49' },
      ];
  
      const demographicsData = await Promise.all(
        ageGroups.map(async ({ min, max, label }) => {
          const maleCount = await prisma.users.count({
            where: {
              gender: '남성',
              birth: {
                gte: new Date(new Date().setFullYear(new Date().getFullYear() - max)),
                lte: new Date(new Date().setFullYear(new Date().getFullYear() - min)),
              },
            },
          });
  
          const femaleCount = await prisma.users.count({
            where: {
              gender: '여성',
              birth: {
                gte: new Date(new Date().setFullYear(new Date().getFullYear() - max)),
                lte: new Date(new Date().setFullYear(new Date().getFullYear() - min)),
              },
            },
          });
  
          return { ageGroup: label, maleCount, femaleCount };
        })
      );
  
      res.json(demographicsData);
    } catch (error) {
      console.error('Failed to fetch user demographics:', error);
      res.status(500).json({ error: 'Failed to fetch user demographics' });
    }
  });
  
export default staticsRouter;