import '../../node_modules/swiper/swiper.css';
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './AccommoCard.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import
import { Button3 } from './Button.style'; // Button3 컴포넌트 import

// 이미지 import
import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';

export default function AccommoCard() {
  const [accommodations, setAccommodations] = useState([]); // 숙박 데이터 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 기본값은 '전체'
  const swiperRef = useRef(null); // Swiper 인스턴스를 저장할 ref
  const navigate = useNavigate(); // useNavigate 훅 사용

  // API를 통해 숙소 데이터를 가져오는 함수
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/accommodations/`);
        if (!response.ok) {
          throw new Error('숙소 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };

    fetchAccommodations();
  }, []);

  const categories = {
    전체: accommodations,
    '호텔·리조트': accommodations.filter(
      (data) => data.part === '관광호텔' || data.part === '서비스드레지던스' || data.part === '관광단지',
    ),
    '모텔·유스호스텔': accommodations.filter(
      (data) => data.part === '모텔' || data.part === '유스호스텔',
    ),
    '게스트하우스': accommodations.filter(
      (data) => data.part === '게스트하우스' || data.part === '민박' || data.part === '홈스테이',
    ),
    '캠핑·펜션': accommodations.filter((data) => data.part === '야영장' || data.part === '펜션'),
    '전통 숙소': accommodations.filter((data) => data.part === '한옥'),
  };

  const goToAccommo = (accommoId) => {
    navigate(`/accommodations/${encodeURIComponent(accommoId)}`); // 숙소 ID를 쿼리 파라미터로 전달
  };

  // 슬라이드 이동 처리
  const handleSlideChange = (direction) => {
    const newIndex = swiperRef.current.activeIndex + direction * 3;
    const clampedIndex = Math.max(0, Math.min(categories[selectedCategory].length - 1, newIndex)); // 인덱스 범위 제한
    swiperRef.current?.slideTo(clampedIndex); // 안전하게 슬라이드로 이동
  };

  return (
    <div className="swiper-card-wrapper">
      <div className="button-group">
        {Object.keys(categories).map((category) => (
          <Button3
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              backgroundColor: selectedCategory === category ? 'black' : 'transparent', // 선택된 버튼 배경색
              color: selectedCategory === category ? 'white' : 'black', // 선택된 버튼 글자색
            }}
          >
            {category}
          </Button3>
        ))}
      </div>

      <div className="accomo-card-container">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          breakpoints={{
            400: { slidesPerView: 2 },
            600: { slidesPerView: 3 },
            800: { slidesPerView: 4 },
            1000: { slidesPerView: 4 },
            1200: { slidesPerView: 4 },
            1600: { slidesPerView: 4 },
            1920: { slidesPerView: 4 },
          }}
        >
          {categories[selectedCategory].slice(0, 10).map((data) => (
            <SwiperSlide key={data.lodging_id}>
              <div className="accommo-card-wrap" onClick={() => goToAccommo(data.lodging_id)}>
                <img
                  src={data.main_image || 'https://via.placeholder.com/300'} // 기본 이미지 URL
                  alt={data.name}
                  className="accommo-image"
                />
                <div className="accommo-info">
                  <div className="accommo-part">{data.part}</div>
                  <div className='accommo-title'>{data.name}</div>
                  <div className="accommo-addr">{data.address}</div>
                  <div className='accommo-price'>
                    {data.minfee ? (
                      <>
                        {parseInt(data.minfee).toLocaleString()}
                        <span
                          style={{
                            fontSize: '0.8em',
                            fontFamily: 'pretendard-light',
                            marginLeft: '0.3em',
                            color: 'gray',
                          }}
                        >
                          원 ~
                        </span>
                      </>
                    ) : (
                      '정보 없음'
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <img
        src={arrowLeft}
        alt="Previous"
        className="accomo-prev-btn"
        onClick={() => handleSlideChange(-1)} // 이전 슬라이드
      />
      <img
        src={arrowRight}
        alt="Next"
        className="accomo-next-btn"
        onClick={() => handleSlideChange(1)} // 다음 슬라이드
      />
    </div>
  );
}