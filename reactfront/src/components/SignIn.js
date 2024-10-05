// src/components/SignIn.js
import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css'; // CSS 모듈 import
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태 추가
  const location = useLocation(); // 현재 URL 정보 가져오기
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate 사용

  // URL에서 redirectUri 추출
  const queryParams = new URLSearchParams(location.search);
  const redirectUri = queryParams.get('redirectUri') || '/'; // 기본값은 '/'로 설정

  const handleSubmit = (event) => {
    event.preventDefault();

    // 보낼 데이터 준비
    const userData = {
      email,
      password,
    //   rememberMe
    };

    // 서버로 POST 요청 보내기
    fetch('http://localhost:3000/api/sign/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('로그인 실패');
        }
      })
      .then((data) => {
        console.log('성공:', data);
        localStorage.setItem('token', data.token);  // JWT 토큰을 localStorage에 저장
        navigate(redirectUri);  // 로그인 성공 후, 지정된 redirectUri로 리디렉션
      })
      .catch((error) => {
        console.error('오류:', error);
        setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles["login-container"]}>
      <h2>이메일로 시작하기</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            이메일<span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="abc@gccompany.co.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            비밀번호<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            로그인 유지
          </label>
        </div>

        {/* Login Button */}
        <button type="submit" className="btn btn-primary w-100">
          로그인
        </button>

        {/* Error Message */}
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}

        {/* Forgot Password Link */}
        <div className="mt-3 text-end">
          <a href="#" className="small-text">비밀번호 재설정</a>
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p className="small-text">계정이 없으신가요? <a href="#">이메일로 회원가입</a></p>
      </div>
    </div>
  );
};

export default SignIn;
