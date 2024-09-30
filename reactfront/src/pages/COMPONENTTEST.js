import React from 'react';
import ArrowRight from '../components/Arrowright';
import ArrowLeft from '../components/Arrowleft';
import RegionCardContainer from '../components/RegionCardContainer';
import Table from '../components/Table';
import AccommoCard from '../components/AccommoCard';


function COMPONENTTEST() {
  return (
    <div>
      <div style={{display:'flex'}}>
        화살표
        <ArrowLeft />
        <ArrowRight />
      </div>
      <div>
        지역 카드
        <RegionCardContainer/>
      </div>
      <div>
        테이블
        <Table/>
      </div>
      <div>숙소 카드
        <AccommoCard/>
      </div>
    </div>
  );
}

export default COMPONENTTEST;
