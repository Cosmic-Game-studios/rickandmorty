import React, {
  useContext,
  useMemo,
  lazy,
  Suspense,
  // useState, // No longer directly needed for isMobile state here
  // useEffect, // No longer directly needed for isMobile effect here
  // useCallback // No longer directly needed for isMobile callback here
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// MUI Components
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // For Suspense fallback
import { useTheme } from '@mui/material/styles'; // To access theme breakpoints
import useMediaQuery from '@mui/material/useMediaQuery'; // For responsive design

// Lazy-load Komponenten
const DailyBonus = lazy(() => import('../components/DailyBonus'));

// Custom hook useIsMobile can be replaced or augmented by MUI's useMediaQuery
// For this refactor, we'll use useMediaQuery directly.

// Sub-Komponente für Fortschritt
const ProgressOverview = ({ level, rewardPoints, coins }) => (
  <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', mb: 3 }}>
    <Typography variant="h5" component="h2" gutterBottom id="progress-heading">
      Your Progress
    </Typography>
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" color="text.secondary">Level:</Typography>
        <Typography variant="h6" component="p">{level}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" color="text.secondary">Reward Points:</Typography>
        <Typography variant="h6" component="p">{rewardPoints}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" color="text.secondary">Coins:</Typography>
        <Typography variant="h6" component="p">{coins}</Typography>
      </Grid>
    </Grid>
    <Button
      component={RouterLink}
      to="/profile"
      variant="contained"
      color="secondary"
      sx={{ mt: 2 }}
    >
      Go to Profile
    </Button>
  </Paper>
);

// Sub-Komponente für Features
const FeaturesList = () => {
  const features = [
    {
      id: 'feature-missions',
      title: 'Exciting Missions',
      description: 'Complete challenging quizzes and level up your character'
    },
    {
      id: 'feature-characters',
      title: 'Legendary Characters',
      description: 'Unlock and upgrade characters from the multiverse'
    },
    {
      id: 'feature-coins',
      title: 'Passive Income',
      description: 'Collect coins and claim daily bonus rewards'
    },
    {
      id: 'feature-events',
      title: 'Special Events',
      description: 'Participate in interdimensional adventures and exclusive events'
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom id="features-heading" textAlign="center">
        Features
      </Typography>
      <Grid container spacing={2}>
        {features.map(feature => (
          <Grid item xs={12} sm={6} md={3} key={feature.id}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom>{feature.title}</Typography>
              <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const Home = () => {
  const { level = 1, rewardPoints = 0, coins = 0 } = useContext(UserContext) || {};
  const theme = useTheme();
  // Using MUI's useMediaQuery for responsiveness, replacing useIsMobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 'sm' is 600px, adjust as needed

  const newsItems = useMemo(() => [
    { id: 'news-1', title: 'Bug Fixes', description: 'Fixed portal gun simulation and character teleportation issues' },
    { id: 'news-2', title: 'Performance Optimizations', description: 'Improved game responsiveness and loading times' },
    { id: 'news-3', title: 'Coming Soon: Fusion Character', description: 'New character combining traits from multiple dimensions' },
    { id: 'news-4', title: 'In Development: Dimension Explorer', description: 'Explore new dimensions and collect exclusive rewards' }
  ], []);

  // The 'rick-morty-theme' class might be less relevant if MUI theme is comprehensive.
  // sx prop will be used for specific styling.
  
  return (
    <Container maxWidth="lg" sx={{ py: 3, // Padding top and bottom
        // Example of using isMobile for conditional styling with sx prop if needed:
        // backgroundColor: isMobile ? 'lightblue' : 'white',
      }}>
      {/* Hero Section */}
      <Box
        component="header"
        sx={{
          textAlign: 'center',
          py: { xs: 3, sm: 5 },
          mb: 3,
          // background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)', // Example gradient
          borderRadius: theme.shape.borderRadius,
          // boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant={isMobile ? "h3" : "h2"} component="h1" gutterBottom sx={{ fontFamily: "'Bangers', cursive", color: 'primary.main' }}>
          Rick and Morty Adventure
        </Typography>
        <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary" sx={{ mb: 3, maxWidth: '700px', marginX: 'auto' }}>
          Experience interdimensional adventures, master missions, and solve quizzes 
          to unlock legendary characters!
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" component="nav" aria-label="Main Navigation">
          <Grid item>
            <Button component={RouterLink} to="/characters" variant="contained" color="primary" size={isMobile ? "medium" : "large"}>
              Characters
            </Button>
          </Grid>
          <Grid item>
            <Button component={RouterLink} to="/missions" variant="contained" color="primary" size={isMobile ? "medium" : "large"}>
              Missions
            </Button>
          </Grid>
          <Grid item>
            <Button component={RouterLink} to="/quiz" variant="contained" color="primary" size={isMobile ? "medium" : "large"}>
              Quiz
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box component="main">
        {/* Daily Bonus with MUI Suspense fallback */}
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, mb: 3, border: `1px dashed ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
            <CircularProgress sx={{mr: 2}} />
            <Typography variant="subtitle1" color="text.secondary">Loading Daily Bonus...</Typography>
          </Box>
        }>
          <Box sx={{ mb: 3 }}> {/* Add margin bottom to DailyBonus container */}
            <DailyBonus />
          </Box>
        </Suspense>

        {/* Progress Component */}
        <ProgressOverview level={level} rewardPoints={rewardPoints} coins={coins} />

        {/* Features Component */}
        <FeaturesList />

        {/* News & Updates */}
        <Paper elevation={3} component="section" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }} aria-labelledby="news-heading">
          <Typography variant="h5" component="h2" gutterBottom id="news-heading" textAlign="center">
            News & Updates
          </Typography>
          <Grid container spacing={2}>
            {newsItems.map(item => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Box sx={{p:1}}>
                  <Typography variant="h6" component="h3" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Box component="footer" sx={{ textAlign: 'center', py: 2, borderTop: `1px solid ${theme.palette.divider}`, mt: 4}}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Rick and Morty Adventure Game
        </Typography>
      </Box>
    </Container>
  );
};

export default React.memo(Home);