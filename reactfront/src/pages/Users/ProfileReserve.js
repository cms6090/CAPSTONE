import React, { useState, useEffect } from 'react';

import './ProfileReserve.css';
import SettingList from '../../components/SettingList';

export default function ProfileReserve() {
  const [reservations, setReservations] = useState([]); // 예약 내역 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 예약 내역을 가져오는 함수
  const fetchReservations = async () => {
    try {
      const token = sessionStorage.getItem('accessToken'); // 토큰 가져오기
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 전송
        },
      });

      if (!response.ok) {
        throw new Error('예약 내역을 불러오는 데 실패했습니다.');
      }

      const data = await response.json();
      setReservations(data); // 가져온 데이터를 상태로 저장
      setLoading(false); // 로딩 완료
    } catch (err) {
      setError(err.message); // 에러 발생 시 에러 메시지 저장
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 예약 내역을 가져옴
  useEffect(() => {
    fetchReservations();
  }, []);

  // 로딩 중일 때
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  // 에러가 있을 때
  if (error) {
    return <div className="error">에러 발생: {error}</div>;
  }

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="reserve-details">
        <h2>내 예약 관리</h2>
        <div className="reserve-section">
          <h3 className="reserve-section-title">예약 정보</h3>

          {/* 예약 내역이 있을 때 */}
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div key={reservation.reservation_id} className="reserve-card">
                <div className="reserve-card-header">
                  {/* 숙소 이름이 있는 경우에만 표시 */}
                  <h4>{reservation.rooms?.lodgings?.name || '숙소 정보 없음'}</h4>
                  <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                    {reservation.status}
                  </span>
                </div>
                <div className="reserve-card-body">
                  <p>
                    <strong>체크인:</strong> {new Date(reservation.check_in_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>체크아웃:</strong> {new Date(reservation.check_out_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>객실:</strong> {reservation.rooms?.room_name || '객실 정보 없음'}
                  </p>
                  <p>
                    <strong>인원:</strong> {reservation.person_num}명
                  </p>
                  <p>
                    <strong>총 가격:</strong> {new Intl.NumberFormat().format(reservation.total_price)} 원
                  </p>
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