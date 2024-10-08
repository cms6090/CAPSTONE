import React from 'react';
import './RoomModal.css'; // 모달 스타일을 위한 CSS 파일

export default function RoomModal({ isOpen, onClose, room }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <div style={{ fontSize: '1.1em', margin: '0% 1%' }}>{room.roomtitle}의 상세정보</div>
        </div>
        <div className="modal-body">
          <div className="room-amenities">
            {room.bathfacility === 1 && (
              <span className="material-symbols-outlined">shower</span> // 목욕시설
            )}
            {room.bath === 1 && (
              <span className="material-symbols-outlined">bathtub</span> // 욕조
            )}
            {room.hometheater === 1 && (
              <span className="material-symbols-outlined">theaters</span> // 홈시어터
            )}
            {room.aircondition === 1 && (
              <span className="material-symbols-outlined">mode_fan</span> // 에어컨
            )}
            {room.tv === 1 && (
              <span className="material-symbols-outlined">tv</span> // TV
            )}
            {room.pc === 1 && (
              <span className="material-symbols-outlined">desktop_windows</span> // PC
            )}
            {room.cable === 1 && (
              <span className="material-symbols-outlined">cable</span> // 케이블
            )}
            {room.internet === 1 && (
              <span className="material-symbols-outlined">wifi</span> // 인터넷
            )}
            {room.refrigerator === 1 && (
              <span className="material-symbols-outlined">kitchen</span> // 냉장고
            )}
            {room.toiletries === 1 && (
              <span className="material-symbols-outlined">clean_hands</span> // 세면용품
            )}
            {room.sofa === 1 && (
              <span className="material-symbols-outlined">chair</span> // 소파
            )}
            {room.cook === 1 && (
              <span className="material-symbols-outlined">cooking</span> // 취사용품
            )}
            {room.hairdryer === 1 && (
              <img src='../components/hairdryer.svg' alt='헤어 드라이기' /> // 헤어 드라이기
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
