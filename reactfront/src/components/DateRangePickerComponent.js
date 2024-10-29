import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePickerComponent({ onDateSelect, initialStartDate, initialEndDate }) {
  const today = startOfDay(new Date());
  const oneMonthLater = addDays(today, 60);

  const [state, setState] = useState([
    {
      startDate: initialStartDate || today,
      endDate: initialEndDate || addDays(today, 7),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    setState([{
      startDate: initialStartDate || today,
      endDate: initialEndDate || addDays(today, 7),
      key: 'selection',
    }]);
    // 총 가격을 계산하기 위해 초기 날짜 선택 시 onDateSelect 호출
    if (initialStartDate && initialEndDate) {
      onDateSelect(initialStartDate, initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    // 선택된 날짜가 오늘부터 최대 2개월 내인지 확인
    if (isAfter(endDate, oneMonthLater) || isBefore(startDate, today)) {
      alert('선택 가능한 날짜 범위는 오늘부터 최대 2개월 이내입니다.');
      return;
    }

    setState([ranges.selection]);
    onDateSelect(startDate, endDate); // 부모 컴포넌트에 날짜 전달
  };

  return (
    <div style={{ border: '1px solid lightgray', borderRadius: '3px', padding: '10px' }}>
      <DateRange
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        locale={ko} // 한글 로케일 설정
        minDate={today}
        maxDate={oneMonthLater}
        monthDisplayFormat="yyyy년 MMM"
      />
    </div>
  );
}
