import '../../node_modules/swiper/swiper.css';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './TagCard.css';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './SearchContext';
import { Button3 } from './Button.style';

import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';

export default function TagCard() {
  const { startDate, endDate, numPeople } = useContext(SearchContext);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedTag, setSelectedTag] = useState('가성비'); // 초기 태그 설정
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  // selectedTag가 변경될 때마다 해당 태그로 숙소 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/accommodations/tag?tag=${selectedTag}`,
        );
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
  }, [selectedTag]); // selectedTag가 변경될 때마다 데이터 다시 가져오기

  // 태그 목록 정의
  const tags = ['가성비', '직원 만족', '청결도', '가족 여행', '연인', '위치', '풍경'];

  // 숙소 상세 페이지로 이동하는 함수
  const goToAccommo = (accommoId) => {
    const checkIn = startDate ? startDate.toISOString().split('T')[0] : '';
    const checkOut = endDate ? endDate.toISOString().split('T')[0] : '';
    const personal = numPeople || 1;

    navigate(
      `/accommodations/${encodeURIComponent(accommoId)}?checkIn=${checkIn}&checkOut=${checkOut}&personal=${personal}`,
    );
  };

  const handleSlideChange = (direction) => {
    const newIndex = swiperRef.current.activeIndex + direction * 3;
    const clampedIndex = Math.max(0, Math.min(accommodations.length - 1, newIndex));
    swiperRef.current?.slideTo(clampedIndex);
  };

  return (
    <div className="swiper-card-wrapper">
      {/* 태그 선택 버튼 그룹 */}
      <div className="tag-button-groups">
        {tags.map((tag) => (
          <Button3
            key={tag}
            onClick={() => setSelectedTag(tag)} // 선택된 태그 업데이트
            style={{
              backgroundColor: selectedTag === tag ? 'black' : 'transparent',
              color: selectedTag === tag ? 'white' : 'black',
            }}
          >
            {tag}
          </Button3>
        ))}
      </div>

      {/* 숙소 카드 슬라이드 컨테이너 */}
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
          {/* 선택된 태그에 따른 숙소 표시 */}
          {accommodations.slice(0, 10).map((data) => (
            <SwiperSlide key={data.lodging_id}>
              <div className="accommo-card-wrap" onClick={() => goToAccommo(data.lodging_id)}>
                <img
                  src={data.main_image || 'https://via.placeholder.com/300'}
                  alt={data.name}
                  className="accommo-image"
                />
                <div className="accommo-info">
                  <div className="accommo-part">{data.part}</div>
                  <div className="accommo-title">{data.name}</div>
                  <div className="accommo-addr">
                    {data.area} {data.sigungu}
                  </div>
                  <div className="accommo-price">
                    {data.min_price_per_night ? (
                      <>
                        {parseInt(data.min_price_per_night).toLocaleString()}
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

      {/* 슬라이드 내비게이션 버튼 */}
      <img
        src={arrowLeft}
        alt="Previous"
        className="accomo-prev-btn"
        onClick={() => handleSlideChange(-1)}
      />
      <img
        src={arrowRight}
        alt="Next"
        className="accomo-next-btn"
        onClick={() => handleSlideChange(1)}
      />
    </div>
  );
}
