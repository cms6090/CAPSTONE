import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Accommodation.css';
import JustMap from '../components/JustMap';
import MapModal from '../components/MapModal';
import { Button2 } from '../components/Button.style';
import RoomModal from '../components/RoomModal';
import { BsFillImageFill } from 'react-icons/bs';

export default function Accommodation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isMorePhotosModalOpen, setMorePhotosModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/accommodations/${id}`);
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

    fetchAccommodationDetails();
  }, [id]);

  if (loading) {
    return <h2>로딩 중...</h2>;
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
    navigate('/reserve', {
      state: {
        contentid: accommodation.lodging_id,
        title: accommodation.name,
        roomcode: room.room_id,
      },
    });
  };

  const roomPhotos = accommodation.rooms.flatMap((room) => room.room_photos || []);
  const displayedPhotos = roomPhotos.slice(0, 4);

  return (
    <div className="hotel">
      <section className="hotel-image">
        <ul className="hotel-image-content">
          <ol className="large-image">
            <div className="hotel-image-contents">
              <img src={accommodation.main_image || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>

          {displayedPhotos.map((photo, index) => (
            <ol key={index} className="small-image">
              <div className="hotel-image-contents">
                <img src={photo || defaultImage} alt={`객실 이미지 ${index + 1}`} />
                {/* "더보기" 버튼 추가 */}
                {index === 3 && roomPhotos.length > 4 && (
                  <div className="more-photos-overlay" onClick={() => setMorePhotosModalOpen(true)}>
                    <BsFillImageFill style={{marginRight:'3%'}}/> {roomPhotos.length - 4} +
                  </div>
                )}
              </div>
            </ol>
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
            <div className="hotel-info-map" style={{ margin: '0', height: '50%' }}>
              <div className="hotel-info-map-detail">
                <h6>지도</h6>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8em',
                    color: 'rgba(0,0,0,0.8)',
                  }}
                >
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
              <div className="hotel-room-card-img">
                <img
                  src={room.room_photos && room.room_photos[0] ? room.room_photos[0] : defaultImage}
                  alt="객실 이미지"
                />
              </div>
              <div className="hotel-room-card-content-container">
                <div
                  style={{ fontSize: '1.1em', display: 'flex', justifyContent: 'space-between' }}
                >
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
                <div className="hotel-room-card-content">
                  <div className="hotel-room-card-details">
                    <div className="hotel-room-card-time">
                      <div style={{ borderRight: '1px solid lightgray' }}>
                        <div style={{ fontSize: '1em' }}>체크인</div>
                        <div style={{ fontFamily: 'pretendard-regular' }}>14:00</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1em' }}>체크아웃</div>
                        <div style={{ fontFamily: 'pretendard-regular' }}>10:00</div>
                      </div>
                    </div>
                    <div className="hotel-room-card-end">
                      <div style={{ fontFamily: 'pretendard-regular' }}>
                        기준 {room.min_occupancy}인 · 최대 {room.max_occupancy}인
                      </div>

                      <div
                        style={{
                          fontFamily: 'pretendard-regular',
                          fontSize: '1.2em',
                          fontWeight: 'bold',
                          color: '#333',
                        }}
                      >
                        {new Intl.NumberFormat().format(room.price_per_night)} 원
                      </div>
                    </div>
                    <Button2 onClick={() => handleReserve(room)} style={{ width: '100%' }}>
                      예약하기
                    </Button2>
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
    </div>
  );
}
