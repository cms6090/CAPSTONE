import React from 'react';
import './Header.css'; // CSS 파일을 통해 스타일링을 적용합니다.
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'; // 경로 수정
import { Button1, Button2, Button3 } from './Button.style'; // Button1과 Button2 불러오기

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </div>
      <div>
        <Link to="/login">
          <Button1 variant="outlined" disableFocusRipple="true" style={{ marginRight: '10px' }}>
            로그인/회원가입
          </Button1>
        </Link>
      </div>
    </header>
  );
}

export default Header;
