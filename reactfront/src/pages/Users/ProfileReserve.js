import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileReserve.css';
import SettingList from '../../components/SettingList';
import { Button2, Button5, Button6 } from '../../components/Button.style';

export default function ProfileReserve() {
  const [reservations, setReservations] = useState([]); // Empty array if no reservations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('예약 내역을 불러오는 데 실패했습니다.');
      }

      let reservationsData = await response.json();

      // reservationsData가 배열이 아닐 경우 빈 배열로 처리
      if (!Array.isArray(reservationsData)) {
        reservationsData = [];
      }

      // 리뷰 중복 여부 확인 후 예약 데이터 설정
      const updatedReservations = await Promise.all(
        reservationsData.map(async (reservation) => {
          const isReviewed = await checkDuplicateReview(reservation.reservation_id);
          return { ...reservation, isReviewed };
        }),
      );

      setReservations(updatedReservations || []); // 빈 배열일 경우 기본값으로 빈 배열 설정
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 리뷰 중복 확인 함수
  const checkDuplicateReview = async (reservationId) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      return false;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/check/${reservationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('리뷰 중복 여부를 확인하는 데 실패했습니다.');
      }

      const data = await response.json();
      return data.exists;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const today = new Date();
  const [pastReservations, currentReservations] = reservations.reduce(
    ([past, current], reservation) => {
      const checkOutDate = new Date(reservation.check_out_date);
      if (checkOutDate < today) {
        past.push(reservation);
      } else {
        current.push(reservation);
      }
      return [past, current];
    },
    [[], []],
  );

  const handleCardClick = (lodgingId) => {
    navigate(`/accommodations/${lodgingId}`);
  };

  const cancelReservation = async (reservationId) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('예약 취소에 실패했습니다.');
      }

      // 예약 취소 성공 시 예약 목록에서 해당 예약 제거
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.reservation_id !== reservationId),
      );
      alert('예약이 취소되었습니다.');
    } catch (err) {
      setError(err.message);
    }
  };

  const ReservationCard = ({ reservation, isPast }) => {
    const { isReviewed } = reservation;

    return (
      <div
        key={reservation.reservation_id}
        className={`reserve-card ${isPast ? 'past' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <div className="reserve-card-body">
          <div
            className="reserve-card-image"
            onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)}
          >
            <img src={reservation.rooms?.lodgings?.main_image} alt="객실 이미지" />
          </div>
          <div
            className="reserve-card-contents"
            onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)}
          >
            <div style={{ fontSize: '1.2em' }}>
              {reservation.rooms?.lodgings?.name || '숙소 정보 없음'}
            </div>
            <div style={{ color: 'rgba(0,0,0,0.5)', marginBottom: '1em' }}>
              {reservation.rooms?.lodgings?.address}
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
                      {new Date(reservation.check_in_date).toLocaleDateString()} 14:00 ~{' '}
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
          <div className="reserve-card-action">
            {isPast ? (
              !isReviewed ? (
                <Button6 onClick={() => navigate('/review', { state: { reservation } })}>
                  리뷰 작성
                </Button6>
              ) : (
                <Button6 onClick={() => navigate('/review', { state: { reservation, isPast } })}>
                  리뷰 수정
                </Button6>
              )
            ) : (
              <Button5 onClick={() => cancelReservation(reservation.reservation_id)}>
                예약 취소
              </Button5>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="profilemain">
      <div className="profile-setting-container">
        <SettingList />
      </div>
      <div className="reserve-info">
        <h2>예약 내역</h2>
        <div className="reserve-info-container">
          {/* 현재 예약 */}
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

          {/* 지난 예약 */}
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


          {/* 오류 메시지 처리 */}
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
