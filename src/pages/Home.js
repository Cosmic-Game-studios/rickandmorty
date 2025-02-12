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

// Lazy-load the DailyBonus component
const DailyBonus = lazy(() => import('../components/DailyBonus'));

// Custom hook to determine if the screen is mobile (with debounce)
const useIsMobile = () => {
  // Ensure window exists (for SSR compatibility)
  const getIsMobile = () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(getIsMobile());
      }, 150); // Debounce delay
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

const Home = () => {
  const { level, rewardPoints, coins } = useContext(UserContext);
  const isMobile = useIsMobile();

  // Memoize static content so it's not recalculated on every render
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
      <li>WIP DE</li>
    </ul>
  ), []);

  return (
    <div className={`home-page ${isMobile ? 'mobile' : ''}`}>
      {/* Lazy-loaded Daily Bonus */}
      <Suspense fallback={<div className="suspense-fallback">Loading Daily Bonus...</div>}>
        <DailyBonus />
      </Suspense>

      {/* Hero Section */}
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

      {/* Progress Overview */}
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
