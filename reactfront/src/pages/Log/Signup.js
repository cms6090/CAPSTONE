import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './Signup.css';
import { Button2 } from '../../components/Button.style';

function Signup() {
  const currentYear = dayjs().year();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [isBirthdayDisabled, setIsBirthdayDisabled] = useState(false);

  // 일 수 계산
  const getDaysInMonth = (year, month) => {
    return dayjs(`${year}-${month}`).daysInMonth();
  };

  // 선택된 연도와 월에 따라 날짜를 업데이트
  const [daysInMonth, setDaysInMonth] = useState(0);

  useEffect(() => {
    if (birthYear && birthMonth) {
      const days = getDaysInMonth(birthYear, birthMonth);
      setDaysInMonth(days);
      if (birthDate > days) {
        setBirthDate(days);
      }
    } else {
      setDaysInMonth(0);
    }
  }, [birthYear, birthMonth]);

  // 생년월일 비활성화 상태 업데이트
  useEffect(() => {
    if (!birthYear || !birthMonth) {
      setIsBirthdayDisabled(true);
    } else {
      setIsBirthdayDisabled(false);
    }
  }, [birthYear, birthMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const birth = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDate.padStart(2, '0')}`;
  
    const signupData = {
      email,
      password,
      user_name: userName,
      phone_number: phoneNumber,
      birth,
      gender,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/sign/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        alert('회원가입에 성공했습니다.');
        window.location.href = '/'; // 메인 홈페이지로 이동
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const isFormValid = () => {
    return (
      email && password && userName && phoneNumber && birthYear && birthMonth && birthDate && gender
    );
  };

  return (
    <div className="verification-container">
      <h5>필수 정보 입력</h5>
      <p style={{ fontFamily: 'pretendard-light', fontWeight: '400', color: 'rgba(0,0,0,0.6)' }}>
        가입을 위해 필수 정보를 입력해 주세요.
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="email">
          <label htmlFor="email">
            이메일<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            required
          />
        </div>
        <div className="password">
          <label htmlFor="password">
            비밀번호<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div className="user-name">
          <label htmlFor="userName">
            사용자 이름<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="사용자 이름"
            required
          />
        </div>
        <div className="telno">
          <label htmlFor="phone">
            휴대폰 번호<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="01012345678"
            required
          />
        </div>
        <div className="birth">
          <label>
            생년월일<span style={{ color: 'red' }}>*</span>
          </label>
          <div className="birth-detail">
            <select
              name="year"
              value={birthYear}
              onChange={(e) => {
                setBirthYear(e.target.value);
                setBirthMonth(''); // 연도 변경 시 월 초기화
                setBirthDate(''); // 연도 변경 시 일 초기화
              }}
              className={isBirthdayDisabled ? 'disabled' : ''}
            >
              <option value="" disabled hidden>
                년도
              </option>
              {Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (
                <option key={i} value={currentYear - i}>
                  {currentYear - i}
                </option>
              ))}
            </select>
            <select
              name="month"
              value={birthMonth}
              onChange={(e) => {
                setBirthMonth(e.target.value);
                setBirthDate(''); // 월 변경 시 일 초기화
              }}
              disabled={!birthYear}
              className={isBirthdayDisabled ? 'disabled' : ''}
            >
              <option value="" disabled hidden>
                월
              </option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={!birthMonth}
              className={isBirthdayDisabled ? 'disabled' : ''}
            >
              <option value="" disabled hidden>
                일
              </option>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="gender">
          <label>
            성별<span style={{ color: 'red' }}>*</span>
          </label>
          <div className="gender-container">
            <label>
              <input
                className="gender-select"
                type="radio"
                value="남성"
                checked={gender === '남성'}
                onChange={(e) => setGender(e.target.value)}
              />
              남성
            </label>
            <label>
              <input
                className="gender-select"
                type="radio"
                value="여성"
                checked={gender === '여성'}
                onChange={(e) => setGender(e.target.value)}
              />
              여성
            </label>
          </div>
        </div>
        <Button2 type="submit" className="send-button" disabled={!isFormValid()}>
          확인
        </Button2>
      </form>
    </div>
  );
}

export default Signup;
