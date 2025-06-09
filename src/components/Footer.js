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
        // Replicating the gradient from Header or using theme's palette
        background: 'linear-gradient(90deg, #4b0082, #9400d3)',
        color: 'rgba(255, 255, 255, 0.8)', // var(--text-secondary)
        textAlign: 'center',
        paddingY: 3, // py: 3 (MUI spacing unit, 1 = 8px, so 3*8=24px which is close to 0.9375rem * 1.5 for top/bottom)
        fontSize: '0.9rem',
        boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.3)', // 0 -0.25rem 0.5rem
        mt: 'auto', // Pushes footer to bottom if main content is short
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
                color: 'inherit', // var(--text-secondary)
                textDecoration: 'none',
                '&:hover': {
                  color: '#f0e130', // var(--accent-color)
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: '#f0e130',
                },
              }}
            >
              Terms of Service
            </Link>
            <Link
              component={RouterLink}
              to="/contact"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: '#f0e130',
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