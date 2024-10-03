import * as React from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation 추가
import settingArrow from '../assets/Arrowright.svg';
import './SettingList.css';

const buttons = [
  { key: "one", name: "예약 내역", path: "/profile/reservations" },
  { key: "two", name: "내 정보 관리", path: "/profile/info" },
  { key: "three", name: "설정", path: "/profile/setting" },
];

export default function SettingList() {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <div className="setting-list">
      {buttons.map(({ key, name, path }) => {
        const highlight = location.pathname === path; // 현재 경로와 버튼의 경로가 같으면 highlight 설정
        return (
          <Link key={key} to={path} className="button-container">
            <div className={`setting-container ${highlight ? 'highlight' : ''}`}>
              <div className="setting-name">{name}</div>
              <img src={settingArrow} alt="화살표" className="setting-arrow" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
