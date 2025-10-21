import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'));
const Characters = lazy(() => import('./pages/Characters'));
const CharacterDetails = lazy(() => import('./pages/CharacterDetails'));
const Episodes = lazy(() => import('./pages/Episodes'));
const EpisodeDetails = lazy(() => import('./pages/EpisodeDetails'));
const Locations = lazy(() => import('./pages/Locations'));
const LocationDetails = lazy(() => import('./pages/LocationDetails'));
const Missions = lazy(() => import('./pages/Missions'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Profile = lazy(() => import('./pages/Profile'));
const Shop = lazy(() => import('./pages/Shop'));

/**
 * Loading fallback component displayed while lazy components load
 */
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress size={60} />
  </Box>
);

/**
 * Improved App component with organized routing, lazy loading, and error boundaries
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <ErrorBoundary>
          <div className="app">
            <Header />
            <main>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Main pages */}
                  <Route path="/" element={<Home />} />

                  {/* Character routes */}
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/character/:id" element={<CharacterDetails />} />

                  {/* Episode routes */}
                  <Route path="/episodes" element={<Episodes />} />
                  <Route path="/episode/:id" element={<EpisodeDetails />} />

                  {/* Location routes */}
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/location/:id" element={<LocationDetails />} />

                  {/* Additional pages */}
                  <Route path="/missions" element={<Missions />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shop" element={<Shop />} />

                  {/* Fallback for not found routes */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;