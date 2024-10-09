import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Accommodations.css';
import { Box, Pagination } from '@mui/material';
import Map from '../assets/Map.svg';
import Modal from '../components/Modal';
import MapComponent from '../components/Map';
import { Button2 } from '../components/Button.style';
import { useNavigate } from 'react-router-dom';

export default function Accommodations() {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('전체');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const location = useLocation(); // 현재 URL 정보를 가져옵니다.
  const defaultImage = 'https://via.placeholder.com/151';
  const itemsPerPage = 5;

  // 데이터 가져오기
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = query.get('keyword');

    let url = 'http://localhost:3000/api/accommodations';
    if (keyword) {
      url += `?keyword=${keyword}`;
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
      '호텔·리조트': ['호텔', '서비스드레지던스', '관광단지'],
      '모텔·유스호스텔': ['모텔', '유스호스텔'],
      게스트하우스: ['게스트하우스', '민박', '홈스테이'],
      '캠핑·펜션': ['야영장', '펜션'],
      '전통 숙소': ['한옥'],
    };
    return data.filter((item) => filterMap[selectedOption].includes(item.part));
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const formatMinFee = (minfee) => {
    return minfee ? Number(minfee).toLocaleString() + '원' : '정보 없음';
  };

  const navigate = useNavigate();

  const handleCardClick = (contentid) => {
    navigate(`/accommodations/${contentid}`);
  };

  return (
    <div className="Accommodation">
      <div className="accommo-left">
        <div>
          <div className="map">
            <img src={Map} style={{ borderRadius: '15px', width: '100%' }} alt="Map" />
            <div className="map-title">
              <Button2 onClick={toggleModal}>지도보기</Button2>
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

          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <MapComponent
              locations={filteredData.map((item) => ({
                ...item,
                minfee: formatMinFee(item.minfee),
              }))}
            />
          </Modal>
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
                onClick={() => handleCardClick(item.contentid)}
              >
                <img
                  src={item.main_image || defaultImage}
                  style={{ width: '20%', borderRadius: '15px' }}
                  alt={item.title}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: '1 0 auto', padding: '10px' }}>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                    {`${item.part}`} 
                  </p>
                  <h6 style={{ margin: 0, fontSize: '1.3em', fontWeight: 'bold' }}>{item.name}</h6> {/* 숙소 이름 */}
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    {`${item.area} ${item.sigungu}`}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>{formatMinFee(item.minfee)}</p> {/* 최소 요금 */}
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
