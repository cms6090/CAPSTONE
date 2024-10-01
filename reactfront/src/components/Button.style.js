import { styled, Button } from '@mui/material';
import React from 'react';

// styled 버튼 컴포넌트 생성
export const Button1 = styled(Button)(() => ({
  fontFamily: 'pretendard-bold',
  fontSize: '0.8em',
  fontWeight: '800',
  color: 'black',
  padding: '0.8em 1em',
  border: '1px solid lightgray',
  borderRadius: '0.7em',
}));

export const Button2 = styled(Button)(() => ({
  fontFamily: 'pretendard-bold',
  fontSize: '0.8em',
  fontWeight: '800',
  color: 'white',
  padding: '0.8em 1em',
  border: '1px solid blue',
  borderRadius: '0.7em',
}));
