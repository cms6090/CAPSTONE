import React, { useState, useRef, useEffect, useContext } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한글 로케일 추가
import 'react-date-range/dist/styles.css'; // 기본 스타일
import 'react-date-range/dist/theme/default.css'; // 테마 스타일
import './SearchSection.css'; // CSS 파일을 import
import { Button2 } from './Button.style';
import NumPicker from './NumPicker';
import { SearchContext } from './SearchContext';

export default function SearchSection() {
  const { startDate, setStartDate, endDate, setEndDate, numPeople, setNumPeople } =
    useContext(SearchContext); // Destructure the context values
  const [showDatePicker, setShowDatePicker] = useState(false); // 날짜 선택기 표시 여부
  const [showNumPicker, setShowNumPicker] = useState(false); // 인원 선택기 표시 여부
  const [dateRange, setDateRange] = useState(''); // 날짜 범위 상태
  const [keyword, setKeyword] = useState(''); // 검색어 상태 추가
  const datePickerRef = useRef(null); // 날짜 선택기 참조
  const numPickerRef = useRef(null); // 인원 선택기 참조
  const dateInputRef = useRef(null); // 날짜 선택 input 참조
  const numInputRef = useRef(null); // 인원 선택 input 참조

  // 날짜 선택 후 호출되는 함수
  const handleDateSelect = (start, end) => {
    setDateRange(`${start.toLocaleDateString('ko-KR')} - ${end.toLocaleDateString('ko-KR')}`);
    setStartDate(start); // 시작 날짜 저장
    setEndDate(end); // 종료 날짜 저장
  };

  // 컴포넌트가 처음 렌더링될 때 기본 날짜(오늘과 내일) 설정
  useEffect(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    handleDateSelect(today, tomorrow); // 기본 날짜를 설정
  }, []);

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

  // 검색 버튼 클릭 시 이동
  const handleSearch = () => {
    const encodedKeyword = encodeURIComponent(keyword); // 검색어 인코딩
    const checkIn = startDate ? startDate.toISOString().split('T')[0] : ''; // 시작 날짜, 없으면 빈 값
    const checkOut = endDate ? endDate.toISOString().split('T')[0] : ''; // 종료 날짜, 없으면 빈 값
    const personal = numPeople || 1; // 인원 수가 없으면 기본값 1

    // URL 생성
    const searchUrl = `http://localhost:3005/accommodations?keyword=${encodedKeyword}&checkIn=${checkIn}&checkOut=${checkOut}&personal=${personal}`;

    console.log('Generated URL:', searchUrl); // 로그로 URL을 확인

    window.location.href = searchUrl; // 페이지 이동
  };

  return (
    <div className="search-section">
      <div className="input-container">
        <span className="material-symbols-outlined">search</span>
        <input
          className="input-container"
          placeholder="여행지나 숙소를 검색해보세요"
          value={keyword} // 입력 필드의 값은 keyword 상태로
          onChange={(e) => setKeyword(e.target.value)} // 사용자가 입력한 값을 상태로 저장
        />
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
          value={dateRange} // 선택된 날짜 범위 표시
          readOnly
          style={{ color: dateRange === '' ? 'gray' : 'black' }} // 초기값일 때 색상 변경
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

      <div>
        <Button2 onClick={handleSearch}>검색</Button2> {/* 버튼 클릭 시 handleSearch 호출 */}
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
      endDate: addDays(today, 1),
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
