import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 훅을 import
import RegionCard from './RegionCard';
import ArrowRight from '../components/Arrowright';
import ArrowLeft from '../components/Arrowleft';
import './RegionCardContainer.css';

function RegionCardContainer() {
  const containerRef = useRef(null);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const cards = [
    '제주도',
    '서울',
    '부산',
    '강릉',
    '인천',
    '경주',
    '해운대',
    '가평',
    '여수',
    '속초',
  ];

  const scrollLeft = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth; // 6개 카드에 맞게 조정
      containerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth; // 6개 카드에 맞게 조정
      containerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const goToRegion = (regionName) => {
    navigate(`/accommodations?region=${encodeURIComponent(regionName)}`); // 지역 이름을 쿼리 파라미터로 전달
  };

  return (
    <div className="region-card-container-wrapper">
      <ArrowLeft className="arrow-left" onClick={scrollLeft} />
      <div className="region-card-container" ref={containerRef}>
        {cards.map((regionName) => (
          <RegionCard
            key={regionName}
            regionName={regionName}
            onClick={() => goToRegion(regionName)} // 클릭 이벤트를 RegionCard에 전달
          />
        ))}
      </div>
      <ArrowRight className="arrow-right" onClick={scrollRight} />
    </div>
  );
}

export default RegionCardContainer;
