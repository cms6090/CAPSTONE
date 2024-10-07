import React from 'react';
import './Modal.css'; // 모달 스타일을 위한 CSS 파일

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <div style={{ fontSize: '1.1em', margin: '0% 1%' }}>지도</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
