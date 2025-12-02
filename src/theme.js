import { createTheme } from '@mui/material/styles';

// Modern Rick and Morty Interdimensional Theme 2.0
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      light: '#5ce1ff',
      dark: '#00a3cc',
      contrastText: '#050810',
    },
    secondary: {
      main: '#ffd93d',
      light: '#ffe566',
      dark: '#e6c235',
      contrastText: '#050810',
    },
    error: {
      main: '#ff5252',
      light: '#ff7b7b',
      dark: '#c50e29',
    },
    warning: {
      main: '#ffab40',
      light: '#ffc570',
      dark: '#c77c02',
    },
    success: {
      main: '#00e676',
      light: '#66ffa6',
      dark: '#00b248',
    },
    info: {
      main: '#40c4ff',
      light: '#73d8ff',
      dark: '#0094cc',
    },
    background: {
      default: '#050810',
      paper: 'rgba(15, 23, 42, 0.85)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.75)',
      disabled: 'rgba(255, 255, 255, 0.35)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    // Custom Rick and Morty colors
    portal: {
      main: '#39ff14',
      glow: 'rgba(57, 255, 20, 0.5)',
    },
    cosmic: {
      purple: '#764ba2',
      pink: '#f093fb',
      blue: '#667eea',
    },
    rarity: {
      common: '#9e9e9e',
      uncommon: '#4caf50',
      rare: '#2196f3',
      epic: '#9c27b0',
      legendary: '#ff9800',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontFamily: "'Bangers', cursive",
      fontSize: '3.5rem',
      fontWeight: 400,
      letterSpacing: '0.03em',
      background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 50%, #00d4ff 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontFamily: "'Bangers', cursive",
      fontSize: '2.5rem',
      fontWeight: 400,
      letterSpacing: '0.03em',
      color: '#00d4ff',
      textShadow: '0 0 20px rgba(0, 212, 255, 0.6)',
    },
    h3: {
      fontFamily: "'Bangers', cursive",
      fontSize: '2rem',
      fontWeight: 400,
      letterSpacing: '0.03em',
      color: '#ffd93d',
      textShadow: '0 0 15px rgba(255, 217, 61, 0.5)',
    },
    h4: {
      fontFamily: "'Bangers', cursive",
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h6: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
      fontSize: '1.125rem',
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
      color: 'rgba(255, 255, 255, 0.75)',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      color: 'rgba(255, 255, 255, 0.75)',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.25)',
    '0 4px 12px rgba(0, 0, 0, 0.3)',
    '0 6px 16px rgba(0, 0, 0, 0.35)',
    '0 8px 20px rgba(0, 0, 0, 0.4)',
    '0 10px 24px rgba(0, 0, 0, 0.45)',
    '0 12px 28px rgba(0, 0, 0, 0.5)',
    '0 14px 32px rgba(0, 0, 0, 0.55)',
    '0 16px 36px rgba(0, 0, 0, 0.6)',
    '0 18px 40px rgba(0, 0, 0, 0.65)',
    '0 20px 44px rgba(0, 0, 0, 0.7)',
    '0 22px 48px rgba(0, 0, 0, 0.75)',
    '0 24px 52px rgba(0, 0, 0, 0.8)',
    // Glow shadows
    '0 0 20px rgba(0, 212, 255, 0.4)', // Primary glow
    '0 0 30px rgba(0, 212, 255, 0.5)', // Strong primary glow
    '0 0 40px rgba(0, 212, 255, 0.6)', // Intense primary glow
    '0 0 20px rgba(255, 217, 61, 0.4)', // Secondary glow
    '0 0 30px rgba(57, 255, 20, 0.5)', // Portal green glow
    // Combined shadows
    '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)', // Card shadow
    '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.15)', // Card hover
    '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 212, 255, 0.3)', // Button glow
    '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 35px rgba(0, 212, 255, 0.4)', // Strong button glow
    '0 16px 64px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 212, 255, 0.5)', // Maximum glow
    'inset 0 2px 8px rgba(0, 0, 0, 0.3)', // Inset shadow
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#050810',
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 70%),
            linear-gradient(180deg, #1a1f35 0%, #0a0f1a 50%, #050810 100%)
          `,
          backgroundAttachment: 'fixed',
          scrollBehavior: 'smooth',
        },
        '::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '::-webkit-scrollbar-track': {
          background: '#0a0f1a',
          borderRadius: '9999px',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, #00d4ff 0%, #00a3cc 100%)',
          borderRadius: '9999px',
          border: '2px solid #0a0f1a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5ce1ff 0%, #00d4ff 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 35px rgba(0, 212, 255, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #ffd93d 0%, #ffab40 50%, #ffd93d 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 217, 61, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffe566 0%, #ffd93d 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 35px rgba(255, 217, 61, 0.5)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#00d4ff',
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(0, 212, 255, 0.15)',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
          },
        },
        text: {
          '&:hover': {
            background: 'rgba(0, 212, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(0, 212, 255, 0.3)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.15)',
          },
        },
        elevation1: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(20, 30, 55, 0.9) 0%, rgba(10, 18, 35, 0.95) 100%)',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-6px)',
            borderColor: 'rgba(0, 212, 255, 0.3)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.15)',
            '&::before': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.95) 0%, rgba(50, 20, 80, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)',
            },
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4ff',
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
            boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
        },
        filledSecondary: {
          background: 'linear-gradient(135deg, #ffd93d 0%, #e6c235 100%)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: 9999,
          background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 100%)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#00d4ff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 230, 118, 0.15)',
          borderLeft: '4px solid #00e676',
        },
        standardError: {
          backgroundColor: 'rgba(255, 82, 82, 0.15)',
          borderLeft: '4px solid #ff5252',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 171, 64, 0.15)',
          borderLeft: '4px solid #ffab40',
        },
        standardInfo: {
          backgroundColor: 'rgba(64, 196, 255, 0.15)',
          borderLeft: '4px solid #40c4ff',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.98) 0%, rgba(50, 20, 80, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.2)',
          borderRadius: 12,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 212, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 212, 255, 0.4)',
            },
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(0, 212, 255, 0.2)',
              borderColor: '#00d4ff',
            },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
              color: '#050810',
              '&:hover': {
                background: 'linear-gradient(135deg, #5ce1ff 0%, #00d4ff 100%)',
              },
            },
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
        arrow: {
          color: 'rgba(15, 23, 42, 0.95)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});

export default theme;
