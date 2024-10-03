import React from 'react';
import './Main.css';
import RegionCard from '../components/RegionCard';
import AccommoCard from '../components/AccommoCard';
import MainBottom from '../components/MainBottom';

function Main() {
  return (
    <div className="Main">
      <div style={{ padding: '10px' }}>
        <div>메인 페이지</div>
        <a href="./componenettest">컴포넌트 테스트 페이지</a>
        <div>
          <div className="main-content">국내 인기 여행지</div>
          <div className="card-container">
            <RegionCard />
          </div>
        </div>
        <div>
          <div className="main-content">국내 추천 숙소</div>
          <div className="card-container">
            <AccommoCard />
          </div>
        </div>
        <div>
          <div className="main-content">
            <MainBottom />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
