import React, { useState } from 'react';
import './Signup.css'; // CSS 파일 추가

function Signup() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 인증 로직 구현
    console.log('Sending verification code to:', phoneNumber);
  };

  return (
    <div className="verification-container">
      <h3>휴대폰 인증</h3>
      <p>원활한 서비스 제공을 위해, 휴대폰 번호를 입력해 주세요.</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="phone">휴대폰 번호<span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="01012345678"
            required
          />
        </div>
        <button type="submit" className="send-button">인증번호 전송</button>
      </form>
    </div>
  );
}

export default Signup;
