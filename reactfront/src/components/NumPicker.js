import React, { useState } from 'react';

export default function NumPicker({ onNumSelect }) {
  const [count, setCount] = useState(1); // 기본 인원 수

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    onNumSelect(newCount); // 부모 컴포넌트에 인원 수 전달
  };

  const decrement = () => {
    const newCount = count > 0 ? count - 1 : 0; // 인원 수 감소
    setCount(newCount);
    onNumSelect(newCount); // 부모 컴포넌트에 인원 수 전달
  };

  return (
    <div className="people-selector">
      <div className="people-header">
        <span className="count-text">인원 {count}</span>
      </div>
      <div className="details">
        <div className="description">유아 및 아동도 인원수에 포함해주세요.</div>
        <div className="controls">
          <button className="control-button" onClick={decrement}>
            <span className="material-symbols-outlined num-control">remove</span>
          </button>
          <span className="count">{count}</span>
          <button className="control-button" onClick={increment}>
            <span className="material-symbols-outlined num-control">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
