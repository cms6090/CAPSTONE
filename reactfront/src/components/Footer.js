import React from 'react';
import './Footer.css'; // CSS 스타일을 위한 파일
import { Button1 } from './Button.style';
import { HiMiniChatBubbleOvalLeft } from 'react-icons/hi2';
import { IoIosCall } from 'react-icons/io';

const Footer = () => {
  // 버튼에 적용할 공통 스타일 정의
  const buttonStyle = {
    color: 'rgb(140, 139, 139)',
    fontSize: '0.9em',
    marginRight: '2%',
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* 고객센터 섹션 */}
        <div className="customer-service">
          <h3>고객센터</h3>
          <p>고객행복센터(전화): 오전 9시 ~ 새벽 3시 운영</p>
          <p>카카오톡 문의: 24시간 운영</p>
          <p>
            전화: <span className="phone-number">00-0000-0000</span>
          </p>
          <p>
            <Button1 style={buttonStyle}>
              <IoIosCall style={{ marginRight: '10px' }} />
              전화 문의
            </Button1>
            <Button1 style={buttonStyle}>
              <HiMiniChatBubbleOvalLeft style={{ marginRight: '10px' }} />
              카카오 문의
            </Button1>
          </p>
        </div>
        {/* 서비스 관련 섹션 */}
        <div className="service">
          <h3>서비스</h3>
          <p>
            <a href="/notices">공지사항</a>
          </p>
          <p>
            <a href="/faq">자주 묻는 질문</a>
          </p>
        </div>
        {/* 모든 여행 섹션 */}
        <div className="travel">
          <h3>모든 여행</h3>
          <p>
            <a href="/">국내숙소</a>
          </p>
        </div>
      </div>
      {/* 푸터 하단 섹션 */}
      <div className="footer-bottom">
        <p>© 2024 DJ COMPANY Corp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
