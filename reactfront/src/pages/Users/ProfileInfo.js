import React, { useState, useEffect } from 'react';
import SettingList from '../../components/SettingList';
import './ProfileInfo.css';
import { Button1 } from '../../components/Button.style';
import dayjs from 'dayjs';
import DatePickerComponent from '../../components/DatePicker';

export default function ProfileInfo() {
  const [isEditable, setIsEditable] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/users/inquiry', {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
          });
          if (!response.ok) {
            throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
          }
          const data = await response.json();
          setEmail(data.email);
          setPhoneNumber(data.phone_number);
          setName(data.user_name);
          setGender(data.gender === '남성' ? '남성' : '여성');
          setBirthDate(dayjs(data.birth));
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
      fetchUserInfo();
    }
  }, []);

  const handleEditClick = async () => {
    if (isEditable) {
      try {
        const requestData = {
          user_name: name,
          phone_number: phoneNumber,
          gender: gender,
          birth: new Date(birthDate.format('YYYY-MM-DD')),
        };

        const response = await fetch('http://localhost:3000/api/users/modify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 수정하는 데 실패했습니다.');
        }

        alert('정보가 성공적으로 수정되었습니다.');
      } catch (error) {
        console.error('Error updating user info:', error);
        alert('정보 수정에 실패했습니다.');
      }
    }
    setIsEditable((prev) => !prev);
  };

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="info">
        <h2>내 정보 관리</h2>
        <h3 style={{ marginTop: '1em' }}>회원 정보</h3>
        <div className="info-container">
          <div className="info-section">
            <div className="info-item">
              <div className="info-title">닉네임</div>
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
              <div className="info-title">이메일</div>
              <input className="info-data" type="text" value={email} disabled />
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
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
            <div className="info-item">
              <div className="info-title">수정</div>
              <Button1 onClick={handleEditClick}>{isEditable ? '완료' : '변경하기'}</Button1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
