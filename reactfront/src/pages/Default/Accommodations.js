import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Accommodations.css';
import { Box, Pagination, Slider } from '@mui/material';
import Map from '../../assets/Map.svg';
import MapModal from '../../components/MapModal';
import MapComponent from '../../components/Map';
import { Button2 } from '../../components/Button.style';

const minDistance = 50000; // 슬라이더에서 최소 거리 값 설정
const itemsPerPage = 10; // 페이지당 표시할 아이템 수
const defaultImage = 'https://via.placeholder.com/151'; // 기본 이미지 URL

export default function Accommodations() {
  // 모든 숙소 데이터를 저장할 상태
  const [data, setData] = useState([]);
  // 선택된 필터 옵션 상태
  const [selectedOption, setSelectedOption] = useState('전체');
  // 지도 모달 창 열림/닫힘 상태
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  // 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);
  // 가격 범위 상태 (최소값과 최대값)
  const [value, setValue] = useState([0, 500000]);

  const location = useLocation(); // 현재 URL의 위치 정보를 가져오기 위한 Hook
  const navigate = useNavigate(); // 페이지 이동을 위한 Hook

  // 슬라이더 값이 변경될 때 호출되는 함수
  const handleChange = useCallback((event, newValue, activeThumb) => {
    // 슬라이더 값이 배열 형태로 전달되지 않으면 반환
    if (!Array.isArray(newValue)) return;

    // 슬라이더의 값 업데이트, 최소 거리 유지
    setValue((prevValue) => {
      if (activeThumb === 0) {
        // 첫 번째 핸들이 움직일 경우, 최소값을 업데이트하되 최소 거리 이상 유지
        return [Math.min(newValue[0], prevValue[1] - minDistance), prevValue[1]];
      } else {
        // 두 번째 핸들이 움직일 경우, 최대값을 업데이트하되 최소 거리 이상 유지
        return [prevValue[0], Math.max(newValue[1], prevValue[0] + minDistance)];
      }
    });
  }, []);

  // 페이지가 로드될 때 또는 검색어가 변경될 때 숙소 데이터를 가져옴
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword'); // URL 쿼리 매개변수에서 키워드를 가져옴
    const personal = query.get('personal'); // 인원 수 가져오기
    const checkIn = query.get('checkIn'); // 체크인 날짜 가져오기
    const checkOut = query.get('checkOut'); // 체크아웃 날짜 가져오기
    const minPrice = value[0]; // 슬라이더의 최소 가격 값
    const maxPrice = value[1]; // 슬라이더의 최대 가격 값

    // 필터에 따라 API URL 구성
    let url = `http://localhost:3000/api/accommodations/?minPrice=${minPrice}`;

    // 조건적으로 쿼리 파라미터를 추가
    if (maxPrice < 500000) {
      url += `&maxPrice=${maxPrice}`;
    }
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    if (personal) {
      url += `&personal=${personal}`;
    }
    if (checkIn) {
      url += `&checkIn=${checkIn}`;
    }
    if (checkOut) {
      url += `&checkOut=${checkOut}`;
    }

    console.log('Generated URL:', url); // 생성된 URL을 로그로 확인

    // API로부터 데이터 가져오기
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [location.search, value]);

  // 선택된 필터 옵션에 따라 데이터를 필터링하는 함수 - useMemo로 메모이제이션
  const filteredData = useMemo(() => {
    if (selectedOption === '전체') return data; // '전체'가 선택된 경우 모든 데이터 반환

    // 필터링할 숙소 유형 정의
    const filterMap = {
      '호텔·리조트': ['관광호텔', '서비스드레지던스', '관광단지'],
      '모텔·유스호스텔': ['모텔', '유스호스텔'],
      게스트하우스: ['게스트하우스', '민박', '홈스테이'],
      '캠핑·펜션': ['야영장', '펜션'],
      '전통 숙소': ['한옥'],
    };

    // 선택된 옵션에 따라 데이터 필터링
    const filtered = data.filter((item) => filterMap[selectedOption]?.includes(item.part));
    return filtered;
  }, [selectedOption, data]);

  // 현재 페이지에 해당하는 데이터 슬라이싱
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const paginated = filteredData.slice(start, end);
    return paginated;
  }, [filteredData, currentPage]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredData.length / itemsPerPage);
    return pages;
  }, [filteredData.length]);

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
  }, []);

  // 필터 옵션 변경 시 호출되는 함수
  const handleOptionChange = useCallback((event) => {
    setSelectedOption(event.target.value);
    setCurrentPage(1); // 필터 변경 시 페이지를 첫 번째로 초기화
  }, []);

  // 지도 모달 열기/닫기 토글 함수
  const toggleMapModal = useCallback(() => {
    setMapModalOpen((prev) => !prev);
  }, [isMapModalOpen]);

  // 최소 요금을 형식화하는 함수 - 가격을 문자열로 변환하고 '원 ~' 추가
  const formatMinFee = useCallback((min_price_per_night) => {
    const formatted = min_price_per_night
      ? Number(min_price_per_night).toLocaleString() + '원 ~'
      : '정보없음';
    return formatted;
  }, []);

  // 가격 형식화 함수 수정 - 슬라이더가 최대 값에 있을 때는 '이상'으로 표시
  const formatFee = useCallback((price, isMax) => {
    const formatted =
      isMax && price === 500000
        ? '500,000원 이상'
        : price
          ? Number(price).toLocaleString() + '원'
          : '0원';
    return formatted;
  }, []);

  // 카드 클릭 시 해당 숙소 상세 페이지로 이동하는 함수
  const handleCardClick = useCallback(
    (contentid) => {
      navigate(`/accommodations/${contentid}`);
    },
    [navigate],
  );

  return (
    <div className="Accommodation">
      <div className="accommo-left">
        <div>
          <div className="map">
            <img src={Map} style={{ borderRadius: '15px', width: '100%' }} alt="Map" />
            <div className="map-title">
              <Button2 onClick={toggleMapModal}>지도보기</Button2>
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
              <div
                style={{
                  margin: '1.5em 0% 1.5em 0%',
                  fontSize: '1.1em',
                  borderBottom: '1px solid rgb(231, 231, 231)',
                }}
              >
                <div style={{ marginBottom: '1.5em', fontSize: '1.1em' }}>숙소유형</div>
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
              <div>
                <div style={{ margin: '1.5em 0% 1.5em 0%', fontSize: '1.1em' }}>
                  <span style={{ marginRight: '1em' }}>가격</span>
                  <span style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.8)' }}>1박 기준</span>
                </div>
                <Box sx={{ width: 300 }}>
                  <Slider
                    getAriaLabel={() => 'Minimum distance'}
                    value={value}
                    min={0}
                    max={500000}
                    step={50000}
                    onChange={handleChange}
                    disableSwap
                    sx={{ '& .MuiSlider-thumb': { color: 'white' } }}
                  />
                </Box>
                <div style={{ textAlign: 'left', marginTop: '10px', fontSize: '0.9em' }}>
                  {formatFee(value[0])} ~ {formatFee(value[1], true)}
                </div>
              </div>
            </div>
          </div>
          <MapModal isOpen={isMapModalOpen} onClose={toggleMapModal}>
            <MapComponent
              locations={
                filteredData.length > 0
                  ? filteredData.map((item) => ({
                      addr: item.address,
                      area: item.area,
                      contentid: item.lodging_id,
                      firstimage: item.main_image,
                      title: item.name,
                      part: item.part,
                      min_price_per_night: formatMinFee(item.min_price_per_night),
                    }))
                  : []
              }
            />
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
                key={item.lodging_id}
                className="accommo-component-item"
                onClick={() => handleCardClick(item.lodging_id)}
              >
                <img
                  src={item.main_image || defaultImage}
                  style={{
                    width: '40%',
                    borderRadius: '15px',
                    aspectRatio: '1.5/1',
                    objectFit: 'cover',
                  }}
                  alt={item.title}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: '1 0 auto', padding: '10px' }}>
                    <p
                      style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}
                    >{`${item.part}`}</p>
                    <h6 style={{ margin: 0, fontSize: '1.3em', fontWeight: 'bold' }}>
                      {item.name}
                    </h6>
                    <p
                      style={{ margin: '5px 0', color: '#666' }}
                    >{`${item.area} ${item.sigungu}`}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      {formatMinFee(item.min_price_per_night)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </div>
      </div>
    </div>
  );
}
