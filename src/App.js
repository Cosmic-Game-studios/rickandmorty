import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

// Lazy-Loading der Seiten-Komponenten
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
import Shop from './pages/Shop'; // Neue Shop-Seite importieren

// Custom Hook: Ermittelt, ob die Seite auf einem mobilen Gerät angezeigt wird
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

// Custom Hook: Dynamische SEO-Optimierung basierend auf Gerätetyp und weiteren Kriterien
const useSeoOptimizer = () => {
  const isMobile = useIsMobile();
  const [seoSettings, setSeoSettings] = useState({
    viewport: 'width=device-width, initial-scale=1',
    title: 'Rick and Morty Adventure',
    description:
      'Experience interdimensional adventures, master missions, and solve quizzes to unlock legendary characters!',
  });

  useEffect(() => {
    // Beispiel-Algorithmus: Passe Title und Description dynamisch an, je nachdem, ob es sich um ein mobiles Gerät handelt.
    if (isMobile) {
      setSeoSettings((prev) => ({
        ...prev,
        title: 'Rick and Morty Adventure - Mobile',
        description: 'Erlebe interdimensionale Abenteuer – jetzt optimiert für mobile Geräte!',
      }));
    } else {
      setSeoSettings((prev) => ({
        ...prev,
        title: 'Rick and Morty Adventure',
        description:
          'Experience interdimensional adventures, master missions, and solve quizzes to unlock legendary characters!',
      }));
    }
    // Hier könntest du weitere Algorithmen integrieren, z. B. Performance-Messungen oder dynamische Anpassungen der Meta-Daten.
  }, [isMobile]);

  return seoSettings;
};

function App() {
  const seoSettings = useSeoOptimizer();

  return (
    <UserProvider>
      {/* Mit React Helmet werden zentrale Meta-Tags und SEO-relevante Informationen dynamisch gesetzt */}
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content={seoSettings.viewport} />
        <title>{seoSettings.title}</title>
        <meta name="description" content={seoSettings.description} />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      </Helmet>
      <div className="app">
        <Header />
        <main>
          <Routes>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
