import express from 'express';
import bcrypt from 'bcrypt';
import joi from 'joi';
import { prisma } from '../utils/prisma/prisma.js';
const UsersRouter = express.Router();

/*---------------------------------------------
    [JOI-회원가입 스키마]
---------------------------------------------*/
const SignUpSchema = joi.object({
    email: joi.string()
        .email()
        .min(8)
        .max(70)
        .required()
        .messages({
            'string.email': '유효한 이메일 주소를 입력하세요.',
            'any.required': '이메일 주소는 필수입니다.'
        }),
    password: joi.string()
        .min(6)
        .max(20)
        .pattern(/^[!@#$%^&*a-zA-Z0-9]*$/)
        .required()
        .messages({
            'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
            'string.max': '비밀번호는 최대 20자 이하여야 합니다.',
            'any.required': '비밀번호는 필수입니다.'
        }),
    user_name: joi.string()
        .min(1)
        .max(15)
        .pattern(/^[a-zA-Z0-9가-힣]*$/)
        .required()
        .messages({
            'string.min': '이름은 최소 1자 이상이어야 합니다.',
            'string.max': '이름은 최대 15자 이하여야 합니다.',
            'any.required': '이름은 필수입니다.'
        }),
    telno: joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            'string.pattern.base': '전화번호는 10자리에서 15자리 사이의 숫자여야 합니다.',
            'any.required': '전화번호는 필수입니다.'
        }),
    birth: joi.date()
        .iso()
        .required()
        .messages({
            'date.iso': '생년월일은 YYYY-MM-DD 형식이어야 합니다.',
            'any.required': '생년월일은 필수입니다.'
        }),
    gender: joi.string()
        .valid('남성', '여성')
        .required()
        .messages({
            'any.only': '성별은 "남성", "여성" 중 하나여야 합니다.',
            'any.required': '성별은 필수입니다.'
        })
  });

/*---------------------------------------------
    [회원가입]
---------------------------------------------*/
UsersRouter.post('/sign/signup', async (req, res) => {
    try {
      const userVal = await SignUpSchema.validateAsync(req.body);
  
      const { email, password, user_name, telno, birth, gender } = userVal;
  
      const isExistEmail = await prisma.users.findUnique({
        where: {
          email,
        },
      });
  
      if (isExistEmail) {
        return res.status(400).send("이미 존재하는 이메일");
//        throw new StatusError('이미 존재하는 이메일입니다.', StatusCodes.CONFLICT);
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const createUser = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          user_name,
          telno,
          birth,
          gender,
          permission: "유저"
        },
      });
  
      console.log(createUser);
      return res.status(200).json({
        message: `이메일: ${createUser.email}, 닉네임: ${createUser.user_name} 회원가입 완료`,
      });
    } catch (error) {
        console.log(error);
        return res.status(400).send("실패");
      //return next(error);
    }
  });
  
export default UsersRouter;