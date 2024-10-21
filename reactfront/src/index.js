import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material';
import './styles/font.css';
import { theme } from './styles/defaultTheme';

// Naver 지도 API 스크립트 추가
const addNaverMapScript = () => {
  const script = document.createElement('script');
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_API_KEY}&submodules=geocoder,drawing&language=ko`;
  script.async = true;
  document.body.appendChild(script);
};

// 스크립트 추가 함수 호출
addNaverMapScript();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
);

reportWebVitals();
