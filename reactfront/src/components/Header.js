import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Button1 } from './Button.style';
import { Menu } from '@mui/icons-material';
import { IconButton, Menu as MenuComponent, MenuItem, Divider, ListItemText } from '@mui/material';
import SearchSection from '../components/SearchSection'; // 검색 컴포넌트 import

function Header() {
  const [userEmail, setUserEmail] = useState(''); // 사용자 이메일 상태 관리
  const [userPermission, setUserPermission] = useState(''); // 사용자 권한 상태 관리
  const [anchorEl, setAnchorEl] = useState(null); // 메뉴 앵커 요소 상태 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  const location = useLocation(); // 현재 URL 확인을 위한 훅

  // 페이지가 로드될 때 세션에서 이메일과 권한을 가져와 상태 업데이트
  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const storedUserPermission = sessionStorage.getItem('userPermission'); // 사용자 권한 정보 가져오기
    const accessToken = sessionStorage.getItem('accessToken'); // 액세스 토큰 가져오기

    // 이메일과 액세스 토큰이 존재할 경우 사용자 정보를 상태에 설정
    if (storedUserEmail && accessToken) {
      setUserEmail(storedUserEmail);
      setUserPermission(storedUserPermission);
    } else {
      setUserEmail('');
      setUserPermission('');
    }
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
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
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Logout failed:', error); // 에러 발생 시 콘솔에 출력
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.'); // 사용자에게 오류 알림
    }
  };

  // 메뉴 버튼 클릭 시 메뉴 앵커 요소 설정 함수
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // 클릭한 위치를 앵커 요소로 설정
  };

  // 메뉴 닫기 함수
  const handleMenuClose = () => {
    setAnchorEl(null); // 메뉴 앵커 요소를 null로 설정하여 메뉴 닫기
  };

  // 페이지 네비게이션 함수
  const handleNavigation = (path) => {
    handleMenuClose(); // 메뉴를 닫고
    navigate(path); // 지정된 경로로 이동
  };

  // 관리자 메뉴 항목 렌더링 함수
  const renderAdminMenuItems = () => (
    [
      { key: 'users', label: '사용자 관리', path: '/admin/users' },
      { key: 'accommodations', label: '숙소 관리', path: '/admin/lodgings' },
      { key: 'rooms', label: '객실 관리', path: '/admin/rooms' },
      { key: 'reservations', label: '예약 관리', path: '/admin/reservations' },
      { key: 'reviews', label: '리뷰 관리', path: '/admin/reviews' },
    ].map((item) => (
      <MenuItem key={item.key} onClick={() => handleNavigation(item.path)}>
        <ListItemText primary={item.label} />
      </MenuItem>
    ))
  );

  // 일반 사용자 메뉴 항목 렌더링 함수
  const renderUserMenuItems = () => (
    [
      { key: 'profile-reservations', label: '예약 내역', path: '/profile/reservations' },
      { key: 'profile-info', label: '사용자 정보', path: '/profile/info' },
      { key: 'profile-setting', label: '설정', path: '/profile/setting' },
    ].map((item) => (
      <MenuItem key={item.key} onClick={() => handleNavigation(item.path)}>
        <ListItemText primary={item.label} />
      </MenuItem>
    ))
  );

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </div>

      {/* 현재 URL이 /accommodations로 시작할 경우 검색 컴포넌트 표시 */}
      {location.pathname.startsWith('/accommodations') && (
        <div className="search-component">
          <SearchSection />
        </div>
      )}

      <div>
        {userEmail ? (
          // 로그인된 경우 사용자 이메일과 권한 표시
          <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={handleMenuClick} className="user-set">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{userEmail}</span>
              <IconButton aria-label="menu" style={{ padding: 0 }}>
                <Menu />
              </IconButton>
            </div>

            {/* 메뉴 컴포넌트 */}
            <MenuComponent
              anchorEl={anchorEl} // 메뉴가 열릴 위치 지정
              open={Boolean(anchorEl)} // 메뉴 열림 여부 설정
              onClose={handleMenuClose} // 메뉴 닫기 함수 연결
              PaperProps={{
                style: {
                  width: '250px',
                  padding: '10px',
                },
              }}
            >
              {/* 관리자 또는 일반 사용자에 따라 메뉴 항목 렌더링 */}
              {userPermission === '관리자'
                ? renderAdminMenuItems() // 관리자 메뉴 항목 렌더링
                : renderUserMenuItems() // 일반 사용자 메뉴 항목 렌더링
              }
              <Divider />
              {/* 로그아웃 메뉴 항목 */}
              <MenuItem
                key="logout"
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
