import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminReserves.css';
import AdminSettingList from '../../components/AdminSettingList';
import Table from '../../components/Table';

export default function AdminReserves() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userPermission = sessionStorage.getItem('userPermission');
    if (userPermission !== '관리자') {
      alert('해당 권한이 없습니다.');
      navigate('/');
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return null; // 권한 확인 중에는 아무것도 렌더링하지 않음
  }

  if (!isAuthorized) {
    return null; // 권한이 없을 때도 아무것도 렌더링하지 않음
  }

  return (
    <div className="admin">
      <div className="admin-setting-container">
        <AdminSettingList />
      </div>
      <div className="admin-users">
        <Table />
      </div>
    </div>
  );
}
