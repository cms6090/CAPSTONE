import React from 'react';
import './Main.css';
import RegionCard from '../../components/RegionCard';
import AccommoCard from '../../components/AccommoCard';
import MainBottom from '../../components/MainBottom';
import SearchSection from '../../components/SearchSection';

function Main() {
  return (
    <div className="Main">
      <div className="Main-Header">
        <div style={{ width: '100%', margin: '10% 0% 5% 0%' }}>
          <h3 style={{ color: 'white', marginBottom: '2%' }}>국내여행은 여기는</h3>
          <div style={{ padding: '1.5%', backgroundColor: 'white', borderRadius: '15px' }}>
            <SearchSection />
          </div>
        </div>
      </div>
      <div className="content">
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