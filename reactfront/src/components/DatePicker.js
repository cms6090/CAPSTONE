// DatePickerComponent.js
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한글 로케일 추가
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';

// DatePicker 스타일 커스터마이즈
const CustomDatePicker = styled(DatePicker)({
  width: '100%',
  borderRadius: '5px',
  backgroundColor: 'rgb(239, 239, 239)',
  '& input': {
    fontSize: '0.8em',
    fontFamily: 'pretendard-bold',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
});

const DatePickerComponent = ({ value, onChange, disabled }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <CustomDatePicker
        views={['year', 'month', 'day']}
        value={value}
        format="YYYY-MM-DD"
        onChange={onChange} // 생년월일 업데이트
        disableFuture={true} // 오늘 이후 날짜 비활성화
        slotProps={{ calendarHeader: { format: 'YYYY MM월' }, textField: { size: 'small' } }}
        disabled={disabled} // 수정 가능 여부에 따라 disabled 속성 설정
        renderInput={(params) => (
          <input
            {...params}
            placeholder="YYYY/MM/DD"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid rgb(239, 239, 239)',
              borderRadius: '5px',
            }}
          />
        )} // 입력 필드 커스터마이즈
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
