import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/prisma.js';
import { SignInSchema } from '../schemas/signIn.schema.js';
import { SignUpSchema } from '../schemas/signUp.schema.js';
import { StatusCodes } from 'http-status-codes';
import StatusError from '../errors/status.error.js';

const UsersRouter = express.Router();

/*---------------------------------------------
    [회원가입]
---------------------------------------------*/
UsersRouter.post('/sign/signup', async (req, res, next) => {
  try {
    // 회원가입 요청 데이터 유효성 검사
    const userVal = await SignUpSchema.validateAsync(req.body);
    const { email, password, user_name, phone_number, birth, gender } = userVal;

    // 이메일 중복 확인
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      // 이미 존재하는 이메일일 경우 에러 반환
      return res.status(StatusCodes.CONFLICT).json({
        message: '이미 존재하는 이메일입니다.',
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const createUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        user_name,
        phone_number,
        birth,
        gender,
        permission: '유저',
      },
    });

    // 회원가입 성공 메시지 반환
    return res.status(StatusCodes.CREATED).json({
      message: `이메일: ${createUser.email}, 닉네임: ${createUser.user_name} 회원가입 완료`,
    });
  } catch (error) {
    if (error.isJoi) {
      // Joi 유효성 검사 오류 메시지 반환
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next(error);
  }
});

/*---------------------------------------------
    [로그인] Updated for Permission
---------------------------------------------*/
UsersRouter.post('/sign/signin', async (req, res, next) => {
  try {
    // 로그인 요청 데이터 유효성 검사
    const userVal = await SignInSchema.validateAsync(req.body);
    const { email, password } = userVal;

    // 사용자 이메일 확인
    const loginUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!loginUser) {
      // 이메일이 존재하지 않을 경우 에러 반환
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '존재하지 않는 이메일입니다.',
      });
    }

    // 비밀번호 일치 여부 확인
    const match = await bcrypt.compare(password, loginUser.password);
    if (!match) {
      // 비밀번호가 일치하지 않을 경우 에러 반환
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // 액세스 토큰 생성 (권한 포함)
    const accessToken = jwt.sign(
      { id: loginUser.user_id, permission: loginUser.permission },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '1h' },
    );

    // 리프레시 토큰 생성 (권한 포함)
    const refreshToken = jwt.sign(
      { id: loginUser.user_id, permission: loginUser.permission },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' },
    );

    // 응답 헤더에 액세스 토큰 설정
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    // 리프레시 토큰을 쿠키에 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 로그인 성공 메시지와 사용자 정보 반환
    return res.status(StatusCodes.OK).json({
      message: '로그인 성공',
      user: { email: loginUser.email, permission: loginUser.permission },
    });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [로그아웃]
---------------------------------------------*/
UsersRouter.post('/sign/logout', async (req, res, next) => {
  try {
    // 쿠키에서 리프레시 토큰 추출
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No refresh token provided' });
    }

    // 리프레시 토큰을 무효화하거나 블랙리스트에 추가할 수 있음
    res.clearCookie('refreshToken'); // 리프레시 토큰 쿠키 제거
    return res.status(StatusCodes.OK).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [사용자 정보 조회]
---------------------------------------------*/
UsersRouter.get('/inquiry', async (req, res, next) => {
  try {
    // 요청 헤더에서 JWT 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    // 사용자 정보 조회
    const user = await prisma.users.findUnique({
      where: { user_id: decoded.id },
      select: {
        user_name: true,
        email: true,
        phone_number: true,
        birth: true,
        gender: true,
        user_id: true,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    // 사용자 정보 반환
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [사용자 정보 수정]
---------------------------------------------*/
UsersRouter.put('/modify', async (req, res, next) => {
  try {
    console.log('Received data:', req.body);

    // 요청 헤더에서 JWT 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    // 요청 본문에서 사용자 데이터 추출
    const { user_name, phone_number, gender, birth } = req.body;

    // 사용자 존재 여부 확인
    const user = await prisma.users.findUnique({
      where: { user_id: decoded.id },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    // 사용자 정보 업데이트 및 업데이트 시간 설정
    const updatedUser = await prisma.users.update({
      where: { user_id: decoded.id },
      data: {
        user_name: user_name || user.user_name,
        phone_number: phone_number || user.phone_number,
        gender: gender || user.gender,
        birth: birth || user.birth,
        updated_at: new Date(),
      },
    });

    // 업데이트된 사용자 정보 반환
    return res.status(StatusCodes.OK).json({
      message: 'User information updated successfully',
      user: {
        user_name: updatedUser.user_name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        gender: updatedUser.gender,
        birth: updatedUser.birth,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
