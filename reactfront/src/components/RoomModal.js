import React from 'react';
import './RoomModal.css'; // 모달 스타일을 위한 CSS 파일
import { PiHairDryerFill } from 'react-icons/pi';
import { FaShower, FaBath, FaTv, FaDesktop, FaWifi } from 'react-icons/fa';
import { MdTheaters, MdOutlineCleanHands } from 'react-icons/md';
import { TbAirConditioning } from 'react-icons/tb';
import { LuCable, LuSofa } from 'react-icons/lu';
import { CgSmartHomeRefrigerator } from 'react-icons/cg';
import { PiCookingPotBold } from 'react-icons/pi';

const amenities = [
  { key: 'has_bathfacility', icon: <FaShower />, label: '목욕시설' },
  { key: 'has_bath', icon: <FaBath />, label: '욕조' },
  { key: 'has_home_theater', icon: <MdTheaters />, label: '홈시어터' },
  { key: 'has_air_conditioning', icon: <TbAirConditioning />, label: '에어컨' },
  { key: 'has_tv', icon: <FaTv />, label: 'TV' },
  { key: 'has_pc', icon: <FaDesktop />, label: 'PC' },
  { key: 'cable', icon: <LuCable />, label: '케이블' },
  { key: 'has_internet', icon: <FaWifi />, label: '인터넷' },
  { key: 'has_refrigerator', icon: <CgSmartHomeRefrigerator />, label: '냉장고' },
  { key: 'has_toiletries', icon: <MdOutlineCleanHands />, label: '세면용품' },
  { key: 'has_sofa', icon: <LuSofa />, label: '소파' },
  { key: 'has_cook', icon: <PiCookingPotBold />, label: '취사용품' },
  { key: 'hairdryer', icon: <PiHairDryerFill />, label: '헤어드라이어' },
];

export default function RoomModal({ isOpen, onClose, room }) {
  if (!isOpen) return "정보가 없습니다";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <div style={{ fontSize: '1em', margin: '0% 1%' }}>{room.room_name}</div>
        </div>
        <div className="modal-body">
          <div className="amenities-container">
            {room.facilities &&
              room.facilities.map((facility) =>
                amenities.map(({ key, icon, label }) =>
                  facility[key] === 1 ? (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                      {icon}
                      <span style={{ marginLeft: '8px' }}>{label}</span>
                    </div>
                  ) : null
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
