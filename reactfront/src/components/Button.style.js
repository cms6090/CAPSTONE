import { styled, Button } from '@mui/material';
import React from 'react';

// styled 버튼 컴포넌트 생성
export const Button1 = styled(Button)(() => ({
  fontSize: '0.8em',
  fontWeight: '800',
  color: 'black',
  padding: '0.8em 1em',
  border: '1px solid lightgray',
  borderRadius: '0.7em',
  '&:hover':{
    backgroundColor: 'rgba(0,0,0,0.1)', // 마우스 오버 시 배경색 변경
  }
}));

export const Button2 = styled(Button)(() => ({
  fontSize: '0.8em',
  fontWeight: '800',
  color: 'white',
  padding: '0.8em 1em',
  border: '1px solid blue',
  borderRadius: '0.7em',
}));

export const Button3 = styled(Button)(() => ({
  fontSize: '0.8em',
  fontFamily: 'pretendard-light',
  fontWeight: '800',
  padding: '0.3em 1em',
  color: 'black',
  border: '1px solid lightgray',
  borderRadius: '15px',
}));
