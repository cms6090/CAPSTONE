import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Button1 } from './Button.style';
import { Menu } from '@mui/icons-material';
import { IconButton, Menu as MenuComponent, MenuItem, Divider, ListItemText } from '@mui/material';

function Header() {
  const [userEmail, setUserEmail] = useState(''); // 사용자 이메일 상태 관리
  const [userPermission, setUserPermission] = useState(''); // 사용자 권한 상태 관리
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 앵커 요소 상태 관리
  const navigate = useNavigate();

  // 페이지가 로드될 때 세션에서 이메일과 권한을 가져와 상태 업데이트
  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const storedUserPermission = sessionStorage.getItem('userPermission'); // 권한 가져오기
    const accessToken = sessionStorage.getItem('accessToken');

    // 이메일과 권한이 존재하면 상태 설정
    if (storedUserEmail && accessToken) {
      setUserEmail(storedUserEmail);
      setUserPermission(storedUserPermission);
      console.log('User email:', storedUserEmail);
      console.log('User permission:', storedUserPermission); // 콘솔에 권한 출력
    } else {
      setUserEmail('');
      setUserPermission('');
    }
  }, []); // 페이지 로드 시 한 번 실행

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/users/sign/logout', {
        method: 'POST',
        credentials: 'include', // 요청에 쿠키 포함하기
      });

      // 서버 로그아웃이 성공하면 세션 데이터 제거
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userPermission');
      setUserEmail('');
      setUserPermission('');
      window.location.href = '/'; // 메인 페이지로 이동
    } catch (error) {
      console.error('Logout failed:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 메뉴 버튼 클릭 시 앵커 요소 설정
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 함수
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 페이지 네비게이션 함수
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
          // 로그인된 경우 사용자 이메일과 권한 표시
          <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={handleMenuClick} className="user-set">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {userEmail} ({userPermission}) {/* 권한도 함께 표시 */}
              </span>
              <IconButton aria-label="menu" style={{ padding: 0 }}>
                <Menu />
              </IconButton>
            </div>

            {/* 메뉴 컴포넌트 */}
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
              {userPermission === '관리자' ? [
                // 관리자 권한일 경우 메뉴 항목 표시
                <MenuItem key="users" onClick={() => handleNavigation('/admin/users')}>
                  <ListItemText primary="사용자 정보" />
                  </MenuItem>,
                <MenuItem key="accommodations" onClick={() => handleNavigation('/admin/lodgings')}>
                  <ListItemText primary="숙소 정보" />
                </MenuItem>,
                <MenuItem key="rooms" onClick={() => handleNavigation('/admin/rooms')}>
                  <ListItemText primary="객실 정보" />
                </MenuItem>,
                <MenuItem key="reservations" onClick={() => handleNavigation('/admin/reservations')}>
                  <ListItemText primary="예약 정보" />
                </MenuItem>,
                <Divider key="divider" />,
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  <ListItemText primary="로그아웃" />
                </MenuItem>,
              ] : [
                // 일반 사용자일 경우 메뉴 항목 표시
                <MenuItem key="profile-reservations" onClick={() => handleNavigation('/profile/reservations')}>
                  <ListItemText primary="예약 내역" />
                </MenuItem>,
                <Divider key="divider1" />,
                <MenuItem key="profile-info" onClick={() => handleNavigation('/profile/info')}>
                  <ListItemText primary="사용자 정보" />
                </MenuItem>,
                <MenuItem key="profile-setting" onClick={() => handleNavigation('/profile/setting')}>
                  <ListItemText primary="설정" />
                </MenuItem>,
                <MenuItem
                  key="profile-logout"
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  <ListItemText primary="로그아웃" />
                </MenuItem>,
              ]}
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