import Joi from "joi";

/*---------------------------------------------
    [JOI-회원가입 스키마]
---------------------------------------------*/
export const SignUpSchema = Joi.object({
    email: Joi.string()
        .email()
        .min(8)
        .max(70)
        .required()
        .messages({
            'string.email': '유효한 이메일 주소를 입력하세요.',
            'any.required': '이메일 주소는 필수입니다.'
        }),
    password: Joi.string()
        .min(6)
        .max(20)
        .pattern(/^[!@#$%^&*a-zA-Z0-9]*$/)
        .required()
        .messages({
            'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
            'string.max': '비밀번호는 최대 20자 이하여야 합니다.',
            'any.required': '비밀번호는 필수입니다.'
        }),
    user_name: Joi.string()
        .min(1)
        .max(15)
        .pattern(/^[a-zA-Z0-9가-힣]*$/)
        .required()
        .messages({
            'string.min': '이름은 최소 1자 이상이어야 합니다.',
            'string.max': '이름은 최대 15자 이하여야 합니다.',
            'any.required': '이름은 필수입니다.'
        }),
    phone_number: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            'string.pattern.base': '전화번호는 10자리에서 15자리 사이의 숫자여야 합니다.',
            'any.required': '전화번호는 필수입니다.'
        }),
    birth: Joi.date()
        .iso()
        .required()
        .messages({
            'date.iso': '생년월일은 YYYY-MM-DD 형식이어야 합니다.',
            'any.required': '생년월일은 필수입니다.'
        }),
    gender: Joi.string()
        .valid('남성', '여성')
        .required()
        .messages({
            'any.only': '성별은 "남성", "여성" 중 하나여야 합니다.',
            'any.required': '성별은 필수입니다.'
        })
  });