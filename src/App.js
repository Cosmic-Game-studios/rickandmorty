import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Komponenten, die immer sofort geladen werden
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loading für Route-Komponenten
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
const NotFound = lazy(() => import('./pages/NotFound'));

// Hauptanwendungskomponente
function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <div className="app">
        <Header />
        <main>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/character/:id" element={<CharacterDetails />} />
                  <Route path="/episodes" element={<Episodes />} />
                  <Route path="/episode/:id" element={<EpisodeDetails />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/location/:id" element={<LocationDetails />} />
                  <Route path="/missions" element={<Missions />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;