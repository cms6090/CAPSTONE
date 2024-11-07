import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Accommodation.css';
import JustMap from '../../components/JustMap';
import MapModal from '../../components/MapModal';
import { Button2 } from '../../components/Button.style';
import RoomModal from '../../components/RoomModal';
import { BsFillImageFill } from 'react-icons/bs';
import ReviewList from '../../components/ReviewList';
import CircularProgress from '@mui/material/CircularProgress';

export default function Accommodation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isMorePhotosModalOpen, setMorePhotosModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const checkIn = queryParams.get('checkIn');
        const checkOut = queryParams.get('checkOut');

        const response = await fetch(
          `http://localhost:3000/api/accommodations/${id}?checkIn=${checkIn}&checkOut=${checkOut}`,
        );
        if (!response.ok) {
          throw new Error('숙소 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setAccommodation(data);
      } catch (error) {
        console.error('Error fetching accommodation details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/reviews/accommodation/${id}`);
        if (!response.ok) {
          throw new Error('리뷰를 가져오는 데 실패했습니다.');
        }
        const reviewData = await response.json();
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const loggedIn = sessionStorage.getItem('userEmail');
    setIsLoggedIn(!!loggedIn);

    fetchAccommodationDetails();
    fetchReviews();
  }, [id, location.search]);

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!accommodation) {
    return <h2>숙소를 찾을 수 없습니다.</h2>;
  }

  const defaultImage = 'https://via.placeholder.com/300';

  const toggleMapModal = () => {
    setMapModalOpen(!isMapModalOpen);
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setSelectedRoom(null);
  };

  const handleReserve = (room) => {
    if (loading) {
      alert('숙소 정보를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!accommodation) {
      alert('숙소 정보를 찾을 수 없습니다.');
      return;
    }

    if (!isLoggedIn) {
      alert('예약을 하려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }

    // 현재 URL에서 쿼리 파라미터 가져오기
    const queryParams = new URLSearchParams(location.search);
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');
    const personal = queryParams.get('personal');
    console.log(queryParams, checkIn, checkOut);

    // 쿼리 파라미터가 있는 경우 예약 페이지로 함께 전달
    navigate(
      `/reserve?accommodationId=${accommodation.lodging_id}&roomId=${room.room_id}&checkIn=${checkIn}&checkOut=${checkOut}&personal=${personal}`,
      {
        state: {
          accommodation: accommodation,
          room: room,
        },
      },
    );
  };

  const roomPhotos = accommodation.rooms.flatMap((room) => room.room_photos || []);
  const displayedPhotos = roomPhotos.slice(0, 4);

  return (
    <div className="hotel">
      <section className="hotel-image">
        <ul className="hotel-image-content">
          <li className="large-image">
            <div className="hotel-image-contents">
              <img src={accommodation.main_image || defaultImage} alt="숙소 이미지" />
            </div>
          </li>

          {displayedPhotos.map((photo, index) => (
            <li key={index} className="small-image">
              <div className="hotel-image-contents">
                <img src={photo || defaultImage} alt={`객실 이미지 ${index + 1}`} />
                {index === 3 && roomPhotos.length > 4 && (
                  <div className="more-photos-overlay" onClick={() => setMorePhotosModalOpen(true)}>
                    <BsFillImageFill style={{ marginRight: '3%' }} /> {roomPhotos.length - 4} +
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="hotel-title">
        <div className="hotel-title-container">
          <div className="hotel-title-content">
            <div style={{ fontSize: '0.9em', color: 'rgba(0,0,0,0.8)' }}>{accommodation.part}</div>
            <div className="hotel-title-detail">
              <div>{accommodation.name}</div>
              <div>
                {accommodation.rooms.length > 0 && (
                  <div>
                    {new Intl.NumberFormat().format(accommodation.rooms[0].price_per_night)}원 ~
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-info">
          <div className="hotel-info-map-container">
            <div className="hotel-info-map">
              <div className="hotel-info-map-detail">
                <h6>지도</h6>
                <div className="hotel-address">
                  <span className="material-symbols-outlined" style={{ marginRight: '4px' }}>
                    location_on
                  </span>
                  {accommodation.address}
                </div>
              </div>
              <div className="hotel-info-map-detail">
                <Button2 onClick={toggleMapModal}>지도보기</Button2>
              </div>
            </div>
            {isMapModalOpen && (
              <MapModal isOpen={isMapModalOpen} onClose={toggleMapModal}>
                <JustMap locations={accommodation.address} />
              </MapModal>
            )}
          </div>
        </div>
      </section>

      <section className="hotel-room">
        <div style={{ fontSize: '1.1em', marginBottom: '1%' }}>객실 정보</div>
        <div className="hotel-room-card">
          {accommodation.rooms.map((room) => (
            <div className="hotel-room-card-container" key={room.room_id}>
              <div className="hotel-room-card-containers">
                <div className="hotel-room-card-img">
                  <img
                    src={
                      room.room_photos && room.room_photos[0] ? room.room_photos[0] : defaultImage
                    }
                    alt="객실 이미지"
                  />
                </div>
                <div className="hotel-room-card-content-container">
                  <div className="hotel-room-card-header">
                    <div>{room.room_name}</div>
                    <div
                      className="hotel-room-card-detail-modal"
                      onClick={() => openRoomDetails(room)}
                    >
                      <div>상세정보</div>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 'inherit', marginLeft: '4px' }}
                      >
                        arrow_forward_ios
                      </span>
                    </div>
                  </div>
                  <div className="hotel-room-card-details">
                    <div className="hotel-room-card-time">
                      <div className="check-in-out">
                        <div className="check-label">체크인</div>
                        <div className="check-time">14:00</div>
                      </div>
                      <div className="check-in-out">
                        <div className="check-label">체크아웃</div>
                        <div className="check-time">10:00</div>
                      </div>
                    </div>
                    <div className="hotel-room-card-end">
                      <div className="occupancy-info">
                        기준 {room.min_occupancy}인 · 최대 {room.max_occupancy}인
                      </div>
                      <div className="available-info">
                        <div>잔여 객실 : {room.available_count}</div>
                        <div className="price-info">
                          {new Intl.NumberFormat().format(room.price_per_night)} 원
                        </div>
                      </div>
                    </div>
                    <div style={{ height: '100%' }}>
                      <button
                        onClick={room.available_count > 0 ? () => handleReserve(room) : null}
                        disabled={room.available_count === 0}
                        style={{
                          width: '100%',
                          backgroundColor: room.available_count == 0 ? 'grey' : '',
                          cursor: room.available_count == 0 ? 'not-allowed' : 'pointer',
                        }}
                        className="reserve-button"
                      >
                        {room.available_count == 0 ? '예약 불가' : '예약하기'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isRoomModalOpen && selectedRoom && (
        <RoomModal isOpen={isRoomModalOpen} onClose={closeRoomModal} room={selectedRoom} />
      )}

      {isMorePhotosModalOpen && (
        <MapModal isOpen={isMorePhotosModalOpen} onClose={() => setMorePhotosModalOpen(false)}>
          <div className="more-photos-modal">
            {roomPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo || defaultImage}
                alt={`전체 객실 이미지 ${index + 1}`}
                className="more-photos-image"
              />
            ))}
          </div>
        </MapModal>
      )}

      {/* 리뷰 리스트 컴포넌트 추가 */}
      <section className="hotel-reviews">
        <div>
          <div>
            <span className="star-icon">★</span> 리뷰 <span>{reviews.length}건</span>
          </div>
          <ReviewList reviews={reviews} />
        </div>
      </section>
    </div>
  );
}
