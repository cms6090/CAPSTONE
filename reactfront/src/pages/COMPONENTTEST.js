import React from 'react';
import Table from '../components/Table';
import AccommoCard from '../components/AccommoCard';
import SettingList from '../components/SettingList';

import DatePickerValue from '../components/DatePicker';
import RegionCard from '../components/RegionCard';

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
        숙소 카드
        <AccommoCard/>
      </div>
      <div>
        설정
        <SettingList/>
      </div>
      <div>날짜
        <DatePickerValue/>
      </div>
    </div>
  );
}

export default COMPONENTTEST;
