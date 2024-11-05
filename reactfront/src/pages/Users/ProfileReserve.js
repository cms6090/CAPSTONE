import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileReserve.css';
import SettingList from '../../components/SettingList';
import { Button2, Button5, Button6 } from '../../components/Button.style';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProfileReserve() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 예약 데이터 가져오기
  const fetchReservations = useCallback(async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('예약 내역을 불러오는 데 실패했습니다.');

      const data = await response.json();
      const reservationsData = Array.isArray(data) ? data : [];

      const updatedReservations = await Promise.all(
        reservationsData.map(async (reservation) => ({
          ...reservation,
          isReviewed: await checkDuplicateReview(reservation.reservation_id),
        })),
      );
      setReservations(updatedReservations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 리뷰 중복 확인 함수
  const checkDuplicateReview = useCallback(async (reservationId) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      return false;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/check/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('리뷰 중복 여부를 확인하는 데 실패했습니다.');

      const data = await response.json();
      return data.exists;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const today = new Date();

  const { pastReservations, currentReservations } = useMemo(() => {
    return reservations.reduce(
      (acc, reservation) => {
        const checkOutDate = new Date(reservation.check_out_date);
        if (checkOutDate < today) acc.pastReservations.push(reservation);
        else acc.currentReservations.push(reservation);
        return acc;
      },
      { pastReservations: [], currentReservations: [] },
    );
  }, [reservations]);

  const handleCardClick = (reservation) => {
    const { rooms, check_in_date, check_out_date, person_num } = reservation;
    const lodgingId = rooms?.lodgings?.lodging_id;
    if (!lodgingId) return;

    // 날짜 형식을 'YYYY-MM-DD'로 변환
    const checkIn = new Date(check_in_date).toISOString().split('T')[0];
    const checkOut = new Date(check_out_date).toISOString().split('T')[0];

    navigate(
      `/accommodations/${encodeURIComponent(lodgingId)}?checkIn=${checkIn}&checkOut=${checkOut}&personal=${person_num}`,
    );
  };

  const cancelReservation = useCallback(async (reservationId) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('예약 취소에 실패했습니다.');

      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.reservation_id !== reservationId),
      );
      alert('예약이 취소되었습니다.');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const ReservationCard = ({ reservation, isPast }) => (
    <div
      key={reservation.reservation_id}
      className={`reserve-card ${isPast ? 'past' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={() => handleCardClick(reservation)}
    >
      <div className="reserve-card-body">
        <div className="reserve-card-image">
          <img
            src={reservation.rooms?.lodgings?.main_image || 'https://via.placeholder.com/150'}
            alt="객실 이미지"
          />
        </div>
        <div className="reserve-card-contents">
          <div className="reserve-card-contents-header">
            <div>
              <div style={{ fontSize: '1.2em' }}>
                {reservation.rooms?.lodgings?.name || '숙소 정보 없음'}
              </div>
              <div style={{ color: 'rgba(0,0,0,0.5)', marginBottom: '1em' }}>
                {reservation.rooms?.lodgings?.address || '주소 정보 없음'}
              </div>
            </div>
            <div className="reserve-card-action">
              {isPast ? (
                !reservation.isReviewed ? (
                  <Button6
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/review', { state: { reservation } });
                    }}
                  >
                    리뷰 작성
                  </Button6>
                ) : (
                  <Button6
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/review', { state: { reservation, isPast } });
                    }}
                  >
                    리뷰 수정
                  </Button6>
                )
              ) : (
                <Button5
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelReservation(reservation.reservation_id);
                  }}
                >
                  예약 취소
                </Button5>
              )}
            </div>
          </div>
          <div className="reserve-card-contents-container">
            <div className="reserve-card-contents-user">
              <div>사용자 정보</div>
              <div className="reserve-card-contents-user-details">
                <div className="reserve-card-contents-user-header">
                  <p>이름</p>
                  <p>전화번호</p>
                </div>
                <div className="reserve-card-contents-user-contents">
                  <p>{reservation.username}</p>
                  <p>{reservation.phonenumber}</p>
                </div>
              </div>
            </div>
            <div className="reserve-card-contents-lodging">
              <div className="reserve-card-contents-room">객실 정보</div>
              <div className="reserve-card-contents-details">
                <div className="reserve-card-contents-details-header">
                  <p>일정</p>
                  <p>객실</p>
                  <p>인원</p>
                  <p>총 가격</p>
                </div>
                <div className="reserve-card-contents-details-details">
                  <p>
                    {new Date(reservation.check_in_date).toLocaleDateString()} 14:00 ~
                    {new Date(reservation.check_out_date).toLocaleDateString()} 10:00
                  </p>
                  <p>{reservation.rooms?.room_name || '객실 정보 없음'}</p>
                  <p>{reservation.person_num}명</p>
                  <p>{new Intl.NumberFormat().format(reservation.total_price)} 원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="reserve-info">
        <h2>예약 내역</h2>
        <div className="reserve-info-container">
          <div className="reserve-info-title">현재 예약</div>
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <ReservationCard key={reservation.reservation_id} reservation={reservation} />
            ))
          ) : (
            <div className="no-reservations">
              <div>현재 예약이 없습니다.</div>
              <div onClick={() => navigate('/')} style={{ width: '8em', marginTop: '1em' }}>
                <Button2>숙소 예약하기</Button2>
              </div>
            </div>
          )}

          <div className="reserve-info-title" style={{ marginTop: '1.2em' }}>
            지난 예약
          </div>
          {pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationCard key={reservation.reservation_id} reservation={reservation} isPast />
            ))
          ) : (
            <div style={{ fontSize: '1em', color: 'rgba(0,0,0,0.7)', textAlign: 'center' }}>
              지난 예약 내역이 없습니다.
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
