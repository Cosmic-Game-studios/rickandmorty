import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import TvIcon from '@mui/icons-material/Tv';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

const navLinks = [
  { title: 'Home', path: '/', icon: <HomeIcon /> },
  { title: 'Characters', path: '/characters', icon: <GroupIcon /> },
  { title: 'Episodes', path: '/episodes', icon: <TvIcon /> },
  { title: 'Locations', path: '/locations', icon: <PublicIcon /> },
  { title: 'Missions', path: '/missions', icon: <AssignmentIcon /> },
  { title: 'Quiz', path: '/quiz', icon: <QuizIcon /> },
  { title: 'Shop', path: '/shop', icon: <StoreIcon /> },
  { title: 'Profile', path: '/profile', icon: <PersonIcon /> },
];

function Header() {
  const { coins = 0, level = 1 } = useContext(UserContext) || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const formatCoins = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, rgba(20, 30, 60, 0.98) 0%, rgba(5, 8, 16, 0.98) 100%)',
        color: '#fff',
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Bangers', cursive",
            background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rick & Morty
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Stats Section */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Chip
          icon={<StarIcon sx={{ color: '#ffd93d !important' }} />}
          label={`Level ${level}`}
          sx={{
            background: 'rgba(255, 217, 61, 0.15)',
            border: '1px solid rgba(255, 217, 61, 0.3)',
            color: '#ffd93d',
            fontWeight: 600,
          }}
        />
        <Chip
          label={`${formatCoins(coins)} Coins`}
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(57, 255, 20, 0.2) 100%)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00d4ff',
            fontWeight: 600,
            '&::before': {
              content: '"🪙"',
              marginRight: '4px',
            },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Navigation Links */}
      <List sx={{ p: 1 }}>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.path}
              selected={isActive(link.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(57, 255, 20, 0.1) 100%)',
                  borderLeft: '3px solid #00d4ff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(57, 255, 20, 0.15) 100%)',
                  },
                },
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(link.path) ? '#00d4ff' : 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.title}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive(link.path) ? 600 : 400,
                    color: isActive(link.path) ? '#00d4ff' : '#fff',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: scrolled
          ? 'linear-gradient(135deg, rgba(20, 30, 60, 0.98) 0%, rgba(50, 20, 80, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(20, 30, 60, 0.95) 0%, rgba(50, 20, 80, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 212, 255, 0.15)'
          : '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Logo */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            mr: 3,
          }}
        >
          <Box
            sx={{
              fontSize: '1.8rem',
              mr: 1,
              animation: 'spin 4s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            🌀
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Bangers', cursive",
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 50%, #ffd93d 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.05em',
              textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
              animation: 'shimmer 3s linear infinite',
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '0% center' },
                '100%': { backgroundPosition: '200% center' },
              },
            }}
          >
            Rick & Morty
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={RouterLink}
              to={link.path}
              startIcon={link.icon}
              sx={{
                color: isActive(link.path) ? '#00d4ff' : 'rgba(255, 255, 255, 0.85)',
                fontWeight: isActive(link.path) ? 600 : 400,
                fontSize: '0.85rem',
                px: 1.5,
                py: 1,
                borderRadius: 2,
                position: 'relative',
                transition: 'all 0.3s ease',
                background: isActive(link.path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.15)',
                  color: '#00d4ff',
                  transform: 'translateY(-2px)',
                },
                '&::after': isActive(link.path)
                  ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
                      borderRadius: '1px',
                    }
                  : {},
              }}
            >
              {link.title}
            </Button>
          ))}
        </Box>

        {/* Stats Display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          {/* Level Badge */}
          <Chip
            icon={<StarIcon sx={{ color: '#ffd93d !important', fontSize: '1rem' }} />}
            label={`Lv.${level}`}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: 'rgba(255, 217, 61, 0.15)',
              border: '1px solid rgba(255, 217, 61, 0.3)',
              color: '#ffd93d',
              fontWeight: 700,
              fontSize: '0.8rem',
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />

          {/* Coin Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(57, 255, 20, 0.1) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: 3,
              px: 1.5,
              py: 0.5,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'coinShine 3s ease-in-out infinite',
              },
              '@keyframes coinShine': {
                '0%': { left: '-100%' },
                '50%, 100%': { left: '100%' },
              },
            }}
          >
            <Box sx={{ fontSize: '1.1rem' }}>🪙</Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatCoins(coins)}
            </Typography>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              display: { lg: 'none' },
              color: '#00d4ff',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: 2,
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.15)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header;
