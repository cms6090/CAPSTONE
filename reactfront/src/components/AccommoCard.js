import '../../node_modules/swiper/swiper.css';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './AccommoCard.css';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from './SearchContext';
import { Button3 } from './Button.style';

import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';

export default function AccommoCard() {
  const { startDate, endDate, numPeople } = useContext(SearchContext);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 숙소 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        // 숙소 데이터를 API에서 가져옴
        const response = await fetch('http://localhost:3000/api/accommodations/part');
        if (!response.ok) {
          throw new Error('숙소 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setAccommodations(data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching accommodations:', error); // 에러 발생 시 콘솔에 출력
      }
    };

    fetchAccommodations(); // 함수 호출
  }, []);

  // 숙소 데이터를 카테고리별로 필터링한 객체
  const categories = {
    전체: accommodations, // 전체 숙소 데이터
    '호텔·리조트': accommodations.filter((data) =>
      ['관광호텔', '서비스드레지던스', '관광단지'].includes(data.part),
    ),
    '모텔·유스호스텔': accommodations.filter((data) => ['모텔', '유스호스텔'].includes(data.part)),
    게스트하우스: accommodations.filter((data) =>
      ['게스트하우스', '민박', '홈스테이'].includes(data.part),
    ),
    '캠핑·펜션': accommodations.filter((data) => ['야영장', '펜션'].includes(data.part)),
    '전통 숙소': accommodations.filter((data) => data.part === '한옥'),
  };

  // 특정 숙소 상세 페이지로 이동하는 함수
  const goToAccommo = (accommoId) => {
    const checkIn = startDate ? startDate.toISOString().split('T')[0] : '';
    const checkOut = endDate ? endDate.toISOString().split('T')[0] : '';
    const personal = numPeople || 1;

    navigate(
      `/accommodations/${encodeURIComponent(accommoId)}?checkIn=${checkIn}&checkOut=${checkOut}&personal=${personal}`,
    ); // 숙소 ID를 URL에 포함하여 이동
  };

  // 슬라이드 이동 처리 함수
  const handleSlideChange = (direction) => {
    // 현재 인덱스에 방향(좌/우)에 따라 이동할 인덱스 계산
    const newIndex = swiperRef.current.activeIndex + direction * 3;
    // 이동할 인덱스를 최소 0, 최대 범위 내로 제한
    const clampedIndex = Math.max(0, Math.min(categories[selectedCategory].length - 1, newIndex));
    swiperRef.current?.slideTo(clampedIndex); // 계산된 인덱스로 슬라이드 이동
  };

  return (
    <div className="swiper-card-wrapper">
      {/* 카테고리 선택 버튼 그룹 */}
      <div className="button-group">
        {Object.keys(categories).map((category) => (
          <Button3
            key={category}
            onClick={() => setSelectedCategory(category)} // 선택된 카테고리 업데이트
            style={{
              backgroundColor: selectedCategory === category ? 'black' : 'transparent', // 선택된 버튼의 배경색 변경
              color: selectedCategory === category ? 'white' : 'black', // 선택된 버튼의 글자색 변경
            }}
          >
            {category}
          </Button3>
        ))}
      </div>

      {/* 숙소 카드 슬라이드 컨테이너 */}
      <div className="accomo-card-container">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper; // Swiper 인스턴스를 ref에 저장
          }}
          slidesPerView={1} // 기본 슬라이드 뷰 수
          breakpoints={{
            400: { slidesPerView: 2 },
            600: { slidesPerView: 3 },
            800: { slidesPerView: 4 },
            1000: { slidesPerView: 4 },
            1200: { slidesPerView: 4 },
            1600: { slidesPerView: 4 },
            1920: { slidesPerView: 4 }, // 화면 크기에 따라 슬라이드 뷰 수 변경
          }}
        >
          {/* 선택된 카테고리의 숙소 데이터를 슬라이드로 표시 */}
          {categories[selectedCategory].slice(0, 10).map((data) => (
            <SwiperSlide key={data.lodging_id}>
              <div className="accommo-card-wrap" onClick={() => goToAccommo(data.lodging_id)}>
                <img
                  src={data.main_image || 'https://via.placeholder.com/300'} // 이미지가 없을 경우 기본 이미지 사용
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
                      // 가격이 있을 경우 가격 표시, 없을 경우 '정보 없음' 표시
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
        onClick={() => handleSlideChange(-1)} // 이전 슬라이드로 이동
      />
      <img
        src={arrowRight}
        alt="Next"
        className="accomo-next-btn"
        onClick={() => handleSlideChange(1)} // 다음 슬라이드로 이동
      />
    </div>
  );
}
