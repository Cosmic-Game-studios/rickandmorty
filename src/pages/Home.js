import React, { useContext, lazy, Suspense } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// MUI Components
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import StoreIcon from '@mui/icons-material/Store';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Lazy-load Components
const DailyBonus = lazy(() => import('../components/DailyBonus'));

// Hero Section Component
const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      minHeight: { xs: '60vh', md: '70vh' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      mb: 6,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 217, 61, 0.05) 0%, transparent 60%)
        `,
        zIndex: 0,
      },
    }}
  >
    {/* Floating Elements */}
    <Box sx={{ position: 'absolute', top: '10%', left: '10%', fontSize: '3rem', animation: 'float 6s ease-in-out infinite', '@keyframes float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } } }}>
      🌀
    </Box>
    <Box sx={{ position: 'absolute', top: '20%', right: '15%', fontSize: '2rem', animation: 'float 8s ease-in-out infinite 1s' }}>
      👽
    </Box>
    <Box sx={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '2.5rem', animation: 'float 7s ease-in-out infinite 0.5s' }}>
      🚀
    </Box>
    <Box sx={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '2rem', animation: 'float 9s ease-in-out infinite 2s' }}>
      ⭐
    </Box>

    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Bangers', cursive",
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
          background: 'linear-gradient(135deg, #00d4ff 0%, #39ff14 50%, #ffd93d 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 3s linear infinite',
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '0% center' },
            '100%': { backgroundPosition: '200% center' },
          },
          mb: 2,
          filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))',
        }}
      >
        Rick & Morty Adventure
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: 600,
          mx: 'auto',
          mb: 4,
          fontWeight: 400,
          lineHeight: 1.6,
        }}
      >
        Embark on an interdimensional journey! Collect characters, complete missions, and become the ultimate adventurer across the multiverse.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          component={RouterLink}
          to="/missions"
          variant="contained"
          size="large"
          startIcon={<RocketLaunchIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          Start Adventure
        </Button>
        <Button
          component={RouterLink}
          to="/characters"
          variant="outlined"
          size="large"
          startIcon={<GroupIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          View Characters
        </Button>
      </Box>
    </Container>
  </Box>
);

// Stats Card Component
const StatCard = ({ icon, title, value, subtitle, color }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, rgba(${color}, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)`,
      border: `1px solid rgba(${color}, 0.3)`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 12px 40px rgba(${color}, 0.2)`,
        borderColor: `rgba(${color}, 0.5)`,
      },
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 3 }}>
      <Box sx={{ fontSize: '2.5rem', mb: 1 }}>{icon}</Box>
      <Typography variant="overline" sx={{ color: `rgba(255, 255, 255, 0.6)`, letterSpacing: '0.1em' }}>
        {title}
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Bangers', cursive",
          background: `linear-gradient(135deg, rgb(${color}) 0%, rgba(${color}, 0.7) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          my: 1,
        }}
      >
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, link, linkText }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        '& .feature-icon': {
          transform: 'scale(1.1) rotate(5deg)',
        },
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box
        className="feature-icon"
        sx={{
          width: 60,
          height: 60,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(57, 255, 20, 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          transition: 'transform 0.3s ease',
          '& svg': {
            fontSize: '1.8rem',
            color: '#00d4ff',
          },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, flexGrow: 1 }}>
        {description}
      </Typography>
      <Button
        component={RouterLink}
        to={link}
        endIcon={<ArrowForwardIcon />}
        sx={{
          alignSelf: 'flex-start',
          color: '#00d4ff',
          '&:hover': {
            background: 'rgba(0, 212, 255, 0.1)',
          },
        }}
      >
        {linkText}
      </Button>
    </CardContent>
  </Card>
);

// Progress Overview Component
const ProgressOverview = ({ level, rewardPoints, coins }) => {
  const nextLevelPoints = level * 500;
  const progress = Math.min(100, ((rewardPoints % 500) / 500) * 100);

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        background: 'linear-gradient(145deg, rgba(20, 30, 55, 0.95) 0%, rgba(10, 18, 35, 0.98) 100%)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00d4ff, #39ff14, #ffd93d)',
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Bangers', cursive",
          textAlign: 'center',
          mb: 4,
          color: '#00d4ff',
          textShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
        }}
      >
        Your Progress
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon="⭐"
            title="Level"
            value={level}
            subtitle={`${Math.max(0, nextLevelPoints - rewardPoints)} pts to next level`}
            color="255, 217, 61"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon="🏆"
            title="Reward Points"
            value={rewardPoints.toLocaleString()}
            color="0, 212, 255"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon="🪙"
            title="Coins"
            value={coins.toLocaleString()}
            color="57, 255, 20"
          />
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Box sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Progress to Level {level + 1}
          </Typography>
          <Typography variant="body2" sx={{ color: '#00d4ff', fontWeight: 600 }}>
            {progress.toFixed(0)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: 'linear-gradient(90deg, #00d4ff 0%, #39ff14 100%)',
            },
          }}
        />
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          component={RouterLink}
          to="/profile"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ px: 4 }}
        >
          View Full Profile
        </Button>
      </Box>
    </Paper>
  );
};

// Main Home Component
function Home() {
  const { level = 1, rewardPoints = 0, coins = 0 } = useContext(UserContext) || {};

  const features = [
    {
      icon: <AssignmentIcon />,
      title: 'Exciting Missions',
      description: 'Complete challenging missions to unlock rare characters and earn massive rewards.',
      link: '/missions',
      linkText: 'View Missions',
    },
    {
      icon: <GroupIcon />,
      title: 'Legendary Characters',
      description: 'Collect and upgrade iconic characters from across the multiverse.',
      link: '/characters',
      linkText: 'Browse Characters',
    },
    {
      icon: <QuizIcon />,
      title: 'Quiz Challenges',
      description: 'Test your Rick and Morty knowledge and earn bonus points.',
      link: '/quiz',
      linkText: 'Take Quiz',
    },
    {
      icon: <StoreIcon />,
      title: 'Interdimensional Shop',
      description: 'Spend your coins on exclusive items and character upgrades.',
      link: '/shop',
      linkText: 'Visit Shop',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />

      <Container maxWidth="lg">
        {/* Daily Bonus */}
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#00d4ff' }} />
            </Box>
          }
        >
          <DailyBonus />
        </Suspense>

        {/* Progress Overview */}
        <ProgressOverview level={level} rewardPoints={rewardPoints} coins={coins} />

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Bangers', cursive",
              textAlign: 'center',
              mb: 4,
              color: '#ffd93d',
              textShadow: '0 0 15px rgba(255, 217, 61, 0.4)',
            }}
          >
            Game Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 50%, rgba(240, 147, 251, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Bangers', cursive",
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ready for Adventure?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3, maxWidth: 500, mx: 'auto' }}>
            Start your journey through the multiverse today. Complete missions, collect characters, and become the ultimate Rick and Morty fan!
          </Typography>
          <Button
            component={RouterLink}
            to="/missions"
            variant="contained"
            size="large"
            startIcon={<RocketLaunchIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
              },
            }}
          >
            Begin Your Adventure
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;
