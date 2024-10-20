import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './ProfileReserve.css';
import SettingList from '../../components/SettingList';
import { Button2, Button5, Button6 } from '../../components/Button.style';
import './ProfileReserve.css';

export default function ProfileReserve() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 네트워크 또는 인증 오류만 error로 처리
  const navigate = useNavigate(); // useNavigate hook 사용

  // 예약 데이터 가져오기
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

      setReservations(data || []); // 예약이 없을 경우 빈 배열로 처리
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 예약 취소 함수
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
        alert(`예약 취소에 실패했습니다.`);
      }

      // 예약 취소 성공 시 예약 목록에서 해당 예약 제거
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.reservation_id !== reservationId),
      );

      alert(`예약이 취소되었습니다.`);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const today = new Date(); // 오늘 날짜를 가져옴

  // 지난 예약과 현재 예약으로 구분
  const pastReservations = reservations.filter(
    (reservation) => new Date(reservation.check_out_date) < today,
  );
  const currentReservations = reservations.filter(
    (reservation) => new Date(reservation.check_out_date) >= today,
  );

  const handleCardClick = (lodgingId) => {
    // 해당 숙소 페이지로 이동
    navigate(`/accommodations/${lodgingId}`);
  };

  // 로딩 중일 때
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
          <div className="reserve-info-title">현재 예약</div>
          {/* 현재 예약 */}
          {currentReservations.length > 0 ? (
            <>
              {currentReservations.map((reservation) => (
                <div
                  key={reservation.reservation_id}
                  className="reserve-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="reserve-card-body">
                    <div
                      className="reserve-card-image"
                      onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)} // 클릭 시 숙소로 이동
                    >
                      <img src={reservation.rooms?.lodgings?.main_image} alt="객실 이미지" />
                    </div>
                    <div
                      className="reserve-card-contents"
                      onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)} // 클릭 시 숙소로 이동
                    >
                      <div style={{ fontSize: '1.2em' }}>
                        {reservation.rooms?.lodgings?.name || '숙소 정보 없음'}
                      </div>
                      <div style={{ color: 'rgba(0,0,0,0.5', marginBottom: '1em' }}>
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
                                {new Date(reservation.check_in_date).toLocaleDateString()} 14:00 ~
                                {new Date(reservation.check_out_date).toLocaleDateString()} 10:00
                              </p>
                              <p> {reservation.rooms?.room_name || '객실 정보 없음'}</p>
                              <p>{reservation.person_num}명</p>
                              <p> {new Intl.NumberFormat().format(reservation.total_price)} 원</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="reserve-card-cancel">
                      <Button5 onClick={() => cancelReservation(reservation.reservation_id)}>
                        예약 취소
                      </Button5>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="no-reservations">
              <div>현재 예약이 없습니다.</div>
              <div onClick={() => navigate('/')} style={{ width: '8em', marginTop: '1em' }}>
                <Button2>숙소 예약하기</Button2>
              </div>
            </div>
          )}

          {/* 지난 예약 */}
          {pastReservations.length > 0 ? (
            <>
              <div className="reserve-info-title" style={{ marginTop: '1.2em' }}>
                지난 예약
              </div>
              {pastReservations.map((reservation) => (
                <div
                key={reservation.reservation_id}
                className="reserve-card past"
                style={{ cursor: 'pointer' }}
              >
                <div className="reserve-card-body">
                  <div
                    className="reserve-card-image"
                    onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)} // 클릭 시 숙소로 이동
                  >
                    <img src={reservation.rooms?.lodgings?.main_image} alt="객실 이미지" />
                  </div>
                  <div
                    className="reserve-card-contents"
                    onClick={() => handleCardClick(reservation.rooms?.lodgings?.lodging_id)} // 클릭 시 숙소로 이동
                  >
                    <div style={{ fontSize: '1.2em' }}>
                      {reservation.rooms?.lodgings?.name || '숙소 정보 없음'}
                    </div>
                    <div style={{ color: 'rgba(0,0,0,0.5', marginBottom: '1em' }}>
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
                              {new Date(reservation.check_in_date).toLocaleDateString()} 14:00 ~
                              {new Date(reservation.check_out_date).toLocaleDateString()} 10:00
                            </p>
                            <p> {reservation.rooms?.room_name || '객실 정보 없음'}</p>
                            <p>{reservation.person_num}명</p>
                            <p> {new Intl.NumberFormat().format(reservation.total_price)} 원</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="reserve-card-review">
                    <Button6>
                      리뷰 작성
                    </Button6>
                  </div>
                </div>
              </div>
              ))}
            </>
          ) : (
            <div className="no-reservations">지난 예약이 없습니다.</div>
          )}

          {/* 예약이 없을 때 */}
          {currentReservations.length === 0 && pastReservations.length === 0 && !error && (
            <div className="no-reservations">
              <div style={{ fontSize: '1.1em' }}>예약 내역이 없습니다.</div>
              <div style={{ width: '20%' }}>
                <Button2 onClick={() => navigate('/')}>숙소 찾아보기</Button2>
              </div>
            </div>
          )}

          {/* 에러가 있을 경우 */}
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
