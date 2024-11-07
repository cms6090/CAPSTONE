import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Button1 } from './Button.style';
import { Menu } from '@mui/icons-material';
import { IconButton, Menu as MenuComponent, MenuItem, Divider, ListItemText } from '@mui/material';
import SearchSection from '../components/SearchSection';

function Header() {
  const [userEmail, setUserEmail] = useState('');
  const [userPermission, setUserPermission] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const storedUserPermission = sessionStorage.getItem('userPermission');
    const accessToken = sessionStorage.getItem('accessToken');

    if (storedUserEmail && accessToken) {
      setUserEmail(storedUserEmail);
      setUserPermission(storedUserPermission);
    } else {
      setUserEmail('');
      setUserPermission('');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/users/sign/logout', {
        method: 'POST',
        credentials: 'include',
      });

      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userPermission');
      setUserEmail('');
      setUserPermission('');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
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

  const renderAdminMenuItems = () =>
    [
      { key: 'statistics', label: '통계', path: '/admin/statistics' },
      { key: 'users', label: '사용자 관리', path: '/admin/users' },
      { key: 'accommodations', label: '숙소 관리', path: '/admin/lodgings' },
      { key: 'rooms', label: '객실 관리', path: '/admin/rooms' },
      { key: 'reservations', label: '예약 관리', path: '/admin/reservations' },
      { key: 'reviews', label: '리뷰 관리', path: '/admin/reviews' },
    ].map((item) => (
      <MenuItem key={item.key} onClick={() => handleNavigation(item.path)}>
        <ListItemText primary={item.label} />
      </MenuItem>
    ));

  const renderUserMenuItems = () =>
    [
      { key: 'profile-reservations', label: '예약 내역', path: '/profile/reservations' },
      { key: 'profile-info', label: '사용자 정보', path: '/profile/info' },
      { key: 'profile-setting', label: '설정', path: '/profile/setting' },
    ].map((item) => (
      <MenuItem key={item.key} onClick={() => handleNavigation(item.path)}>
        <ListItemText primary={item.label} />
      </MenuItem>
    ));

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </div>

      {location.pathname.startsWith('/accommodations') && (
        <div className="search-component">
          <SearchSection />
        </div>
      )}

      <div>
        {userEmail ? (
          <div className="user-info" style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={handleMenuClick} className="user-set">
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
              {userPermission === '관리자' ? renderAdminMenuItems() : renderUserMenuItems()}
              <Divider />
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
