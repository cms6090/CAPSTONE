import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePickerComponent({ onDateSelect }) {
  const today = new Date();
  const oneMonthLater = addDays(today, 60);

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
        minDate={today}
        maxDate={oneMonthLater}
        monthDisplayFormat="yyyy년 MMM"
      />
    </div>
  );
}
