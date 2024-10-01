import React from 'react';
import './Main.css';
import RegionCard from '../components/RegionCard';
import AccommoCard from '../components/AccommoCard';

function Main() {
  return (
    <div className="Main">
      <div style={{ padding: '10px' }}>
        <div>메인 페이지</div>
        <a href='./componenettest'>컴포넌트 테스트 페이지</a>
        <div>
          <div style={{marginBottom:'2%'}}>국내 인기 여행지</div>
          <RegionCard/>
        </div>
        <div>
          <div style={{marginBottom:'2%'}}>국내 추천 숙소</div>
          <AccommoCard/>
        </div>

      </div>
    </div>
  );
}

export default Main;
