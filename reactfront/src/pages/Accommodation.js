import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Accommodation.css';
import JustMap from '../components/JustMap';
import Modal from '../components/Modal'; // 모달 컴포넌트 임포트
import { Button2 } from '../components/Button.style';
import Map from '../assets/Map.svg';

export default function Accommodation() {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 관리

  // 데이터를 가져오는 로직
  const data = [
    {
      contentid: 129067,
      title: '죽도마을',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '',
      firstimage2: '',
      minfee: null,
    },
    {
      contentid: 129068,
      title: '해리마을',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 해리면 동호리',
      tel: '',
      firstimage: '',
      firstimage2: '',
      minfee: null,
    },
    {
      contentid: 129104,
      title: '장촌마을',
      part: '민박',
      area: '전라남도',
      sigungu: '여수시',
      addr: '전라남도 여수시 삼산면 서도리',
      tel: '',
      firstimage: '',
      firstimage2: '',
      minfee: null,
    },
    {
      contentid: 136039,
      title: '서울올림픽파크텔',
      part: '유스호스텔',
      area: '서울특별시',
      sigungu: '송파구',
      addr: '서울특별시 송파구 올림픽로 448',
      tel: '02-410-2114',
      firstimage: '',
      firstimage2: '',
      minfee: '35800',
    },
    {
      contentid: 136060,
      title: '소노휴 양평',
      part: '관광단지',
      area: '경기도',
      sigungu: '양평군',
      addr: '경기도 양평군 개군면 신내길7번길 55',
      tel: '1588-4888',
      firstimage: '',
      firstimage2: '',
      minfee: '290000',
    },
    {
      contentid: 136062,
      title: '한화리조트 양평',
      part: '관광단지',
      area: '경기도',
      sigungu: '양평군',
      addr: '경기도 양평군 옥천면 신촌길 188',
      tel: '031-772-3811',
      firstimage: '',
      firstimage2: '',
      minfee: '41900',
    },
    {
      contentid: 136063,
      title: '한화리조트 용인 베잔송',
      part: '관광단지',
      area: '경기도',
      sigungu: '용인시',
      addr: '경기도 용인시 처인구 남사읍 봉무로153번길 79',
      tel: '031-332-1122',
      firstimage: '',
      firstimage2: '',
      minfee: '74000',
    },
    {
      contentid: 136077,
      title: '더케이설악산가족호텔',
      part: '콘도미니엄',
      area: '강원특별자치도',
      sigungu: '속초시',
      addr: '강원특별자치도 속초시 설악산로 470-7',
      tel: '033-639-8100',
      firstimage: '',
      firstimage2: '',
      minfee: '50300',
    },
    {
      contentid: 136082,
      title: '설악포유리조트',
      part: '관광단지',
      area: '강원특별자치도',
      sigungu: '고성군',
      addr: '강원특별자치도 고성군 토성면 잼버리동로 97',
      tel: '033-633-9100',
      firstimage: '',
      firstimage2: '',
      minfee: '220000',
    },
    {
      contentid: 136084,
      title: '오색그린야드호텔',
      part: '관광호텔',
      area: '강원특별자치도',
      sigungu: '양양군',
      addr: '강원특별자치도 양양군 서면 대청봉길 34',
      tel: '033-670-1004',
      firstimage: '',
      firstimage2: '',
      minfee: '270000',
    },
  ];

  const rooms = [
    {
      contentid: 136039,
      roomcode: 7772,
      roomtitle: '유스룸',
      roomcount: 8,
      available_count: 2,
      base_person: 2,
      max_person: 7,
      offseasonminnfee: 57300,
      offseasonmaxnfee: 86300,
      peakseasonminfee: 64300,
      peakseasonmaxfee: 70300,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: 'Y',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
    {
      contentid: 136039,
      roomcode: 7773,
      roomtitle: '가족실',
      roomcount: 40,
      available_count: 12,
      base_person: 3,
      max_person: 8,
      offseasonminnfee: 65300,
      offseasonmaxnfee: 102300,
      peakseasonminfee: 105300,
      peakseasonmaxfee: 129300,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: '',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
    {
      contentid: 136039,
      roomcode: 7774,
      roomtitle: '트윈룸',
      roomcount: 123,
      available_count: 71,
      base_person: 2,
      max_person: 7,
      offseasonminnfee: 90400,
      offseasonmaxnfee: 129400,
      peakseasonminfee: 138400,
      peakseasonmaxfee: 156400,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: '',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
    {
      contentid: 136039,
      roomcode: 7775,
      roomtitle: '더블룸',
      roomcount: 9,
      available_count: 0,
      base_person: 2,
      max_person: 6,
      offseasonminnfee: 85300,
      offseasonmaxnfee: 124300,
      peakseasonminfee: 101300,
      peakseasonmaxfee: 140300,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: '',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
    {
      contentid: 136039,
      roomcode: 7776,
      roomtitle: '온돌',
      roomcount: 5,
      available_count: 2,
      base_person: 2,
      max_person: 3,
      offseasonminnfee: 35800,
      offseasonmaxnfee: 80800,
      peakseasonminfee: 83800,
      peakseasonmaxfee: 110800,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: '',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
    {
      contentid: 136039,
      roomcode: 7777,
      roomtitle: '단체실',
      roomcount: 48,
      available_count: 36,
      base_person: 4,
      max_person: 7,
      offseasonminnfee: 52200,
      offseasonmaxnfee: 80200,
      peakseasonminfee: 92200,
      peakseasonmaxfee: 102200,
      roombathfacility: 'Y',
      roombath: 'Y',
      roomhometheater: '',
      roomaircondition: 'Y',
      roomtv: 'Y',
      roompc: '',
      roomcable: 'Y',
      roominternet: 'Y',
      roomrefrigerator: 'Y',
      roomtoiletries: 'Y',
      roomsofa: '',
      roomcook: 'Y',
      roomtable: 'Y',
      roomhairdryer: '',
      rooming1: '',
      rooming1_alt: '',
      rooming2: '',
      rooming2_alt: '',
      rooming3: '',
      rooming3_alt: '',
    },
  ];

  // ID로 숙소 정보를 찾기
  const accommodation = data.find((item) => item.contentid === parseInt(id));

  if (!accommodation) {
    return <h2>숙소를 찾을 수 없습니다.</h2>;
  }

  // 랜덤 이미지 URL
  const defaultImage = 'https://via.placeholder.com/300';

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="hotel">
      <section className="hotel-image">
        <ul className="hotel-image-content">
          <ol>
            <div className="hotel-image-contents">
              <img src={accommodation.firstimage || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>
          <ol>
            <div className="hotel-image-contents">
              <img src={accommodation.firstimage || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>
          <ol>
            <div className="hotel-image-contents">
              <img src={accommodation.firstimage || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>
          <ol>
            <div className="hotel-image-contents">
              <img src={accommodation.firstimage || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>
          <ol>
            <div className="hotel-image-contents">
              <img src={accommodation.firstimage || defaultImage} alt="숙소 이미지" />
            </div>
          </ol>
        </ul>
      </section>
      <section className="hotel-title">
        <div className="hotel-title-content">
          <div style={{ fontSize: '0.9em', color: 'rgba(0,0,0,0.8)' }}>{accommodation.part}</div>
          <div style={{ fontSize: '1.2em', color: 'rgba(0,0,0,1)' }}>{accommodation.title}</div>
        </div>
        <div className="hotel-info">
          <div className="hotel-info-amenity">
            <h6>서비스 부대시설</h6>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="hotel-info-map-container">
            <div className="hotel-info-map" style={{ margin: '0', height: '50%' }}>
              <div className="hotel-info-map-detail">
                <h6>지도</h6>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center', // 세로 중앙 정렬
                    fontSize: '0.8em',
                    color: 'rgba(0,0,0,0.8)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '4px' }}>
                    location_on
                  </span>
                  {accommodation.addr}
                </div>
              </div>
              <div className="hotel-info-map-detail">
                <Button2 onClick={toggleModal}>지도보기</Button2> {/* 모달 열기 */}
              </div>
            </div>
            {/* 모달 컴포넌트 */}
            <Modal isOpen={isModalOpen} onClose={toggleModal}>
              <JustMap locations={accommodation.addr} />
              {/* 필터링된 데이터 전달 */}
            </Modal>
          </div>
        </div>
      </section>
      <section className="hotel-room">
        <div style={{ fontSize: '1.1em', marginBottom:'1%' }}>객실 정보</div>
        <div className="hotel-room-card">
          <div className='hotel-room-card-container'>
            <div></div>
            <div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
