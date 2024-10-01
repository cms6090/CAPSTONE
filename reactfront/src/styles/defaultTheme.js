import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'pretendard-regular, Arial, sans-serif', // 기본 폰트 설정
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        disableFocusRipple: true,
        disableRipple: true, // 물결 효과 비활성화
      },
      styleOverrides: {
        root: {
          fontFamily: 'pretendard-bold', // 버튼에 bold 폰트 적용
          fontSize: '0.8em',
          fontWeight: '800',
          padding: '0.8em 1em',
          borderRadius: '0.7em',
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: '#1565c0',
          borderRadius: '2px',
          borderWidth: '1px',
          borderColor: '#2196f3',
          border: '1px solid',
          backgroundColor: '#90caf9',
        },
      },
    },
  },
});
