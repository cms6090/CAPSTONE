import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePickerComponent({
  onDateSelect,
  initialStartDate,
  initialEndDate,
  disabled,
}) {
  const today = startOfDay(new Date());
  const oneMonthLater = addDays(today, 60);

  const [state, setState] = useState([
    {
      startDate: initialStartDate ? new Date(initialStartDate) : today, // 문자열일 경우 Date 객체로 변환
      endDate: initialEndDate ? new Date(initialEndDate) : addDays(today, 7), // 문자열일 경우 Date 객체로 변환
      key: 'selection',
    },
  ]);

  useEffect(() => {
    setState([
      {
        startDate: initialStartDate ? new Date(initialStartDate) : today,
        endDate: initialEndDate ? new Date(initialEndDate) : addDays(today, 7),
        key: 'selection',
      },
    ]);
    if (onDateSelect && initialStartDate && initialEndDate) {
      onDateSelect(new Date(initialStartDate), new Date(initialEndDate));
    }
  }, [initialStartDate, initialEndDate]);

  const handleSelect = (ranges) => {
    if (disabled) return;

    const { startDate, endDate } = ranges.selection;

    if (isAfter(endDate, oneMonthLater) || isBefore(startDate, today)) {
      alert('선택 가능한 날짜 범위는 오늘부터 최대 2개월 이내입니다.');
      return;
    }

    setState([ranges.selection]);
    if (onDateSelect) {
      onDateSelect(startDate, endDate);
    }
  };

  return (
    <div style={{ border: '1px solid lightgray', borderRadius: '3px', width: 'fit-content' }}>
      <DateRange
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        locale={ko}
        minDate={today}
        maxDate={oneMonthLater}
        monthDisplayFormat="yyyy년 MMM"
      />
    </div>
  );
}
