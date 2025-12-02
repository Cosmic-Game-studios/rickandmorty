import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'Characters', path: '/characters' },
    { title: 'Episodes', path: '/episodes' },
    { title: 'Missions', path: '/missions' },
    { title: 'Quiz', path: '/quiz' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, rgba(20, 30, 60, 0.98) 0%, rgba(50, 20, 80, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 212, 255, 0.2)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.1)',
        mt: 'auto',
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
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Footer Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Logo & Description */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: 300 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Bangers', cursive",
                background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 50%, #ffd93d 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 1,
              }}
            >
              <Box component="span" sx={{ animation: 'spin 4s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }}>
                🌀
              </Box>
              Rick & Morty Adventure
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6 }}>
              Embark on an interdimensional adventure! Collect characters, complete missions, and become the ultimate Rick and Morty fan.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#00d4ff',
                fontWeight: 700,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
              }}
            >
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#00d4ff',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Social Links */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#00d4ff',
                fontWeight: 700,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
              }}
            >
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <IconButton
                aria-label="GitHub"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#00d4ff',
                    borderColor: '#00d4ff',
                    background: 'rgba(0, 212, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#1DA1F2',
                    borderColor: '#1DA1F2',
                    background: 'rgba(29, 161, 242, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="Reddit"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FF4500',
                    borderColor: '#FF4500',
                    background: 'rgba(255, 69, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <RedditIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
            © {currentYear} Rick and Morty Adventure. All Rights Reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#00d4ff' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                transition: 'color 0.3s ease',
                '&:hover': { color: '#00d4ff' },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>

        {/* API Credit */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            Powered by{' '}
            <Link
              href="https://rickandmortyapi.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#39ff14',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              The Rick and Morty API
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
