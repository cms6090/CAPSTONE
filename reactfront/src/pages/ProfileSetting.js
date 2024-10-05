import React from 'react';
import SettingList from '../components/SettingList';
import './ProfileSetting.css';

export default function ProfileSetting() {
  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="profile-details">
        {/* 예약 정보 섹션 */}
        <h2>내 예약 관리</h2>
      </div>
    </div>
  );
}
