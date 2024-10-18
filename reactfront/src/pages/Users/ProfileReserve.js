import React, { useState, useEffect } from 'react';
import './ProfileReserve.css';
import SettingList from '../../components/SettingList';

export default function ProfileReserve() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('예약 내역을 불러오는 데 실패했습니다.');
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">에러 발생: {error}</div>;
  }

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="reserve-info">
        <h2>내 예약 관리</h2>
        <h3 style={{ marginTop: '1em' }}>예약 정보</h3>
        <div className="reserve-info-container">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div key={reservation.reservation_id} className="reserve-card">
                <div className="reserve-card-header">
                  <h4>{reservation.rooms?.lodgings?.name || '숙소 정보 없음'}</h4>
                  <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                    {reservation.status}
                  </span>
                </div>
                <div className="reserve-card-body">
                  <p><strong>체크인:</strong> {new Date(reservation.check_in_date).toLocaleDateString()}</p>
                  <p><strong>체크아웃:</strong> {new Date(reservation.check_out_date).toLocaleDateString()}</p>
                  <p><strong>객실:</strong> {reservation.rooms?.room_name || '객실 정보 없음'}</p>
                  <p><strong>인원:</strong> {reservation.person_num}명</p>
                  <p><strong>총 가격:</strong> {new Intl.NumberFormat().format(reservation.total_price)} 원</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reservations">예약 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
