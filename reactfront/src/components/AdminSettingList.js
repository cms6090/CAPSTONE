import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSettingList.css'; // 새로운 CSS 파일 생성

// 버튼 목록 정의 - 각 버튼은 이름, 경로, 아이콘을 가지고 있음
const buttons = [
  {
    key: 'one',
    name: '대시보드',
    path: '/admin/statistics',
    icon: <span className="material-symbols-outlined">bar_chart</span>, // 차트 아이콘 사용
  },
  {
    key: 'two',
    name: '사용자 관리',
    path: '/admin/users',
    icon: <span className="material-symbols-outlined">account_circle</span>,
  },
  {
    key: 'three',
    name: '숙소 관리',
    path: '/admin/lodgings',
    icon: <span className="material-symbols-outlined">house</span>,
  },
  {
    key: 'four',
    name: '객실 관리',
    path: '/admin/rooms',
    icon: <span className="material-symbols-outlined">bed</span>,
  },
  {
    key: 'five',
    name: '예약 관리',
    path: '/admin/reservations',
    icon: <span className="material-symbols-outlined">calendar_month</span>,
  },
  {
    key: 'six',
    name: '리뷰 관리',
    path: '/admin/reviews',
    icon: <span className="material-symbols-outlined">reviews</span>,
  },
];

// AdminSettingList 컴포넌트 - 사이드바 메뉴를 렌더링함
export default function AdminSettingList() {
  const location = useLocation(); // 현재 URL 경로를 가져옴

  return (
    <div className="admin-setting-list">
      {buttons.map(({ key, path, icon }) => {
        // 현재 경로와 버튼의 경로가 같으면 highlight 적용
        const highlight = location.pathname === path;
        return (
          <Link key={key} to={path} className={`sidebar-item ${highlight ? 'highlighted' : ''}`}>
            {/* 각 버튼의 아이콘만 렌더링 */}
            <span className="sidebar-icon">{icon}</span>
            {/* 활성화된 항목에 대해 왼쪽에 파란색 라인 표시 */}
            {highlight && <div className="active-indicator"></div>}
          </Link>
        );
      })}
    </div>
  );
}
