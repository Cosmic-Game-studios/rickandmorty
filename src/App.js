import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Characters from './pages/Characters';
import CharacterDetails from './pages/CharacterDetails';
import Episodes from './pages/Episodes';
import EpisodeDetails from './pages/EpisodeDetails';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';
import Missions from './pages/Missions';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

/**
 * Verbesserte App-Komponente mit organisiertem Routing
 * 
 * Zukünftige Verbesserungsmöglichkeiten:
 * - Lazy Loading für Komponenten implementieren (React.lazy)
 * - Suspense mit einem LoadingScreen hinzufügen
 * - ErrorBoundary für Fehlerbehandlung einrichten
 * - Seiten-Übergänge mit AnimatePresence (von framer-motion)
 */
function App() {
  return (
    <UserProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            {/* Hauptseiten */}
            <Route path="/" element={<Home />} />
            
            {/* Charakter-Routen */}
            <Route path="/characters" element={<Characters />} />
            <Route path="/character/:id" element={<CharacterDetails />} />
            
            {/* Episoden-Routen */}
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/episode/:id" element={<EpisodeDetails />} />
            
            {/* Locations-Routen */}
            <Route path="/locations" element={<Locations />} />
            <Route path="/location/:id" element={<LocationDetails />} />
            
            {/* Weitere Seiten */}
            <Route path="/missions" element={<Missions />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            
            {/* Für alle nicht gefundenen Routen - Fallback auf Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;