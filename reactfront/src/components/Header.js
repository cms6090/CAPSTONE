import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Button1 } from './Button.style';
import { Menu } from '@mui/icons-material';
import { IconButton, Menu as MenuComponent, MenuItem, Divider, ListItemText } from '@mui/material';

function Header() {
  const [userEmail, setUserEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 세션 저장소에서 사용자 이메일을 가져와 설정
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const accessToken = sessionStorage.getItem('accessToken');

    // 로그인된 이메일을 콘솔에 표시
    console.log('Logged in user email:', storedUserEmail);

    if (storedUserEmail && storedUserEmail !== 'undefined' && accessToken) {
      setUserEmail(storedUserEmail);
    } else {
      setUserEmail('');
    }
  }, []); // 페이지 로드 시 한 번 실행

  const handleLogout = () => {
    // 로그아웃 처리 (세션 저장소에서 사용자 정보 삭제)
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('accessToken');
    setUserEmail('');
    window.location.href = '/'; // 로그아웃 후 메인 페이지로 이동
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </div>
      <div>
        {userEmail ? (
          // 로그인된 경우 사용자 이메일과 햄버거 메뉴 표시
          <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={handleMenuClick}
              className='user-set'
            >
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{userEmail}</span>
              <IconButton aria-label="menu" style={{ padding: 0 }}>
                <Menu />
              </IconButton>
            </div>

            <MenuComponent
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  width: '250px',
                  padding: '10px',
                },
              }}
            >
              <MenuItem onClick={() => handleNavigation('/profile/reservations')}>
                <ListItemText primary="예약 내역" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleNavigation('/profile/info')}>
                <ListItemText primary="사용자 정보" />
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/profile/setting')}>
                <ListItemText primary="설정" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
              >
                <ListItemText primary="로그아웃" />
              </MenuItem>
            </MenuComponent>
          </div>
        ) : (
          // 로그인되지 않은 경우 로그인/회원가입 버튼 표시
          <Link to="/login">
            <Button1 variant="outlined" disableFocusRipple>
              로그인/회원가입
            </Button1>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
