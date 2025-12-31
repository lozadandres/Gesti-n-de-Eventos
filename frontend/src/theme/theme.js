import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(180, 260, 70)', // Neon Green from original design
      contrastText: '#0a0a0a',
    },
    secondary: {
      main: '#d500f9', // Neon Purple/Pink
    },
    background: {
      default: '#0f0c29', // Deep dark purple/blue
      paper: 'rgba(255, 255, 255, 0.05)', // Glassy effect base
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none', // Modern feel
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(180, 260, 70, 0.39)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 6px 20px rgba(180, 260, 70, 0.23)',
          },
        },
        contained: {
            background: 'linear-gradient(45deg, #b4ff46 30%, #69ff97 90%)',
            color: '#000',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(180, 260, 70, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgb(180, 260, 70)',
                    },
                },
            }
        }
    }
  },
});

export default theme;
