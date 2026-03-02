import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#324BFF',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Montserrat', Arial, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.08em',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#F7F7F7',
        },
      },
    },
  },
});

export default theme;
