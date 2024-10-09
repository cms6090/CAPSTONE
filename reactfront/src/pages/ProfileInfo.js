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
  const [nickname, setNickname] = useState('감동적으로친숙해진민중');
  const [phoneNumber, setPhoneNumber] = useState('0103058****');
  const [name, setName] = useState('이름');
  const [gender, setGender] = useState('남자');

  const handleEditClick = () => {
    if (isEditable) {
      // 완료 버튼 클릭 시 변경한 내용을 콘솔에 출력
      console.log('변경된 닉네임:', nickname);
      console.log('변경된 휴대폰 번호:', phoneNumber);
      console.log('변경된 생년월일:', birthDate.format('YYYY-MM-DD'));
      console.log('변경된 이름:', name);
      console.log('변경된 성별:', gender);
    }
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
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={!isEditable}
                style={{ color: isEditable ? 'black' : 'rgba(0, 0, 0, 0.4)' }}
              />
            </div>
            <div className="info-item">
              <div className="info-title">휴대폰 번호</div>
              <input
                className="info-data"
                type="text"
                value={phoneNumber}
                style={{ color: isEditable ? 'black' : 'rgba(0, 0, 0, 0.4)' }}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              <input
                className="info-data"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditable}
                style={{ color: isEditable ? 'black' : 'rgba(0, 0, 0, 0.4)' }}
              />
            </div>
            <div className="info-item">
              <div className="info-title">이메일</div>
              <input className="info-data" type="text" value="cho03m***@naver.com" disabled />
            </div>
            <div className="info-item">
              <div className="info-title">성별</div>
              <select
                className="info-data"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={!isEditable}
                style={{ color: isEditable ? 'black' : 'rgba(0, 0, 0, 0.4)' }}
              >
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </div>
            <Button1 onClick={handleEditClick}>{isEditable ? '완료' : '변경하기'}</Button1>
          </div>
        </div>
      </div>
    </div>
  );
}
