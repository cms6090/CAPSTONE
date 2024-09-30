import React from 'react';
import './Main.css';
import RegionCardContainer from '../components/RegionCardContainer'

function Main() {
  return (
    <div className="Main">
      <div style={{ padding: '10px' }}>
        <div>메인 페이지</div>
        <a href='./componenettest'>컴포넌트 테스트 페이지</a>
        <div>
          국내 인기숙소
          <RegionCardContainer/>
        </div>
      </div>
    </div>
  );
}

export default Main;
