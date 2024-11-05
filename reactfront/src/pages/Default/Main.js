import React, { useContext } from 'react';
import './Main.css';
import RegionCard from '../../components/RegionCard';
import AccommoCard from '../../components/AccommoCard';
import MainBottom from '../../components/MainBottom';
import SearchSection from '../../components/SearchSection';
import TagCard from '../../components/TagCard';
import AgeCard from '../../components/AgeCard';

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
      <div className="contents">
        <div className="content">
          <div className="main-content">국내 여행지</div>
          <div className="card-container">
            <RegionCard />
          </div>
        </div>
        <div className="content">
          <div className="main-content">국내 숙소</div>
          <div className="card-container">
            <AccommoCard />
          </div>
        </div>
        <div className="content">
          <div className="main-content">추천 키워드</div>
          <div className="card-container">
            <TagCard />
          </div>
        </div>
        <div className="content">
          <div className="main-content">연령대별 인기 숙소</div>
          <div className="card-container">
            <AgeCard />
          </div>
        </div>
        <div>
          <MainBottom />
        </div>
      </div>
    </div>
  );
}

export default Main;
