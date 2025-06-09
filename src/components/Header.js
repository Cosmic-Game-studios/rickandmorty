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
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #4b0082, #9400d3)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: { xs: 1, sm: 0 } }}>
        {/* Site Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            fontFamily: "'Bangers', cursive",
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            color: '#f0e130',
            textDecoration: 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            '&:hover': {
              color: '#fff',
              textShadow: '0 0 10px #f0e130',
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
                border: isActive(link.path) ? '2px solid #f0e130' : '2px solid transparent',
                backgroundColor: isActive(link.path) ? 'rgba(240, 225, 48, 0.3)' : 'transparent',
                '&:hover': {
                  borderColor: '#f0e130',
                  backgroundColor: 'rgba(240, 225, 48, 0.2)',
                },
                marginLeft: 1,
              }}
            >
              {link.title}
            </Button>
          ))}
        </Box>

        {/* Coin Display */}
        <Box sx={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '5px 12px', borderRadius: '20px', boxShadow: 'inset 0 0 5px rgba(0,0,0,0.3)', marginLeft: { xs: 'auto', md: 2 } }}>
          <Coin size="medium" /> {/* Ensure Coin component is compatible */}
          <Typography sx={{ marginLeft: 1, fontFamily: "'Bangers', cursive", fontSize: '1.4rem', color: '#f0e130' }}>
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
                background: 'linear-gradient(180deg, #4b0082, #9400d3)',
                boxShadow: '0 8px 10px rgba(0,0,0,0.3)',
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
                  color: isActive(link.path) ? '#f0e130' : '#fff',
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 'bold',
                  backgroundColor: isActive(link.path) ? 'rgba(240, 225, 48, 0.3)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(240, 225, 48, 0.2)',
                  },
                  margin: '5px 10px',
                  borderRadius: '5px',
                  border: isActive(link.path) ? '2px solid #f0e130' : '2px solid transparent',

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