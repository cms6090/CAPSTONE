import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.svg'; // 로고 이미지 경로

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setErrors({ ...errors, [e.target.name]: '' }); // 에러 메시지 초기화
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = { email: '', password: '' };

    if (!email) newErrors.email = '이메일을 입력하세요.';
    if (!password) newErrors.password = '비밀번호를 입력하세요.';

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // 로그인 로직 구현 (POST 요청 보내기)
    const loginData = {
      email,
      password,
      // remember_me: rememberMe,
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/sign/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      // 로그인 성공 시
      if (response.ok) {
        const result = await response.json();
        const accessToken = response.headers.get('Authorization').replace('Bearer ', '');
        
        console.log('Login successful:', result);
        alert('로그인에 성공했습니다.');

        // JWT Access 토큰 세션 스토리지에 저장
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('userEmail', email); // 이메일도 세션 스토리지에 저장

        window.location.href = '/'; // 메인 홈페이지로 이동
      } else {
        // 요청이 실패한 경우
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="login-container">
      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">
            이메일<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            required
            placeholder="abc@gccompany.co.kr"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="input-group">
          <label htmlFor="password">
            비밀번호<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange(setPassword)}
            required
            placeholder="비밀번호를 입력하세요."
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        <div className="options">
          <label className="remember-me-label">
            <input
              type="checkbox"
              //checked={rememberMe}
              //onChange={() => setRememberMe(!rememberMe)}
            />
            <h6 style={{ marginBottom: '0px', color: 'rgba(0,0,0,0.7)' }}>로그인 유지</h6>
          </label>
          <a href="#" className="forgot-password">
            비밀번호 재설정
          </a>
        </div>
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
      <div className="signup-link">
        <p style={{ fontSize: '0.8em', marginBottom: '1.1em' }}>계정이 없으신가요?</p>
        <a href="./signup" style={{ fontSize: '0.9em' }}>
          이메일로 회원가입
        </a>
      </div>
    </div>
  );
}

export default Login;
