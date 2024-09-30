import React from 'react';
import './AccommoCard.css'; // CSS 파일 추가

function AccommoCard() {
  const accommodation = {
    id: 129067,
    title: '죽도마을',
    part: '민박',
    area: '전북특별자치도',
    sigungu: '고창군',
    addr: '전북특별자치도 고창군 부안면 봉암리 683',
    tel: '',
    firstimage: '', // 기본 이미지 사용
    firstimage2: '',
  };

  return (
    <div className="accommo-card">
      <img
        src={accommodation.firstimage || 'https://via.placeholder.com/300'} // 기본 이미지 URL
        alt={accommodation.title}
        className="accommo-image"
      />
      <div className='accommo-info'>
        <div style={{ fontSize: '0.9em' }}>{accommodation.part}</div>
        <h4>{accommodation.title}</h4>
        <h5 className='accommo-addr'>{accommodation.addr}</h5>
      </div>
    </div>
  );
}

export default AccommoCard;
