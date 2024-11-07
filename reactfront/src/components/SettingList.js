import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import settingArrow from '../assets/Arrowright.svg';
import './SettingList.css';

const buttons = [
  { key: 'one', name: '예약 내역', path: '/profile/reservations' },
  { key: 'two', name: '내 정보 관리', path: '/profile/info' },
  { key: 'three', name: '회원 탈퇴', path: '/profile/setting' },
];

export default function SettingList() {
  const location = useLocation();

  return (
    <div className="setting-list">
      {buttons.map(({ key, name, path }) => {
        const highlight = location.pathname === path && key !== 'three';
        const isRed = key === 'three';
        return (
          <Link key={key} to={path} className="button-container">
            <div
              className={`setting-container ${highlight ? 'highlight' : ''} ${isRed ? 'red' : ''}`}
            >
              <div className="setting-name">{name}</div>
              <img src={settingArrow} alt="화살표" className="setting-arrow" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
