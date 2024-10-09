import '../../node_modules/swiper/swiper.css';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './RegionCard.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import

// 이미지 import
import arrowLeft from '../assets/Arrowleft.svg';
import arrowRight from '../assets/Arrowright.svg';
import seoulImage from '../assets/Seoul.svg';
import busanImage from '../assets/Busan.svg';
import jejuImage from '../assets/Jeju.svg';
import sokchoImage from '../assets/Sokcho.svg';
import gangneungImage from '../assets/Gangneung.svg';
import gyeongjuImage from '../assets/Gyeongju.svg';
import gapyeongImage from '../assets/Gapyeong.svg';
import haeundaeImage from '../assets/Haeundae.svg';
import incheonImage from '../assets/Incheon.svg';
import yeosuImage from '../assets/Yeosu.svg';

const swiperList = [
  { name: '서울', img: seoulImage },
  { name: '부산', img: busanImage },
  { name: '제주', img: jejuImage },
  { name: '속초', img: sokchoImage },
  { name: '강릉', img: gangneungImage },
  { name: '경주', img: gyeongjuImage },
  { name: '가평', img: gapyeongImage },
  { name: '해운대', img: haeundaeImage },
  { name: '인천', img: incheonImage },
  { name: '여수', img: yeosuImage },
];

export default function RegionCard() {
  const swiperRef = useRef(null); // Swiper 인스턴스를 저장할 ref
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 지역으로 이동하는 함수
  const goToRegion = (regionName) => {
    navigate(`/accommodations?keyword=${encodeURIComponent(regionName)}`); // 지역 이름을 쿼리 파라미터로 전달
  };

  // 슬라이드 이동 처리
  const handleSlideChange = (direction) => {
    const newIndex = swiperRef.current?.activeIndex + direction * 6;
    const clampedIndex = Math.max(0, Math.min(swiperList.length - 1, newIndex)); // 인덱스 범위 제한
    swiperRef.current?.slideTo(clampedIndex); // 안전하게 슬라이드로 이동
  };

  return (
    <div className="swiper-card-wrapper">
      <div className="card-container">
        <Swiper
          onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
          slidesPerView={1}
          breakpoints={{
            400: { slidesPerView: 2 },
            600: { slidesPerView: 3 },
            800: { slidesPerView: 4 },
            1000: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
            1600: { slidesPerView: 6 },
            1920: { slidesPerView: 6 },
          }}
        >
          {swiperList.map((data) => (
            <SwiperSlide key={data.name}>
              <div className="card-wrap" onClick={() => goToRegion(data.name)}>
                <img className="card-image" src={data.img} alt={data.name} />
                <p className="card-name">{data.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <img
        src={arrowLeft}
        alt="Previous"
        className="region-prev-btn"
        onClick={() => handleSlideChange(-1)} // 이전 슬라이드
      />
      <img
        src={arrowRight}
        alt="Next"
        className="region-next-btn"
        onClick={() => handleSlideChange(1)} // 다음 슬라이드
      />
    </div>
  );
}
