import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale'; // Import the Korean locale
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme style file
import './DatePicker.module.css'; // Your custom styles

const SearchSection = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: null,
    endDate: null,
    key: 'selection',
  });
  const [isStartDate, setIsStartDate] = useState(true); // Track if selecting start date

  // Handle the selection of dates
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
  
    // Check if endDate is before startDate, and swap them if necessary
    if (endDate && startDate && endDate < startDate) {
      setSelectionRange({
        startDate: endDate,  // Swap dates
        endDate: startDate,
        key: 'selection',
      });
    } else {
      setSelectionRange({
        startDate: startDate,
        endDate: endDate || startDate, // If no endDate, set it to startDate
        key: 'selection',
      });
    }
  
    if (!isStartDate) {
      setShowDatePicker(false); // Close the date picker after selecting the end date
    }
  
    // Toggle date selection mode between start and end date
    setIsStartDate(!isStartDate);
  };

  // Handle Start Date selection click
  const handleStartDateClick = () => {
    setIsStartDate(true);
    setShowDatePicker(true);
  };

  // Handle End Date selection click
  const handleEndDateClick = () => {
    if (selectionRange.startDate) {
      setIsStartDate(false);
      setShowDatePicker(true);
    }
  };

  return (
    <section
      className="search-section py-5 text-white text-center"
      style={{
        backgroundImage: "url('https://static.yeogi.com/_next/static/media/05_Kv_PC_Light.3deeaa46.webp')",
        backgroundSize: 'cover',
        minHeight: '460px',
      }}
    >
      <div className="container">
        <h1 className="display-4">Find Your Dream Destination</h1>
        <div className="bg-white p-4 rounded shadow-sm mt-4">
          <div className="d-flex justify-content-center mb-3">
            <button className="btn btn-primary me-2 active">국내 숙소</button>
            <button className="btn btn-outline-primary">해외 숙소</button>
          </div>
          <form className="row g-2 justify-content-center">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="여행지나 숙소를 검색해보세요." />
            </div>

            {/* Start Date Input */}
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                value={
                    selectionRange.startDate && selectionRange.endDate
                      ? `${selectionRange.startDate.toLocaleDateString('ko-KR')} - ${selectionRange.endDate.toLocaleDateString('ko-KR')}`
                      : '날짜 선택하기'
                  }
                onClick={handleStartDateClick}
                readOnly
              />
            </div>

            {/* End Date Input
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                value={
                    selectionRange.startDate && selectionRange.endDate
                      ? `${selectionRange.startDate.toLocaleDateString('ko-KR')} - ${selectionRange.endDate.toLocaleDateString('ko-KR')}`
                      : '날짜 선택하기'
                  }
                // value={selectionRange.endDate ? selectionRange.endDate.toLocaleDateString('ko-KR') : '종료일 선택'}
                onClick={handleEndDateClick}
                readOnly
              />
            </div> */}

            <div className="col-md-2">
              <select className="form-select">
                <option>1 Guest</option>
                <option>2 Guests</option>
                {/* More options */}
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Search
              </button>
            </div>
          </form>

          {/* Date Picker Popup */}
          {showDatePicker && (
            <div className="date-picker-popup">
              <DateRange
                ranges={[selectionRange]}
                onChange={handleSelect}
                months={2}
                direction="horizontal"
                showDateDisplay={false}
                rangeColors={['#007bff']}
                minDate={new Date()}
                locale={ko} // Set Korean locale
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
