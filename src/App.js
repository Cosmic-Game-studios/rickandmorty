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
import Shop from './pages/Shop'; // Neue Shop-Seite importieren
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
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
            <Route path="/shop" element={<Shop />} /> {/* Shop-Seite hinzugefügt */}
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;
