import '../../node_modules/swiper/swiper.css';
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './AccommoCard.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import
import { Button3 } from './Button.style'; // Button3 컴포넌트 import

// 이미지 import
import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';

const swiperList = [
  {
    id: 129067,
    title: '죽도마을',
    part: '민박',
    area: '전북특별자치도',
    sigungu: '고창군',
    addr: '전북특별자치도 고창군 부안면 봉암리 683',
    tel: '',
    firstimage: '',
    minfee: '40000',
  },
  {
    id: 129068,
    title: '해리마을',
    part: '민박',
    area: '전북특별자치도',
    sigungu: '고창군',
    addr: '전북특별자치도 고창군 해리면 동호리',
    tel: '',
    firstimage: 'http://tong.visitkorea.or.kr/cms/resource/10/3358010_image2_1.JPG',
    minfee: '58000',
  },
  {
    id: 129104,
    title: '장촌마을',
    part: '민박',
    area: '전라남도',
    sigungu: '여수시',
    addr: '전라남도 여수시 삼산면 서도리',
    tel: '',
    firstimage: '',
    minfee: '36000',
  },
  {
    id: 136039,
    title: '서울올림픽파크텔',
    part: '유스호스텔',
    area: '서울특별시',
    sigungu: '송파구',
    addr: '서울특별시 송파구 올림픽로 448',
    tel: '02-410-2114',
    minfee: '80000',
  },
  {
    id: 136060,
    title: '소노휴 양평',
    part: '리조트',
    area: '경기도',
    sigungu: '양평군',
    addr: '경기도 양평군 개군면 신내길7번길 55',
    tel: '1588-4888',
    minfee: '102000',
  },
];

const categories = {
  전체: swiperList,
  '호텔·리조트': swiperList.filter(
    (data) => data.part === '관광호텔' || data.part === '서비스드레지던스' || data.part === '관광단지',
  ),
  '모텔·유스호스텔': swiperList.filter(
    (data) => data.part === '모텔' || data.part === '유스호스텔',
  ),
  '게스트하우스': swiperList.filter(
    (data) => data.part === '게스트하우스' || data.part === '민박' || data.part === '홈스테이',
  ),
  '캠핑·펜션': swiperList.filter((data) => data.part === '야영장' || data.part === '펜션'),
  '전통 숙소': swiperList.filter((data) => data.part === '한옥' || data.part === '관광단지'),
};

export default function AccommoCard() {
  const [selectedCategory, setSelectedCategory] = useState('전체'); // 기본값은 '전체'
  const swiperRef = useRef(null); // Swiper 인스턴스를 저장할 ref
  const navigate = useNavigate(); // useNavigate 훅 사용

  const goToAccommo = (accommoId) => {
    navigate(`/accommodations?id=${encodeURIComponent(accommoId)}`); // 숙소 이름을 쿼리 파라미터로 전달
  };

  // 슬라이드 이동 처리
  const handleSlideChange = (direction) => {
    const newIndex = swiperRef.current.activeIndex + direction * 6;
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
          {categories[selectedCategory].map((data) => (
            <SwiperSlide key={data.id}>
              <div className="accommo-card-wrap" onClick={() => goToAccommo(data.id)}>
                <img
                  src={data.firstimage || 'https://via.placeholder.com/300'} // 기본 이미지 URL
                  alt={data.title}
                  className="accommo-image"
                />
                <div className="accommo-info">
                  <div className="accommo-part">{data.part}</div>
                  <div className='accommo-title'>{data.title}</div>
                  <div className="accommo-addr">{data.addr}</div>
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
