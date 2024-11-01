import React from 'react';
import './MainBottom.css'; // CSS 파일을 추가하여 스타일링
import { SearchContext } from './SearchContext'; // Import the context
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const regions = [
  '경기',
  '제주',
  '인천',
  '대구',
  '대전',
  '서울',
  '부산',
  '전북',
  '울산',
  '광주',
  '강원',
  '세종',
];

export default function MainBottom() {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const { setKeyword, startDate, endDate, numPeople } = useContext(SearchContext); // Destructure the context values

  // 특정 지역 페이지로 이동하는 함수
  const goToRegion = (regionName) => {
    const checkIn = startDate ? startDate.toISOString().split('T')[0] : '';
    const checkOut = endDate ? endDate.toISOString().split('T')[0] : '';
    const personal = numPeople || 1;
    console.log(checkIn, checkOut);

    setKeyword(regionName);

    navigate(
      `/accommodations?keyword=${encodeURIComponent(regionName)}&checkIn=${checkIn}&checkOut=${checkOut}&personal=${personal}`,
    );
  };

  return (
    <section>
      <div className="Bottom-title">국내 여행지</div>
      <article>
        <div className="region-grid">
          {regions.map((region) => (
            <div className="region-part" key={region}>
              <div className="region-link" onClick={() => goToRegion(region)}>
                <span>{region}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
