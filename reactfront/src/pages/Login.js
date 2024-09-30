import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.svg'; // 로고 이미지 경로

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    let newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = '이메일을 입력하세요.';
    }
    if (!password) {
      newErrors.password = '비밀번호를 입력하세요.';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // 로그인 로직 구현
    console.log('Logging in with:', { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div style={{ textAlign: 'center' }}><img src={logo} alt="Logo" /></div>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">이메일<span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
            required
            placeholder="abc@gccompany.co.kr"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호<span style={{ color: 'red' }}>*</span></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
            required
            placeholder="비밀번호를 입력하세요."
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        <div className="options">
          <label className="remember-me-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <p>로그인 유지</p>
          </label>
          <a href="#" className="forgot-password">비밀번호 재설정</a>
        </div>
        <button type="submit" className="login-button">로그인</button>
      </form>
      <div className="signup-link">
        <p style={{ fontSize: '0.8em', marginBottom:'1.1em' }}>계정이 없으신가요?</p>
        <a href="./signup" style={{fontSize:'0.9em'}}>이메일로 회원가입</a>
      </div>
    </div>
  );
}

export default Login;
