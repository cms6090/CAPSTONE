import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Button1, Button2 } from './Button.style'; // Button1과 Button2 불러오기

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </div>
      <nav className="navigation">{/* 필요 시 내비게이션 아이템 추가 */}</nav>
      <div>
        <Link to="/login">
          <Button1 variant="outlined" disableFocusRipple="true" style={{ marginRight: '10px' }}>
            로그인/회원가입
          </Button1>
          </Link>
        <Button2 variant="contained">버튼 2</Button2>
      </div>
    </header>
  );
}

export default Header;
