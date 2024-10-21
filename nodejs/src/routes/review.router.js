import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const reviewsRouter = express.Router();

// 현재 파일의 경로에서 디렉토리 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer 설정: 이미지를 저장할 디렉토리와 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '..', '..', 'uploads', 'reviews');
    // uploads/reviews 폴더가 없으면 생성
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('폴더 생성 중 오류 발생:', err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    const safeFileName = Buffer.from(file.originalname, 'latin1')
      .toString('utf8')
      .replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${safeFileName}`); // 기존 파일 이름을 유지하고 덮어쓰기
  },
});

const upload = multer({ storage });

// 리뷰 생성 API
reviewsRouter.post('/', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const { reservationId, lodgingId, rating, comment } = req.body;
    const userId = req.userId;

    if (!lodgingId || !rating) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    const parsedReservationId = parseInt(reservationId, 10);
    const parsedLodgingId = parseInt(lodgingId, 10);
    const parsedRating = parseInt(rating, 10);

    const review = await prisma.reviews.create({
      data: {
        reservation_id: parsedReservationId,
        lodging_id: parsedLodgingId,
        user_id: userId,
        rating: parsedRating,
        comment,
      },
    });

    // 파일들이 정상적으로 업로드되었는지 확인 후 리뷰 사진 저장
    if (req.files && req.files.length > 0) {
      const photos = req.files.map((file) => `${file.filename}`);

      await prisma.review_photos.create({
        data: {
          review_id: review.review_id,
          lodging_id: parsedLodgingId,
          review_photos_1: photos[0] || null,
          review_photos_2: photos[1] || null,
          review_photos_3: photos[2] || null,
          review_photos_4: photos[3] || null,
          review_photos_5: photos[4] || null,
        },
      });
    }

    return res.status(201).json({
      message: '리뷰가 성공적으로 등록되었습니다.',
      review,
    });
  } catch (error) {
    console.error('리뷰 생성 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류로 리뷰를 생성할 수 없습니다.' });
  }
});

// 리뷰 중복 확인 API
reviewsRouter.get('/check/:reservationId', auth, async (req, res) => {
  try {
    const { reservationId } = req.params;
    const existingReview = await prisma.reviews.findFirst({
      where: { reservation_id: parseInt(reservationId, 10) },
    });

    return res.status(200).json({ exists: !!existingReview });
  } catch (error) {
    console.error('리뷰 중복 확인 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류로 리뷰 중복 여부를 확인할 수 없습니다.' });
  }
});

// 특정 예약 ID로 리뷰 정보 가져오는 API
reviewsRouter.get('/get/:reservationId', auth, async (req, res) => {
  try {
    const { reservationId } = req.params;

    if (!reservationId) {
      return res.status(400).json({ message: '예약 ID가 누락되었습니다.' });
    }

    const review = await prisma.reviews.findFirst({
      where: { reservation_id: parseInt(reservationId, 10) },
      include: {
        review_photos: {
          select: {
            review_photos_id: true,
            review_photos_1: true,
            review_photos_2: true,
            review_photos_3: true,
            review_photos_4: true,
            review_photos_5: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ message: '해당 예약에 대한 리뷰가 존재하지 않습니다.' });
    }

    return res.status(200).json({ review });
  } catch (error) {
    console.error('리뷰 조회 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류로 리뷰를 가져올 수 없습니다.' });
  }
});

// 리뷰 수정 API (PUT 메소드)
reviewsRouter.put(
  '/put/:reviewId/:reviewPhotoId',
  auth,
  upload.array('photos', 5), // 최대 5개의 사진을 한 번에 처리
  async (req, res) => {
    try {
      const { reviewId, reviewPhotoId } = req.params;
      const { rating, comment, lodgingId, existingPhotos, deletedPhotos } = req.body;
      const userId = req.userId;

      if (!reviewId || !rating) {
        return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
      }

      const parsedReviewId = parseInt(reviewId, 10);
      const parsedRating = parseInt(rating, 10);
      const parsedLodgingId = parseInt(lodgingId, 10);

      // 기존 및 삭제할 사진 메타데이터 파싱
      let existingPhotoPaths = [];
      if (existingPhotos) {
        existingPhotoPaths = JSON.parse(existingPhotos);
      }

      let deletedPhotoPaths = [];
      if (deletedPhotos) {
        deletedPhotoPaths = JSON.parse(deletedPhotos);
      }

      // 1단계: 리뷰 세부사항 업데이트
      const updatedReview = await prisma.reviews.update({
        where: {
          review_id: parsedReviewId,
        },
        data: {
          rating: parsedRating,
          comment,
        },
      });

      // 2단계: 새로운 사진과 기존 사진을 결합하여 review_photos 테이블 업데이트
      let newPhotoPaths = [];
      if (req.files && req.files.length > 0) {
        newPhotoPaths = req.files.map((file) => `${file.filename}`);
      }

      // 기존 사진과 새로운 사진 결합
      const combinedPhotoPaths = [...existingPhotoPaths, ...newPhotoPaths];

      // review_photos 테이블을 새로운 결합된 사진으로 업데이트
      await prisma.review_photos.update({
        where: { review_photos_id: parseInt(reviewPhotoId, 10) },
        data: {
          review_photos_1: combinedPhotoPaths[0] || null,
          review_photos_2: combinedPhotoPaths[1] || null,
          review_photos_3: combinedPhotoPaths[2] || null,
          review_photos_4: combinedPhotoPaths[3] || null,
          review_photos_5: combinedPhotoPaths[4] || null,
        },
      });

      // 3단계: 더 이상 사용되지 않는 이전 사진 삭제
      if (deletedPhotoPaths.length > 0) {
        deletedPhotoPaths.forEach((photoPath) => {
          // 절대 경로를 사용하여 파일 경로 생성
          const absolutePath = path.resolve(__dirname, '..', '..', 'uploads', 'reviews', photoPath);

          // 디버깅을 위한 절대 경로 로그 출력
          console.log(`파일 삭제 시도 경로: ${absolutePath}`);

          // 로컬 파일 시스템에서 파일 삭제
          fs.unlink(absolutePath, (err) => {
            if (err) {
              console.error(`파일 삭제 실패: ${absolutePath}:`, err);
            } else {
              console.log(`이전 파일 성공적으로 삭제됨: ${absolutePath}`);
            }
          });
        });
      }

      return res.status(200).json({
        message: '리뷰가 성공적으로 수정되었습니다.',
        review: updatedReview,
      });
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
      return res.status(500).json({ message: '서버 오류로 리뷰를 수정할 수 없습니다.' });
    }
  },
);

export default reviewsRouter;
