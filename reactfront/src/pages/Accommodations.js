import React, { useState, useEffect } from 'react';
import './Accommodations.css';
import { Box, Pagination } from '@mui/material';
import Map from '../assets/Map.svg';
import MapModal from '../components/MapModal'; // 모달 컴포넌트 임포트
import MapComponent from '../components/Map'; // Map 컴포넌트 임포트
import { Button2 } from '../components/Button.style';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

export default function Accommodations() {
  const [selectedOption, setSelectedOption] = useState('전체');
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태

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

  const defaultImage = 'https://via.placeholder.com/151'; // 대체 이미지 URL
  const itemsPerPage = 5; // 페이지당 아이템 수

  // 필터링 함수
  const filterData = () => {
    if (selectedOption === '전체') {
      return data;
    }
    const filterMap = {
      '호텔·리조트': ['호텔', '서비스드레지던스', '관광단지'],
      '모텔·유스호스텔': ['모텔', '유스호스텔'],
      게스트하우스: ['게스트하우스', '민박', '홈스테이'],
      '캠핑·펜션': ['야영장', '펜션'],
      '전통 숙소': ['한옥'],
    };
    return data.filter((item) => filterMap[selectedOption].includes(item.part));
  };

  // 필터링된 데이터 상태 업데이트
  useEffect(() => {
    const newFilteredData = filterData();
    setFilteredData(newFilteredData);
    setCurrentPage(1); // 필터 변경 시 페이지를 1로 초기화
  }, [selectedOption]);

  // 페이지에 표시할 데이터 계산
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // 전체 페이지 수

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // minfee를 포맷팅하는 함수
  const formatMinFee = (minfee) => {
    return minfee ? Number(minfee).toLocaleString() + '원' : '정보 없음';
  };

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleCardClick = (contentid) => {
    navigate(`/accommodations/${contentid}`); // 카드 클릭 시 /room/:id로 이동
  };

  return (
    <div className="Accommodation">
      <div className="accommo-left">
        <div>
          <div className="map">
            <img src={Map} style={{ borderRadius: '15px', width: '100%' }} alt="Map" />
            <div className="map-title">
              <Button2 onClick={toggleModal}>지도보기</Button2> {/* 모달 열기 */}
            </div>
          </div>
          <div className="filter">
            <div>
              <div
                style={{
                  paddingBottom: '5%',
                  borderBottom: '1px solid rgb(231, 231, 231)',
                  fontSize: '1.2em',
                }}
              >
                필터
              </div>
              <div>
                <div style={{ margin: '5% 0% 10% 0%' }}>숙소유형</div>
                <div>
                  {[
                    '전체',
                    '호텔·리조트',
                    '모텔·유스호스텔',
                    '게스트하우스',
                    '캠핑·펜션',
                    '전통 숙소',
                  ].map((option) => (
                    <div key={option} className="filter-item">
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="radio"
                          value={option}
                          checked={selectedOption === option}
                          onChange={handleOptionChange}
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 모달 컴포넌트 */}
          <MapModal isOpen={isModalOpen} onClose={toggleModal}>
            <MapComponent
              locations={filteredData.map((item) => ({
                ...item,
                minfee: formatMinFee(item.minfee), // 포맷된 minfee 추가
              }))}
            />
            {/* 필터링된 데이터 전달 */}
          </MapModal>
        </div>
      </div>
      <div className="accommo-right">
        <div className="accommo-component">
          {paginatedData.length === 0 ? (
            <h6 style={{ textAlign: 'center', marginTop: '20px' }}>
              해당 조건에 맞는 숙소가 없습니다.
            </h6>
          ) : (
            paginatedData.map((item) => (
              <div
                key={item.contentid}
                style={{
                  display: 'flex',
                  marginBottom: '16px',
                  padding: '2% 0%',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderBottom: '1px solid rgb(231,231,231)',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick(item.contentid)} // 카드 클릭 핸들러
              >
                <img
                  src={item.firstimage || defaultImage}
                  style={{ width: '20%', borderRadius: '15px' }}
                  alt={item.title}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: '1 0 auto', padding: '10px' }}>
                    <h6 style={{ margin: 0 }}>{item.title}</h6>
                    <p style={{ margin: '5px 0', color: '#666' }}>{item.part}</p>
                    <p
                      style={{ margin: '5px 0', color: '#666' }}
                    >{`${item.area} ${item.sigungu}`}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}>{item.addr}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}>{formatMinFee(item.minfee)}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Pagination
              count={totalPages} // 전체 페이지 수
              page={currentPage} // 현재 페이지
              onChange={handlePageChange} // 페이지 변경 핸들러
              color="primary" // 색상 설정
            />
          </Box>
        </div>
      </div>
    </div>
  );
}
