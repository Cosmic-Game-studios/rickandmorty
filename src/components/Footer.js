import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link'; // MUI Link

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 42, 108, 0.95) 0%, rgba(74, 0, 130, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        paddingY: 3,
        fontSize: '0.9rem',
        borderTop: '1px solid rgba(0, 184, 212, 0.2)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 184, 212, 0.1)',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            gap: 2, // var(--space-md)
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            © {currentYear} Rick and Morty Adventure | All Rights Reserved
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2, // var(--space-md)
              justifyContent: 'center',
            }}
          >
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: '#00b8d4',
                  background: 'rgba(0, 184, 212, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 184, 212, 0.3)',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: '#00b8d4',
                  background: 'rgba(0, 184, 212, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 184, 212, 0.3)',
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: '#00b8d4',
                  background: 'rgba(0, 184, 212, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 184, 212, 0.3)',
                },
              }}
            >
              Contact Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;