import Joi from "joi";

/*---------------------------------------------
    [JOI-로그인 스키마]
---------------------------------------------*/
export const SignInSchema = Joi.object({
    email: Joi.string().email().min(8).max(70).required().messages({
      'string.min': '이메일은 최소 8자 이상이어야 한다.',
      'string.max': '이메일은 최대 70자 이하여야 한다.',
      'any.required': '이메일은 반드시 작성해야 한다.',
    }),
    password: Joi
      .string()
      .min(6)
      .max(20)
      .pattern(/^[!@#$%^&*a-zA-Z0-9]*$/)
      .required()
      .messages({
        'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
        'string.max': '비밀번호는 최대 20자까지 가능합니다.',
        'string.pattern.base': '패스워드는 영문, 숫자, 특수문자 중 한 가지 이상 포함되어야 한다.',
        'any.required': '패스워드는 반드시 작성해야 한다.',
      }),
  });
