import React from 'react';
import SettingList from '../components/SettingList';
import './ProfileReserve.css';

export default function ProfileReserve() {
  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="reserve-details">
        <h2>내 예약 관리</h2>
        <div className="reserve-section">
          <h3 style={{ marginBottom: '1em' }}>예약 정보</h3>
          <div className="reserve-item">예약내역</div>
        </div>
      </div>
    </div>
  );
}
