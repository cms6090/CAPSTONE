import React from 'react';
import Table from '../components/Table';

import DatePickerValue from '../components/DatePicker';
import RegionCard from '../components/RegionCard';
import Map from '../components/Map';
import SearchSection from '../components/SearchSection';

function COMPONENTTEST() {
  return (
    <div>
      <div>
        지역 카드
        <RegionCard />
      </div>
      <div>
        테이블
        <Table />
      </div>
      <div>
        날짜
        <DatePickerValue />
      </div>
      <div>
        지도
        <Map />
      </div>
      <div>
        검색 창
        <SearchSection />
      </div>
    </div>
  );
}

export default COMPONENTTEST;
