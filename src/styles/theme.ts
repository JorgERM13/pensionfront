import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 16,
    button: {
      fontSize: '1rem',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#d32f2f' },
  },
});

export default theme;