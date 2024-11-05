import '../../node_modules/swiper/swiper.css';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './SearchContext';
import { Button3 } from './Button.style';

import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';

export default function AgeCard() {
  const { startDate, endDate, numPeople } = useContext(SearchContext);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('20대'); // 초기 연령대 설정
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/accommodations/age-group?age_group=${selectedAgeGroup}&personal=${numPeople}`,
        );
        if (!response.ok) {
          throw new Error('숙소 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setAccommodations(data.slice(0, 12)); // 결과를 최대 12개로 제한
        console.log(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };

    fetchAccommodations();
  }, [selectedAgeGroup, numPeople]);

  // 연령대 목록 정의
  const ageGroups = ['20대', '30대', '40대', '50대', '60대 이상'];

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
      {/* 연령대 선택 버튼 그룹 */}
      <div className="tag-button-groups">
        {ageGroups.map((ageGroup) => (
          <Button3
            key={ageGroup}
            onClick={() => setSelectedAgeGroup(ageGroup)} // 선택된 연령대 업데이트
            style={{
              backgroundColor: selectedAgeGroup === ageGroup ? 'black' : 'transparent',
              color: selectedAgeGroup === ageGroup ? 'white' : 'black',
            }}
          >
            {ageGroup}
          </Button3>
        ))}
      </div>

      {/* 숙소 카드 슬라이드 컨테이너 */}
      {/* 숙소 데이터가 없는 경우 메시지 표시 */}
      {accommodations.length === 0 ? (
        <div style={{ color: 'red', fontSize: '1em', textAlign: 'center', marginTop: '20px' }}>
          해당 연령대의 데이터가 없습니다
        </div>
      ) : (
        <>
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
              {/* 선택된 연령대에 따른 숙소 표시 */}
              {accommodations.map((data) => (
                <SwiperSlide key={data.lodging_id}>
                  <div className="accommo-card-wrap" onClick={() => goToAccommo(data.lodging_id)}>
                    <img
                      src={data.lodging_main_image || 'https://via.placeholder.com/300'}
                      alt={data.lodging_name}
                      className="accommo-image"
                    />
                    <div className="accommo-info">
                      <div className="accommo-part">{data.lodging_part}</div>
                      <div className="accommo-title">{data.lodging_name}</div>
                      <div className="accommo-addr">
                        {data.lodging_area} {data.lodging_sigungu}
                      </div>
                      <div className="accommo-price">
                        {data.lodging_rating && data.lodging_rating !== '0' ? (
                          <div
                            style={{
                              display: 'inline-block',
                              backgroundColor: 'rgb(255,173,10)',
                              padding: '1px 4px',
                              borderRadius: '4px',
                              color: 'black',
                              fontSize: '0.7em',
                            }}
                          >
                            ★ {parseFloat(data.lodging_rating).toFixed(1)}
                          </div>
                        ) : (
                          <div></div>
                        )}
                        {data.min_price_per_night ? (
                          // 가격이 있을 경우 가격 표시, 없을 경우 '정보 없음' 표시
                          <div>
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
                          </div>
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
        </>
      )}
    </div>
  );
}
