import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Accommodations.css';
import { Box, Pagination } from '@mui/material';
import Map from '../assets/Map.svg';
import MapModal from '../components/MapModal';
import MapComponent from '../components/Map';
import { Button2 } from '../components/Button.style';
import { useNavigate } from 'react-router-dom';

export default function Accommodations() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('전체');
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation();
  const defaultImage = 'https://via.placeholder.com/151';
  const itemsPerPage = 10;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword');

    let url = 'http://localhost:3000/api/accommodations/';
    if (keyword) {
      url += `?keyword=${encodeURIComponent(keyword)}`; // URL 인코딩 적용
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [location.search]);

  useEffect(() => {
    const newFilteredData = filterData();
    setFilteredData(newFilteredData);
    setCurrentPage(1);
  }, [selectedOption, data]);

  const filterData = () => {
    if (selectedOption === '전체') {
      return data;
    }
    const filterMap = {
      '호텔·리조트': ['관광호텔', '서비스드레지던스', '관광단지'],
      '모텔·유스호스텔': ['모텔', '유스호스텔'],
      게스트하우스: ['게스트하우스', '민박', '홈스테이'],
      '캠핑·펜션': ['야영장', '펜션'],
      '전통 숙소': ['한옥'],
    };
    return data.filter((item) => filterMap[selectedOption].includes(item.part));
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0); // 페이지가 변경될 때 스크롤을 맨 위로 이동
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleMapModal = () => {
    setMapModalOpen(!isMapModalOpen);
  };

  const formatMinFee = (min_price_per_night) => {
    return min_price_per_night ? Number(min_price_per_night).toLocaleString() + '원 ~' : '정보 없음';
  };

  const navigate = useNavigate();

  const handleCardClick = (contentid) => {
    navigate(`/accommodations/${contentid}`);
  };

  console.log(filteredData);

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

          <MapModal isOpen={isMapModalOpen} onClose={toggleMapModal}>
            <MapComponent
              locations={
                filteredData && filteredData.length > 0
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
                className='accommo-component-item'
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
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                      {`${item.part}`}
                    </p>
                    <h6 style={{ margin: 0, fontSize: '1.3em', fontWeight: 'bold' }}>
                      {item.name}
                    </h6>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      {`${item.area} ${item.sigungu}`}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>{formatMinFee(item.min_price_per_night)}</p>
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
