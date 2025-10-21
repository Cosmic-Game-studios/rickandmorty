import React, { useState, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin'; // Assuming Coin is MUI compatible or will be styled separately
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Characters', path: '/characters' },
  { title: 'Episodes', path: '/episodes' },
  { title: 'Locations', path: '/locations' },
  { title: 'Missions', path: '/missions' },
  { title: 'Quiz', path: '/quiz' },
  { title: 'Profile', path: '/profile' },
  { title: 'Shop', path: '/shop' },
];

function Header() {
  const { coins } = useContext(UserContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const location = useLocation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 42, 108, 0.95) 0%, rgba(74, 0, 130, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 184, 212, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 184, 212, 0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: { xs: 1, sm: 0 } }}>
        {/* Site Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            fontFamily: "'Bangers', cursive",
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            background: 'linear-gradient(135deg, #00b8d4 0%, #f0e130 50%, #00ff88 100%)',
            backgroundSize: '200% auto',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            textShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            '&:hover': {
              backgroundPosition: 'right center',
              filter: 'drop-shadow(0 0 20px rgba(0, 184, 212, 0.5))',
              transform: 'scale(1.05)',
            },
          }}
        >
          Rick and Morty Adventure
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Button
              key={link.title}
              component={RouterLink}
              to={link.path}
              onClick={handleCloseNavMenu}
              sx={{
                color: 'white',
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '8px 16px',
                border: isActive(link.path) ? '2px solid #00b8d4' : '2px solid transparent',
                backgroundColor: isActive(link.path) ? 'rgba(0, 184, 212, 0.2)' : 'transparent',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: '#00b8d4',
                  backgroundColor: 'rgba(0, 184, 212, 0.3)',
                  boxShadow: '0 0 20px rgba(0, 184, 212, 0.4)',
                  transform: 'translateY(-2px)',
                },
                marginLeft: 1,
              }}
            >
              {link.title}
            </Button>
          ))}
        </Box>

        {/* Coin Display */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(17, 25, 54, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '24px',
          border: '1px solid rgba(0, 184, 212, 0.3)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 225, 48, 0.2)',
          marginLeft: { xs: 'auto', md: 2 },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'rgba(17, 25, 54, 0.8)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 25px rgba(240, 225, 48, 0.4)',
            transform: 'scale(1.05)',
          }
        }}>
          <Coin size="medium" />
          <Typography sx={{
            marginLeft: 1,
            fontFamily: "'Bangers', cursive",
            fontSize: '1.4rem',
            background: 'linear-gradient(135deg, #f0e130 0%, #ffff6b 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 10px rgba(240, 225, 48, 0.5)',
          }}>
            {coins}
          </Typography>
        </Box>

        {/* Mobile Navigation (Hamburger Menu) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', marginLeft: 1 }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon sx={{ color: '#fff' }}/>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              '& .MuiPaper-root': {
                background: 'linear-gradient(135deg, rgba(26, 42, 108, 0.98) 0%, rgba(74, 0, 130, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 184, 212, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 184, 212, 0.2)',
              },
            }}
          >
            {navLinks.map((link) => (
              <MenuItem
                key={link.title}
                onClick={handleCloseNavMenu}
                component={RouterLink}
                to={link.path}
                sx={{
                  justifyContent: 'center',
                  color: isActive(link.path) ? '#00b8d4' : '#fff',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 'bold',
                  backgroundColor: isActive(link.path) ? 'rgba(0, 184, 212, 0.2)' : 'transparent',
                  borderRadius: '12px',
                  margin: '5px 10px',
                  border: isActive(link.path) ? '2px solid #00b8d4' : '2px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 184, 212, 0.3)',
                    boxShadow: '0 0 15px rgba(0, 184, 212, 0.4)',
                  },
                }}
              >
                {link.title}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;