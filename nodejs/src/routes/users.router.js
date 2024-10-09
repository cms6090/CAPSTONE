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
    const userVal = await SignUpSchema.validateAsync(req.body);
    const { email, password, user_name, phone_number, birth, gender } = userVal;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new StatusError('이미 존재하는 이메일입니다.', StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        user_name,
        phone_number,
        birth,
        gender,
        permission: "유저"
      },
    });

    return res.status(StatusCodes.CREATED).json({
      message: `이메일: ${createUser.email}, 닉네임: ${createUser.user_name} 회원가입 완료`,
    });
  } catch (error) {
    next(error);
  }
});

/*---------------------------------------------
    [로그인]
---------------------------------------------*/
UsersRouter.post('/sign/signin', async (req, res, next) => {
  try {
    const userVal = await SignInSchema.validateAsync(req.body);
    const { email, password } = userVal;

    const loginUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!loginUser) {
      throw new StatusError('존재하지 않는 이메일입니다.', StatusCodes.NOT_FOUND);
    }

    const match = await bcrypt.compare(password, loginUser.password);
    if (!match) {
      throw new StatusError('비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      { id: loginUser.user_id }, // user_id 사용
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: loginUser.user_id }, // user_id 사용
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({ message: '로그인 성공' });
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
