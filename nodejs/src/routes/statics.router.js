import express from 'express';
import { prisma } from '../utils/prisma/prisma.js';
const staticsRouter = express.Router();

// 1. 기본 통계 API
staticsRouter.get('/', async (req, res) => {
  try {
    // 사용자 수 계산
    const userCount = await prisma.users.count();

    // 숙소 수 계산
    const lodgingCount = await prisma.lodgings.count();

    // 객실 수 계산
    const roomCount = await prisma.rooms.count();

    // 리뷰 수 계산
    const reserveCount = await prisma.reservations.count();

    // 리뷰 수 계산
    const reviewCount = await prisma.reviews.count();

    // 결과 응답
    res.json({
      userCount,
      lodgingCount,
      roomCount,
      reserveCount,
      reviewCount,
    });
  } catch (error) {
    console.error('Failed to fetch basic statistics:', error);
    res.status(500).json({ error: 'Failed to fetch basic statistics' });
  }
});

// 2. 날짜별 예약 수
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

// 3. 사용자 연령대 및 성별 통계 + 요일별 예약 통계
staticsRouter.get('/demographics', async (req, res) => {
  try {
    const ageGroups = [
      { min: 20, max: 29, label: '20-29' },
      { min: 30, max: 39, label: '30-39' },
      { min: 40, max: 49, label: '40-49' },
      { min: 50, max: 59, label: '50-59' },
      { min: 60, max: 100, label: '60-100' },
    ];

    // Existing code for demographics data
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
      }),
    );

    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1); 

    const reservationsPerDayRaw = await prisma.$queryRaw`
      SELECT 
        DAYOFWEEK(check_in_date) as dayOfWeek,
        COUNT(*) as reservationCount
      FROM reservations
      WHERE check_in_date >= ${twoMonthsAgo}
      GROUP BY dayOfWeek
    `;

    const dayOfWeekMap = {
      1: '일',
      2: '월',
      3: '화',
      4: '수',
      5: '목',
      6: '금',
      7: '토',
    };

    const daySortOrder = {
      월: 1,
      화: 2,
      수: 3,
      목: 4,
      금: 5,
      토: 6,
      일: 7,
    };

    const reservationsPerDay = reservationsPerDayRaw.map((item) => ({
      dayOfWeek: Number(item.dayOfWeek),
      dayName: dayOfWeekMap[Number(item.dayOfWeek)],
      reservationCount: Number(item.reservationCount),
    }));

    reservationsPerDay.sort((a, b) => daySortOrder[a.dayName] - daySortOrder[b.dayName]);

    res.json({ demographicsData, reservationsPerDay });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 4. 기간별(area별) 예약 통계
staticsRouter.get('/reservations-by-area', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // reservations 테이블에서 올해 예약 데이터 가져오기
    const reservations = await prisma.reservations.findMany({
      where: {
        check_in_date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      select: {
        check_in_date: true,
        rooms: {
          select: {
            lodgings: {
              select: {
                area: true,
                sigungu: true,
              },
            },
          },
        },
      },
    });

    // 월별로 지역별 및 시군구별 예약 횟수 집계
    const areaReservations = {};

    for (const reservation of reservations) {
      const month = new Date(reservation.check_in_date).getMonth() + 1;
      const area = reservation.rooms?.lodgings?.area;
      const sigungu = reservation.rooms?.lodgings?.sigungu;

      // area 또는 sigungu 정보가 없으면 건너뜀
      if (!area || !sigungu) continue;

      if (!areaReservations[month]) {
        areaReservations[month] = {};
      }
      if (!areaReservations[month][area]) {
        areaReservations[month][area] = { totalCount: 0, sigungus: {} };
      }
      if (!areaReservations[month][area].sigungus[sigungu]) {
        areaReservations[month][area].sigungus[sigungu] = 0;
      }

      areaReservations[month][area].sigungus[sigungu] += 1;
      areaReservations[month][area].totalCount += 1; // area별 총 예약 횟수 증가
    }

    // 월별 인기 지역 및 시군구 예약 횟수 형식으로 데이터 정리
    const formattedData = Object.entries(areaReservations).map(([month, areas]) => {
      const popularAreas = Object.entries(areas)
        .map(([area, data]) => {
          const popularSigungus = Object.entries(data.sigungus)
            .map(([sigungu, count]) => ({ sigungu, count }))
            .sort((a, b) => b.count - a.count) // 시군구별 예약 횟수 기준 내림차순 정렬
            .slice(0, 10); // 상위 10개 시군구만 가져옴

          return {
            area,
            totalCount: data.totalCount, // area별 총 예약 횟수 포함
            popularSigungus,
          };
        })
        .sort((a, b) => b.totalCount - a.totalCount) // area별 총 예약 횟수 기준 내림차순 정렬
        .slice(0, 10); // 상위 10개 area만 가져옴

      return {
        month: parseInt(month, 10),
        popularAreas,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Failed to fetch area reservation statistics:', error);
    res.status(500).json({ error: 'Failed to fetch area reservation statistics' });
  }
});

// 5. 인기 숙소 Top 10
staticsRouter.get('/top-lodgings', async (req, res) => {
  try {
    const topLodgings = await prisma.reservations.groupBy({
      by: ['room_id'],
      _count: {
        reservation_id: true,
      },
      orderBy: {
        _count: {
          reservation_id: 'desc',
        },
      },
      take: 10,
    });

    // room_id를 통해 lodgings 데이터를 조인하여 추가 정보 가져오기
    const lodgingDetails = await Promise.all(
      topLodgings.map(async (reservation) => {
        const room = await prisma.rooms.findUnique({
          where: { room_id: reservation.room_id },
          select: {
            lodging_id: true,
          },
        });

        if (!room) return null;

        const lodging = await prisma.lodgings.findUnique({
          where: { lodging_id: room.lodging_id },
          select: {
            name: true,
            area: true,
            sigungu: true,
            rating: true,
          },
        });

        return {
          lodgingName: lodging.name,
          area: lodging.area,
          sigungu: lodging.sigungu,
          rating: lodging.rating,
          reservationCount: reservation._count.reservation_id,
        };
      }),
    );

    res.json(lodgingDetails.filter((lodging) => lodging !== null));
  } catch (error) {
    console.error('Failed to fetch top lodgings:', error);
    res.status(500).json({ error: 'Failed to fetch top lodgings' });
  }
});

export default staticsRouter;
