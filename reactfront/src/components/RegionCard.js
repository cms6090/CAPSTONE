import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import
import './RegionCard.css';
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

const regionImages = {
  서울: seoulImage,
  부산: busanImage,
  제주도: jejuImage,
  속초: sokchoImage,
  강릉: gangneungImage,
  경주: gyeongjuImage,
  가평: gapyeongImage,
  해운대: haeundaeImage,
  인천: incheonImage,
  여수: yeosuImage,
};

function RegionCard({ regionName }) {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const goToRegion = () => {
    navigate(`/accommodations?region=${encodeURIComponent(regionName)}`); // 지역 이름을 쿼리 파라미터로 전달
  };

  const imageSrc = regionImages[regionName] || seoulImage; // 기본 이미지는 서울

  return (
    <div className="region-card" onClick={goToRegion}>
      <img src={imageSrc} alt={regionName} className="region-image" />
      <div className="region-name">{regionName}</div>
    </div>
  );
}

export default RegionCard;
