import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.svg';

export default function Login() {
  const [email, setEmail] = useState(''); // 이메일 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리
  const [errors, setErrors] = useState({ email: '', password: '', general: '' }); // 에러 메시지 상태 관리

  // 입력값이 변경될 때 상태 업데이트 및 에러 초기화
  const handleChange = (setter) => (e) => {
    setter(e.target.value); // 입력 필드의 값을 해당 상태로 설정
    setErrors({ ...errors, [e.target.name]: '', general: '' }); // 에러 메시지 초기화
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    const newErrors = { email: '', password: '', general: '' }; // 새로운 에러 객체 생성

    // 이메일과 비밀번호가 입력되었는지 확인
    if (!email) newErrors.email = '이메일을 입력하세요.';
    if (!password) newErrors.password = '비밀번호를 입력하세요.';

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors); // 에러 메시지 설정
      return;
    }

    const loginData = { email, password }; // 로그인 데이터 객체 생성

    try {
      const response = await fetch('http://localhost:3000/api/users/sign/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // 요청 본문에 로그인 데이터 포함
      });

      // 서버 응답이 성공적일 때
      if (response.ok) {
        const result = await response.json(); // 응답 본문을 JSON으로 파싱
        const accessToken = response.headers.get('Authorization').replace('Bearer ', ''); // 토큰 추출

        // 이메일과 권한이 응답에 존재하는지 확인
        if (result.user && result.user.email && result.user.permission) {
          alert('로그인에 성공했습니다.');

          // 세션 스토리지에 토큰, 이메일, 권한 저장
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('userEmail', result.user.email); // 이메일 저장
          sessionStorage.setItem('userPermission', result.user.permission); // 권한 저장

          window.location.href = '/'; // 메인 페이지로 리디렉션
        } else {
          console.error('Invalid response format:', result);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        const errorData = await response.json(); // 에러 응답 파싱
        console.error('Login failed:', errorData);
        setErrors({ ...errors, general: errorData.message }); // 일반적인 에러 메시지 설정
      }
    } catch (error) {
      console.error('Network error:', error); // 네트워크 오류 처리
      setErrors({ ...errors, general: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' }); // 네트워크 에러 메시지 설정
    }
  };

  return (
    <div className="login-container">
      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" />
      </div>
      <form onSubmit={handleLogin}>
        {/* 이메일 입력 필드 */}
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
            style={{ border: '15px' }}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
          {/* 이메일 에러 메시지 표시 */}
        </div>
        {/* 비밀번호 입력 필드 */}
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
            style={{ border: '15px' }}
            placeholder="비밀번호를 입력하세요."
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          {/* 비밀번호 에러 메시지 표시 */}
        </div>
        <button type="submit" className="login-button">
          로그인
        </button>
        {errors.general && <div className="error-message general-error">{errors.general}</div>}
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
