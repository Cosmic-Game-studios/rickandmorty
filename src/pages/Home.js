import React, {
  useContext,
  useMemo,
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Lazy-Loading der DailyBonus-Komponente
const DailyBonus = lazy(() => import('../components/DailyBonus'));

// Custom Hook, um zu ermitteln, ob der Bildschirm mobil ist
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};

const Home = () => {
  // Kontextwerte extrahieren
  const { level, rewardPoints, coins } = useContext(UserContext);
  const isMobile = useIsMobile();

  // Statische Inhalte für Features und News werden nur bei Änderungen neu erzeugt
  const features = useMemo(() => (
    <ul>
      <li>Exciting missions and challenging quizzes</li>
      <li>Unlock and upgrade legendary characters</li>
      <li>Passive coin collection and daily bonus rewards</li>
      <li>Interdimensional adventures and exclusive events</li>
    </ul>
  ), []);

  const newsUpdates = useMemo(() => (
    <ul>
      <li>Bug Fixes</li>
      <li>Performance Optimizations</li>
      <li>WIP Fusion Character</li>
    </ul>
  ), []);

  return (
    <div className={`home-page ${isMobile ? 'mobile' : ''}`}>
      {/* Daily Bonus wird per Lazy-Loading eingebunden */}
      <Suspense fallback={<div className="suspense-fallback">Loading Daily Bonus...</div>}>
        <DailyBonus />
      </Suspense>

      {/* Hero Section als Header */}
      <header className="hero-section">
        <h1 className="hero-title">Rick and Morty Adventure</h1>
        <p className="hero-subtitle">
          Experience interdimensional adventures, master missions, and solve quizzes to unlock legendary characters!
        </p>
        <nav className="hero-buttons" aria-label="Main Navigation">
          <Link to="/characters" className="hero-button">Characters</Link>
          <Link to="/missions" className="hero-button">Missions</Link>
          <Link to="/quiz" className="hero-button">Quiz</Link>
        </nav>
      </header>

      {/* Fortschrittsübersicht */}
      <section className="info-section">
        <h2>Your Progress</h2>
        <p>Level: {level}</p>
        <p>Reward Points: {rewardPoints}</p>
        <p>Coins: {coins}</p>
        <Link to="/profile" className="hero-button">Go to Profile</Link>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Features</h2>
        {features}
      </section>

      {/* News & Updates */}
      <section className="news-section">
        <h2>News & Updates</h2>
        {newsUpdates}
      </section>
    </div>
  );
};

export default React.memo(Home);
