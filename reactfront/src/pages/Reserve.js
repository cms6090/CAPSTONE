import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Reserve.css';
import { Button1, Button2 } from '../components/Button.style';

export default function Reserve() {
  const location = useLocation();
  const { accommodation, room } = location.state || {}; // 추가된 room 정보 및 main_image 정보
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        const response = await fetch('http://localhost:3000/api/users/me', {
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

  if (loading) {
    return <h2>로딩 중...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const handleReserveClick = () => {
    if (userInfo && room) {
      console.log('사용자 ID:', userInfo.id);
      console.log('객실 ID:', room.id);
    } else {
      console.log('예약 정보를 확인할 수 없습니다.');
    }
  };

  console.log(accommodation);
  console.log(room);
  const defaultImage = 'https://via.placeholder.com/300';

  return (
    <div className="Reserve">
      <div style={{ padding: '10px' }}>
        <h4>예약 확인 및 결제</h4>
        <div className="reserve-container">
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
                    <div className="reserve-user-detail">
                      <div className="reserve-title">숙박 날짜</div>
                      <input type="date" className="reserve-user-contents" />
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
          <div className="reserve-right">
            <div className="reserve-right-container">
              <div className="reserve-right-title">{accommodation.name && <div>{accommodation.name}</div>}</div>
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
                  </div>
                </div>
              </div>
            </div>
            <div className="reserve-right-container">
              <div className="reserve-right-title">결제 정보</div>
              {room && (
                <div className="reserve-right-contents">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>객실 가격</div>
                    <div>{new Intl.NumberFormat().format(room.price_per_night)} 원</div>
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