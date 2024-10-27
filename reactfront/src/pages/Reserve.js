import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Reserve.css';
import { Button1, Button2 } from '../components/Button.style';
import DateRangePickerComponent from '../components/DateRangePickerComponent'; // 날짜 선택 컴포넌트 import
import NumPicker from '../components/NumPicker'; // 인원 선택 컴포넌트 import

export default function Reserve() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accommodation, room } = location.state || {}; // 추가된 room 정보 및 main_image 정보
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [checkInDate, setCheckInDate] = useState(''); // 체크인 날짜 상태 추가
  const [checkOutDate, setCheckOutDate] = useState(''); // 체크아웃 날짜 상태 추가
  const [numPeople, setNumPeople] = useState(1); // 인원 수 상태 추가
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 상태 추가

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

  // 쿼리 파라미터에서 체크인, 체크아웃 및 인원 수 정보 가져오기
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');
    const personal = queryParams.get('personal');

    //console.log(checkIn, checkOut);
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
    if (personal) setNumPeople(Number(personal));
  }, [location.search]);

  // 날짜 선택 핸들러
  const handleDateSelect = (startDate, endDate) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);

    // 숙박일수 계산
    if (startDate && endDate) {
      const checkIn = new Date(startDate);
      const checkOut = new Date(endDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)); // 숙박일수 계산

      if (room && room.price_per_night) {
        const calculatedTotalPrice = nights * room.price_per_night;
        setTotalPrice(calculatedTotalPrice); // 총 가격 상태 업데이트
      }
    }
  };

  // 예약 버튼 클릭 핸들러
  const handleReserveClick = async () => {
    if (userInfo && room && checkInDate && checkOutDate) {
      const reservationData = {
        userId: userInfo.user_id, // 사용자 ID
        roomId: room.room_id, // 객실 ID
        userName: userName, // 입력된 사용자 이름
        phoneNumber: phoneNumber, // 입력된 휴대폰 번호
        checkInDate: checkInDate, // 체크인 날짜
        checkOutDate: checkOutDate, // 체크아웃 날짜
        roomPrice: room.price_per_night, // 객실 가격
        personNum: numPeople, // 선택된 인원 수
      };

      console.log('보내는 예약 데이터:', room, numPeople); // 데이터가 제대로 있는지 확인

      try {
        const response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
          console.log(response);
          throw new Error('예약에 실패했습니다.');
        }

        const data = await response.json();
        console.log('예약 성공:', data);
        alert('예약이 완료되었습니다!');
        navigate('/');
      } catch (error) {
        console.error('예약 실패:', error);
        alert('예약 중 오류가 발생했습니다.');
      }
    } else {
      console.log('예약 정보를 확인할 수 없습니다.');
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
                        onDateSelect={handleDateSelect}
                        initialStartDate={checkInDate ? new Date(checkInDate) : null}
                        initialEndDate={checkOutDate ? new Date(checkOutDate) : null}
                      />
                    </div>


                    {/* 인원 선택 컴포넌트 */}
                    <div className="reserve-user-detail">
                      <div className="reserve-title">인원</div>
                      <NumPicker onNumSelect={setNumPeople} />
                    </div>
                  </>
                ) : (
                  <div>사용자 정보를 불러올 수 없습니다.</div>
                )}
              </div>
              <div className="reserve-left-end">
                <Button2 style={{ padding: '3%' }} onClick={handleReserveClick}>
                  예약하기
                </Button2>
              </div>
            </div>
          </div>

          {/* 오른쪽 숙소 정보 */}
          <div className="reserve-right">
            <div className="reserve-right-container">
              <div className="reserve-right-title">
                {accommodation.name && <div>{accommodation.name}</div>}
              </div>
              <div className="reserve-right-contents">
                <img
                  src={room?.room_photos?.[0] || accommodation.main_image || defaultImage}
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
                      {checkInDate && checkOutDate ? (
                        <>
                          {new Date(checkInDate).toLocaleDateString()} -{' '}
                          {new Date(checkOutDate).toLocaleDateString()}
                        </>
                      ) : (
                        '날짜를 선택해주세요.'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="reserve-right-container">
              <div className="reserve-right-title">결제 정보</div>
              {room && (
                <div className="reserve-right-contents">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>객실 가격</div>
                    <div>{new Intl.NumberFormat().format(room.price_per_night)} 원</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>총 가격</div>
                    <div>{new Intl.NumberFormat().format(totalPrice)} 원</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
