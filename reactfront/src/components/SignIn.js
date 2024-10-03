import React, { useState } from "react";
import styles from './SignIn.module.css'; // CSS 모듈 import
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", rememberMe);
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
            className="form-control" // CSS 모듈 클래스를 추가
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
            className="form-control" // CSS 모듈 클래스를 추가
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
