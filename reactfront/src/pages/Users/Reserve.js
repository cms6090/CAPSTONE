import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Reserve.css';
import { Button1, Button2 } from '../../components/Button.style';
import DateRangePickerComponent from '../../components/DateRangePickerComponent';

export default function Reserve() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accommodation, room } = location.state || {};
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(1);

  // 쿼리 파라미터에서 체크인, 체크아웃 및 인원 수 정보 가져오기
  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get('checkIn');
  const checkOut = queryParams.get('checkOut');
  const numPeople = queryParams.get('personal') || 1; // 기본값 1로 설정

  // 유저 정보 가져오는 useEffect
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch('http://localhost:3000/api/users/inquiry', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        setUserInfo(data);
        setUserName(data.user_name);
        setPhoneNumber(data.phone_number);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 숙박일수와 총 가격 계산
  useEffect(() => {
    if (checkIn && checkOut && room) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      setNights(Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
      setTotalPrice(nights * parseInt(room.price_per_night));
    }
  }, [checkIn, checkOut, room]);

  // 예약 버튼 클릭 핸들러
  const handleReserveClick = async () => {
    if (userInfo && room && checkIn && checkOut) {
      const reservationData = {
        userId: userInfo.user_id,
        roomId: room.room_id,
        userName: userName,
        phoneNumber: phoneNumber,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomPrice: room.price_per_night,
        personNum: numPeople,
      };

      try {
        const response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
          throw new Error('예약에 실패했습니다.');
        }

        const data = await response.json();
        alert('예약이 완료되었습니다!');
        navigate('/');
      } catch (error) {
        console.error('예약 실패:', error);
        alert('예약 중 오류가 발생했습니다.');
      }
    } else {
      alert('예약 정보를 입력해주세요.');
    }
  };

  // 로딩 중일 때
  if (loading) {
    return <h2>로딩 중...</h2>;
  }

  // 에러가 있을 때
  if (error) {
    return <h2>{error}</h2>;
  }

  // 기본 이미지 설정
  const defaultImage = 'https://via.placeholder.com/300';

  return (
    <div className="Reserve">
      <div style={{ padding: '10px' }}>
        <h4>예약 확인 및 결제</h4>
        <div className="reserve-container">
          {/* 왼쪽 예약 정보 */}
          <div className="reserve-left">
            <div className="reserve-left-header">예약자 정보</div>
            <div className="reserve-left-container">
              <div className="reserve-left-contents">
                {userInfo ? (
                  <>
                    <div className="reserve-user-detail">
                      <div className="reserve-title">예약자 이름</div>
                      <div className="reserve-details-container">
                        {isEditingName ? (
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="reserve-user-contents"
                          />
                        ) : (
                          <div className="reserve-user-contents">{userName}</div>
                        )}
                        <Button1 onClick={() => setIsEditingName(!isEditingName)}>
                          {isEditingName ? '저장' : '수정'}
                        </Button1>
                      </div>
                    </div>

                    <div className="reserve-user-detail">
                      <div className="reserve-title">이메일</div>
                      <div className="reserve-user-contents">{userInfo.email}</div>
                    </div>

                    <div className="reserve-user-detail">
                      <div className="reserve-title">휴대폰 번호</div>
                      <div className="reserve-details-container">
                        {isEditingPhone ? (
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="reserve-user-contents"
                          />
                        ) : (
                          <div className="reserve-user-contents">{phoneNumber}</div>
                        )}
                        <Button1 onClick={() => setIsEditingPhone(!isEditingPhone)}>
                          {isEditingPhone ? '저장' : '수정'}
                        </Button1>
                      </div>
                    </div>

                    {/* 날짜 선택 컴포넌트 */}
                    <div className="reserve-user-detail">
                      <div className="reserve-title">숙박 날짜</div>
                      <DateRangePickerComponent
                        initialStartDate={checkIn}
                        initialEndDate={checkOut}
                        disabled={true} // 날짜 선택 비활성화
                      />
                    </div>
                  </>
                ) : (
                  <div>사용자 정보를 불러올 수 없습니다.</div>
                )}
              </div>
            </div>
          </div>
          <div className="reserve-right">
            <div className="reserve-right-container">
              <div className="reserve-right-title">
                {accommodation?.name && <div>{accommodation.name}</div>}
              </div>
              <div className="reserve-right-contents">
                <img
                  src={room?.room_photos?.[0] || accommodation?.main_image || defaultImage}
                  alt="객실 이미지"
                  style={{
                    width: '100%',
                    borderRadius: '15px',
                    aspectRatio: '2.5/1',
                    objectFit: 'cover',
                  }}
                />
                <div className="reserve-right-contents-detail">
                  <div className="reserve-right-contents-detail-title">
                    <div style={{ color: 'rgba(0,0,0,0.4)', fontWeight: '600', fontSize: '1.1em' }}>
                      객실
                    </div>
                    {room && <div>{room.room_name}</div>}
                  </div>
                  <div className="reserve-right-contents-detail-title">
                    <div style={{ color: 'rgba(0,0,0,0.4)', fontWeight: '600', fontSize: '1.1em' }}>
                      일정
                    </div>
                    <div>
                      <>
                        {new Date(checkIn).toLocaleDateString()} -{' '}
                        {new Date(checkOut).toLocaleDateString()}
                      </>
                    </div>
                  </div>
                  <div className="reserve-right-contents-detail-title">
                    <div style={{ color: 'rgba(0,0,0,0.4)', fontWeight: '600', fontSize: '1.1em' }}>
                      인원
                    </div>
                    {room && <div>{numPeople}명</div>}
                  </div>
                </div>
              </div>
            </div>
            {/* 결제 정보 */}
            <div className="reserve-right-container">
              <div className="reserve-right-title">결제 정보</div>
              {room && (
                <div className="reserve-right-contents" style={{ lineHeight: '2em' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>객실 가격</div>
                    <div>{new Intl.NumberFormat().format(room.price_per_night)} 원</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>총 가격({nights}박)</div>
                    <div>{new Intl.NumberFormat().format(totalPrice)} 원</div>
                  </div>
                </div>
              )}
            </div>
            <div className="reserve-right-container" style={{ padding: '0' }}>
              <Button2 onClick={handleReserveClick}>예약하기</Button2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
