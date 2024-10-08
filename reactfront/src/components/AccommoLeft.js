import React, { useState } from 'react';
import Map from '../assets/Map.svg';
import './AccommoLeft.css';
import { Button2 } from './Button.style';
import Modal from './Modal'; // 모달 컴포넌트 임포트
import MapComponent from './Map'; // Map 컴포넌트 임포트

export default function AccommoLeft() {
  const [selectedOption, setSelectedOption] = useState('전체');
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 관리

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className="map">
        <img src={Map} style={{ borderRadius: '15px', width: '100%' }} alt="Map" />
        <div className="map-title">
          <Button2 onClick={toggleModal}>지도보기</Button2> {/* 모달 열기 */}
        </div>
      </div>
      <div className="filter">
        <div>
          <div style={{ paddingBottom: '5%', borderBottom: '1px solid rgb(231, 231, 231)', fontSize: '1.2em' }}>
            필터
          </div>
          <div>
            <div style={{ margin: '5% 0% 10% 0%' }}>숙소유형</div>
            <div>
              {['전체', '호텔·리조트', '모텔·유스호스텔', '게스트하우스', '캠핑·펜션', '전통 숙소'].map(
                (option) => (
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
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <MapComponent /> {/* Map 컴포넌트 렌더링 */}
      </Modal>
    </div>
  );
}
