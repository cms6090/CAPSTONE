// ProfileInfo.js
import React, { useState } from 'react';
import SettingList from '../components/SettingList';
import './ProfileInfo.css';
import { Button1 } from '../components/Button.style';
import dayjs from 'dayjs';
import DatePickerComponent from '../components/DatePicker'; // DatePickerComponent 가져오기

export default function ProfileInfo() {
  const [isEditable, setIsEditable] = useState(false); // 입력 가능 여부 상태 관리
  const [birthDate, setBirthDate] = useState(dayjs('2000-10-28')); // 생년월일 초기값 설정

  const handleEditClick = () => {
    setIsEditable((prev) => !prev); // 버튼 클릭 시 입력 가능 여부 토글
  };

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="info">
        <h2>내 정보 관리</h2> <h3 style={{ marginTop: '1em' }}>회원 정보</h3>
        <div className="info-container">
          <div className="info-section">
            <div className="info-item">
              <div className="info-title">닉네임</div>
              <input
                className="info-data"
                type="text"
                placeholder="감동적으로친숙해진민중"
                disabled={!isEditable}
              />
            </div>
            <div className="info-item">
              <div className="info-title">휴대폰 번호</div>
              <input
                className="info-data"
                type="text"
                placeholder="0103058****"
                disabled={!isEditable}
              />
            </div>
            <div className="info-item">
              <div className="info-title">생년월일</div>
              <DatePickerComponent
                value={birthDate}
                onChange={setBirthDate}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="info-section">
            <div className="info-item">
              <div className="info-title">이름</div>
              <input className="info-data" type="text" placeholder="이름" disabled={!isEditable} />
            </div>
            <div className="info-item">
              <div className="info-title">이메일</div>
              <input
                className="info-data"
                type="text"
                placeholder="cho03m***@naver.com"
                disabled={!isEditable}
              />
            </div>
            <div className="info-item">
              <div className="info-title">성별</div>
              <input className="info-data" type="text" placeholder="남자" disabled={!isEditable} />
            </div>
            <Button1 onClick={handleEditClick}>{isEditable ? '완료' : '변경하기'}</Button1>
          </div>
        </div>
      </div>
    </div>
  );
}
