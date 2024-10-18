import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한글 로케일 추가
import 'react-date-range/dist/styles.css'; // 기본 스타일
import 'react-date-range/dist/theme/default.css'; // 테마 스타일
import './SearchSection.css'; // CSS 파일을 import
import { Button2 } from './Button.style';

export default function SearchSection() {
  const [showDatePicker, setShowDatePicker] = useState(false); // 날짜 선택기 표시 여부
  const [showNumPicker, setShowNumPicker] = useState(false); // 인원 선택기 표시 여부
  const [dateRange, setDateRange] = useState('날짜 선택하기'); // 날짜 범위 상태
  const [numPeople, setNumPeople] = useState(1); // 기본 인원 수
  const datePickerRef = useRef(null); // 날짜 선택기 참조
  const numPickerRef = useRef(null); // 인원 선택기 참조
  const dateInputRef = useRef(null); // 날짜 선택 input 참조
  const numInputRef = useRef(null); // 인원 선택 input 참조

  // 날짜 선택 후 호출되는 함수
  const handleDateSelect = (startDate, endDate) => {
    setDateRange(
      `${startDate.toLocaleDateString('ko-KR')} - ${endDate.toLocaleDateString('ko-KR')}`,
    );
  };

  // 외부 클릭 시 날짜 선택기 및 인원 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDatePicker = datePickerRef.current && datePickerRef.current.contains(event.target);
      const isNumPicker = numPickerRef.current && numPickerRef.current.contains(event.target);

      if (!isDatePicker && !isNumPicker) {
        setShowDatePicker(false); // 외부 클릭 시 날짜 선택기 숨기기
        setShowNumPicker(false); // 외부 클릭 시 인원 선택기 숨기기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [datePickerRef, numPickerRef]);

  return (
    <div className="search-section">
      <div className='input-container'>
        <span className="material-symbols-outlined">search</span>
        <input className="input-container" placeholder="여행지나 숙소를 검색해보세요" />
      </div>
      <div
        className="input-container"
        onClick={() => {
          setShowDatePicker((prev) => !prev); // 클릭 시 날짜 선택기 표시/숨기기
          setShowNumPicker(false); // 날짜 선택 시 인원 선택기 숨기기
        }}
      >
        <span className="material-icons calendar-icon">today</span>
        <input
          type="text"
          className="date-range-input"
          value={dateRange}
          readOnly
          style={{ color: dateRange === '날짜 선택하기' ? 'gray' : 'black' }} // 초기값일 때 색상 변경
          ref={dateInputRef} // 날짜 선택 input 참조 추가
        />
      </div>

      <div
        ref={datePickerRef}
        className="date-picker-wrapper"
        style={{
          display: showDatePicker ? 'block' : 'none', // showDatePicker에 따라 표시
          position: 'absolute',
          top: '115%',
          left: '30%', // input 왼쪽 정렬
          zIndex: 1000,
        }}
      >
        <DateRangePickerComponent onDateSelect={handleDateSelect} />
      </div>

      <div
        className="input-container"
        onClick={() => {
          setShowNumPicker((prev) => !prev); // 클릭 시 인원 선택기 표시/숨기기
          setShowDatePicker(false); // 인원 선택 시 날짜 선택기 숨기기
        }}
      >
        <span className="material-symbols-outlined">person</span>
        <input
          type="text"
          className="date-range-input"
          value={`인원 ${numPeople}`} // 선택된 인원 수 표시
          readOnly
          style={{ color: numPeople === 1 ? 'gray' : 'black' }} // 초기값일 때 색상 변경
          ref={numInputRef} // 인원 선택 input 참조 추가
        />
      </div>

      <div
        ref={numPickerRef}
        className="num-picker-wrapper"
        style={{
          display: showNumPicker ? 'block' : 'none', // showNumPicker에 따라 표시
          position: 'absolute',
          top: '115%',
          left: '60%', // input 왼쪽 정렬
          zIndex: 1000,
          width: '25%', // 원하는 너비 설정
        }}
      >
        <NumPicker onNumSelect={setNumPeople} /> {/* 인원 수 선택 후 상태 업데이트 */}
      </div>

      <div >
        <Button2>검색</Button2>
      </div>
    </div>
  );
}

// DateRangePickerComponent 정의
function DateRangePickerComponent({ onDateSelect }) {
  const today = new Date();
  const oneMonthLater = addDays(today, 60); // 오늘 날짜부터 2달 후

  const [state, setState] = useState([
    {
      startDate: today,
      endDate: addDays(today, 7),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    // 선택된 날짜가 2달 이내인지 확인
    if (isAfter(endDate, addDays(startDate, 60))) {
      alert('선택 가능한 날짜 범위는 최대 2개월입니다.');
      return;
    }

    setState([ranges.selection]);
    onDateSelect(startDate, endDate); // 부모 컴포넌트에 날짜 전달
  };

  return (
    <div style={{ border: '1px solid lightgray', borderRadius: '3px' }}>
      <DateRange
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        locale={ko} // 한글 로케일 설정
        minDate={today} // 오늘 이후의 날짜만 선택 가능
        maxDate={oneMonthLater} // 오늘부터 2달 후까지만 선택 가능
        monthDisplayFormat="yyyy년 MMM"
      />
    </div>
  );
}

// NumPicker 정의
function NumPicker({ onNumSelect }) {
  const [count, setCount] = useState(1); // 기본 인원 수

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount); // 인원 수 증가
    onNumSelect(newCount); // 부모 컴포넌트에 인원 수 전달
  };

  const decrement = () => {
    const newCount = count > 1 ? count - 1 : 1; // 인원 수 감소
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
          <button className="control-button" onClick={decrement} disabled={count <= 1}>
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
