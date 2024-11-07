import React, { useState, useEffect } from 'react';
import SettingList from '../../components/SettingList';
import axios from 'axios';
import './ProfileSetting.css';
import { Button4 } from '../../components/Button.style.js';

export default function ProfileSetting() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // 컴포넌트 로드 시 이메일 로드
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setErrorMessage('사용자 이메일을 가져올 수 없습니다.');
    }
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '정말로 회원 탈퇴를 진행하시겠습니까? 모든 데이터가 삭제됩니다.',
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      const response = await axios.delete('http://localhost:3000/api/users/delete', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      });

      alert(response.data.message);
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="profile-details">
        <div style={{ marginBottom: '2em' }}>
          <h2>회원 탈퇴</h2>
          <div style={{ color: 'rgba(0,0,0,0.7)' }}>
            회원 탈퇴 시 모든 데이터가 삭제되며, 복구가 불가능합니다.
          </div>
          <div style={{ color: 'rgba(0,0,0,0.7)' }}>계속 진행하시겠습니까?</div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
          <Button4
            className="delete-account-button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? '탈퇴 진행 중...' : '회원 탈퇴'}
          </Button4>
        </div>
      </div>
    </div>
  );
}
