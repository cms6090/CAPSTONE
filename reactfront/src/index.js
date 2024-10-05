import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material';
import './styles/font.css';
import { theme } from './styles/defaultTheme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </ThemeProvider>,
);

reportWebVitals();
