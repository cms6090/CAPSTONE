import React from 'react';
import { useLocation } from 'react-router-dom';
import './Reserve.css';
import { Button2 } from '../components/Button.style';

export default function Reserve() {
  const location = useLocation();
  const { contentid, title, roomcode } = location.state || {};

  return (
    <div className="Reserve">
      <div style={{ padding: '10px' }}>
        <h4>예약 확인 및 결제</h4>
        <div className="reserve-container">
          <div className="reserve-left">
            <div className="reserve-left-header">예약자 정보</div>
            <div className="reserve-left-container">
              <div className="reserve-left-contents">
                <div className="reserve-user-detail">
                  <div className="reserve-title">예약자 이름</div>
                  <div className="reserve-user-contents">사용자 이름</div>
                </div>
                <div className="reserve-user-detail">
                  <div className="reserve-title">휴대폰 번호</div>
                  <div className="reserve-user-contents">휴대폰 번호</div>
                </div>
              </div>
              <div className="reserve-left-end">
                <Button2>결제하기</Button2>
              </div>
            </div>
          </div>
          <div className="reserve-right">
            <div className="reserve-right-container">
              <div className="reserve-right-title">
                {contentid && <div>숙소 ID: {contentid}</div>}
              </div>
              <div className="reserve-right-contents">
                {title && <div>숙소 제목: {title}</div>}
                {roomcode && <div>객실 코드: {roomcode}</div>}
                {!contentid && <div>예약 정보가 없습니다.</div>}
              </div>
            </div>
            <div className="reserve-right-container">
              <div className="reserve-right-title">결제 정보</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
