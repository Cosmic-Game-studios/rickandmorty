import { createTheme } from '@mui/material/styles';

// Modern Rick and Morty inspired theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b8d4', // Cyan - Portal color
      light: '#62efff',
      dark: '#0088a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f0e130', // Rick's drool yellow
      light: '#ffff6b',
      dark: '#b8b000',
      contrastText: '#000000',
    },
    error: {
      main: '#ff1744',
      light: '#ff616f',
      dark: '#c4001d',
    },
    warning: {
      main: '#ff9100',
      light: '#ffc246',
      dark: '#c56200',
    },
    success: {
      main: '#00e676',
      light: '#66ffa6',
      dark: '#00b248',
    },
    info: {
      main: '#00b8d4',
      light: '#62efff',
      dark: '#0088a3',
    },
    background: {
      default: '#0a0e27', // Deep space blue-black
      paper: 'rgba(17, 25, 54, 0.95)', // Glassmorphism background
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    // Custom colors for Rick and Morty theme
    portal: {
      main: '#00ff88',
      glow: '#00ff88',
    },
    rick: {
      labCoat: '#e8f5f7',
      hair: '#89cff0',
    },
    morty: {
      shirt: '#ffd700',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Bangers', cursive",
      fontSize: '3.5rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
      textShadow: '0 0 20px rgba(0, 184, 212, 0.5)',
    },
    h2: {
      fontFamily: "'Bangers', cursive",
      fontSize: '2.75rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
      textShadow: '0 0 15px rgba(0, 184, 212, 0.3)',
    },
    h3: {
      fontFamily: "'Bangers', cursive",
      fontSize: '2.25rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: "'Bangers', cursive",
      fontSize: '1.75rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h6: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12, // More modern rounded corners
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.1)',
    '0 4px 8px rgba(0, 0, 0, 0.15)',
    '0 6px 12px rgba(0, 0, 0, 0.2)',
    '0 8px 16px rgba(0, 0, 0, 0.25)',
    '0 10px 20px rgba(0, 0, 0, 0.3)',
    '0 12px 24px rgba(0, 0, 0, 0.35)',
    '0 14px 28px rgba(0, 0, 0, 0.4)',
    '0 16px 32px rgba(0, 0, 0, 0.45)',
    '0 18px 36px rgba(0, 0, 0, 0.5)',
    '0 20px 40px rgba(0, 0, 0, 0.55)',
    '0 22px 44px rgba(0, 0, 0, 0.6)',
    '0 24px 48px rgba(0, 0, 0, 0.65)',
    '0 2px 8px rgba(0, 184, 212, 0.3)', // Cyan glow
    '0 4px 16px rgba(0, 184, 212, 0.4)', // Medium cyan glow
    '0 8px 24px rgba(0, 184, 212, 0.5)', // Strong cyan glow
    '0 0 20px rgba(240, 225, 48, 0.4)', // Yellow glow
    '0 0 30px rgba(0, 255, 136, 0.5)', // Portal green glow
    'inset 0 2px 8px rgba(0, 0, 0, 0.3)', // Inset shadow
    'inset 0 4px 12px rgba(0, 0, 0, 0.4)', // Deep inset shadow
    '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 184, 212, 0.2)', // Combined shadow + glow
    '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 184, 212, 0.3)', // Strong combined
    '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 35px rgba(0, 184, 212, 0.4)', // Very strong combined
    '0 16px 64px rgba(0, 0, 0, 0.6), 0 0 45px rgba(0, 184, 212, 0.5)', // Maximum depth + glow
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(ellipse at top, #1a2a6c 0%, #0a0e27 50%, #000000 100%)',
          backgroundAttachment: 'fixed',
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 184, 212, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00b8d4 0%, #0088a3 100%)',
          boxShadow: '0 4px 16px rgba(0, 184, 212, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #62efff 0%, #00b8d4 100%)',
            boxShadow: '0 8px 24px rgba(0, 184, 212, 0.5)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(0, 184, 212, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 25, 54, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(0, 184, 212, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 184, 212, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 25, 54, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            border: '1px solid rgba(0, 184, 212, 0.4)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 184, 212, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(26, 42, 108, 0.95) 0%, rgba(74, 0, 130, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 184, 212, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 184, 212, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(17, 25, 54, 0.6)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(17, 25, 54, 0.8)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(17, 25, 54, 0.9)',
              boxShadow: '0 0 20px rgba(0, 184, 212, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 184, 212, 0.3)',
          },
        },
      },
    },
  },
});

export default theme;
