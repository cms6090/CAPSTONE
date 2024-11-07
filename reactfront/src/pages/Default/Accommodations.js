import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Accommodations.css';
import { Box, Pagination, Slider } from '@mui/material';
import Map from '../../assets/Map.svg';
import MapModal from '../../components/MapModal';
import MapComponent from '../../components/Map';
import { Button2, Button3 } from '../../components/Button.style';

const minDistance = 50000;
const itemsPerPage = 10;
const defaultImage = 'https://via.placeholder.com/151';

export default function Accommodations() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('전체');
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState([0, 500000]);
  const [selectedTags, setSelectedTags] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = useCallback((event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    setValue((prevValue) => {
      if (activeThumb === 0) {
        return [Math.min(newValue[0], prevValue[1] - minDistance), prevValue[1]];
      } else {
        return [prevValue[0], Math.max(newValue[1], prevValue[0] + minDistance)];
      }
    });
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword');
    const personal = query.get('personal');
    const checkIn = query.get('checkIn');
    const checkOut = query.get('checkOut');
    const minPrice = value[0];
    const maxPrice = value[1];

    let url = `http://localhost:3000/api/accommodations/?minPrice=${minPrice}`;

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
    selectedTags.forEach((tag) => {
      url += `&tag=${encodeURIComponent(tag)}`;
    });

    console.log('Generated URL:', url);

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const fetchedData = await response.json();
        setData(fetchedData);

        console.log('Fetched Data:', fetchedData);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [location.search, value, selectedTags]);

  const filteredData = useMemo(() => {
    if (selectedOption === '전체') return data;

    const filterMap = {
      '호텔·리조트': ['관광호텔', '서비스드레지던스', '관광단지'],
      '모텔·유스호스텔': ['모텔', '유스호스텔'],
      게스트하우스: ['게스트하우스', '민박', '홈스테이'],
      '캠핑·펜션': ['야영장', '펜션'],
      '전통 숙소': ['한옥'],
    };

    const filtered = data.filter((item) => filterMap[selectedOption]?.includes(item.part));
    return filtered;
  }, [selectedOption, data]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const paginated = filteredData.slice(start, end);
    return paginated;
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredData.length / itemsPerPage);
    return pages;
  }, [filteredData.length]);

  const handlePageChange = useCallback((event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  }, []);

  const handleOptionChange = useCallback((event) => {
    setSelectedOption(event.target.value);
    setCurrentPage(1);
  }, []);

  const toggleMapModal = useCallback(() => {
    setMapModalOpen((prev) => !prev);
  }, [isMapModalOpen]);

  const formatMinFee = useCallback((min_price_per_night) => {
    return min_price_per_night ? Number(min_price_per_night).toLocaleString() + '원 ~' : '정보없음';
  }, []);

  const formatFee = useCallback((price, isMax) => {
    return isMax && price === 500000
      ? '500,000원 이상'
      : price
        ? Number(price).toLocaleString() + '원'
        : '0원';
  }, []);

  const handleTagClick = useCallback((tag) => {
    setSelectedTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) // 이미 선택된 태그라면 제거
          : [...prevTags, tag], // 선택되지 않은 태그라면 추가
    );
  }, []);

  const handleCardClick = useCallback(
    (contentid) => {
      const queryParams = new URLSearchParams(location.search);
      navigate(`/accommodations/${contentid}?${queryParams.toString()}`);
    },
    [navigate, location.search],
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
              <div className="filter-part">
                <div style={{ marginBottom: '1.5em', fontSize: '1.1em' }}>숙소유형</div>
                <div style={{ fontSize: '0.9em' }}>
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
              <div className="filter-price">
                <div style={{ fontSize: '1.1em', marginBottom: '1em' }}>
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
              <div className="filter-tag">
                <div className="tag-button-group">
                  <div style={{ margin: '1em 0 0.5em 0', fontSize: '1.1em' }}>추천 키워드</div>
                  <div>
                    <div className="tag-button-row">
                      {['가성비', '청결', '위치', '서비스'].map((tag) => (
                        <Button3
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          style={{
                            backgroundColor: selectedTags.includes(tag) ? '#C9DFF2' : 'transparent',
                            color: selectedTags.includes(tag) ? '#097ce6' : 'black',
                            padding: '0.5em 1.5em',
                            borderColor: selectedTags.includes(tag) ? '#097ce6' : 'lightgray',
                          }}
                        >
                          {tag}
                        </Button3>
                      ))}
                    </div>
                    <div className="tag-button-row">
                      {['가족 여행', '연인', '풍경'].map((tag) => (
                        <Button3
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          style={{
                            backgroundColor: selectedTags.includes(tag) ? '#C9DFF2' : 'transparent',
                            color: selectedTags.includes(tag) ? '#097ce6' : 'black',
                            padding: '0.5em 1.5em',
                            borderColor: selectedTags.includes(tag) ? '#097ce6' : 'lightgray',
                          }}
                        >
                          {tag}
                        </Button3>
                      ))}
                    </div>
                  </div>
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
                    width: '100%',
                    borderRadius: '15px',
                    aspectRatio: '1.5/1',
                    objectFit: 'cover',
                  }}
                  alt={item.title}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'pretendard-bold',
                        color: 'rgba(0,0,0,0.5)',
                        fontSize: '0.9em',
                      }}
                    >{`${item.part}`}</div>
                    <h6 style={{ margin: 0, fontSize: '1.3em', fontWeight: 'bold' }}>
                      {item.name}
                    </h6>
                    <p
                      style={{ margin: '5px 0', color: '#666' }}
                    >{`${item.area} ${item.sigungu}`}</p>
                    {item.rating && item.rating !== '0' && (
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'rgb(255,173,10)',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          color: 'black',
                          fontSize: '0.8em',
                        }}
                      >
                        ★ {item.rating}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
