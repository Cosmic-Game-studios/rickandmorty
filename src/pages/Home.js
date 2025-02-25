import React, {
  useContext,
  useMemo,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback
} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Lazy-load Komponenten
const DailyBonus = lazy(() => import('../components/DailyBonus'));

// Custom hook für responsive Design mit Debounce
const useIsMobile = (breakpoint = 768, debounceTime = 150) => {
  // Stellt sicher, dass window existiert (für SSR-Kompatibilität)
  const getIsMobile = useCallback(() => 
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  , [breakpoint]);
  
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(getIsMobile());
      }, debounceTime);
    };

    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [getIsMobile, debounceTime]);

  return isMobile;
};

// Sub-Komponente für Fortschritt
const ProgressOverview = ({ level, rewardPoints, coins }) => (
  <section className="home-section home-progress" aria-labelledby="progress-heading">
    <h2 id="progress-heading" className="home-section-title">Your Progress</h2>
    <div className="home-progress-stats">
      <div className="home-progress-stat">
        <span className="home-progress-label">Level:</span>
        <span className="home-progress-value">{level}</span>
      </div>
      <div className="home-progress-stat">
        <span className="home-progress-label">Reward Points:</span>
        <span className="home-progress-value">{rewardPoints}</span>
      </div>
      <div className="home-progress-stat">
        <span className="home-progress-label">Coins:</span>
        <span className="home-progress-value">{coins}</span>
      </div>
    </div>
    <Link to="/profile" className="home-button home-button-secondary">
      Go to Profile
    </Link>
  </section>
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
    <section className="home-section home-features" aria-labelledby="features-heading">
      <h2 id="features-heading" className="home-section-title">Features</h2>
      <ul className="home-features-list">
        {features.map(feature => (
          <li key={feature.id} className="home-feature-item">
            <h3 className="home-feature-title">{feature.title}</h3>
            <p className="home-feature-description">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Home = () => {
  const { level = 1, rewardPoints = 0, coins = 0 } = useContext(UserContext) || {};
  const isMobile = useIsMobile();

  // News Updates - kann durch echte API-Daten ersetzt werden
  const newsItems = useMemo(() => [
    { id: 'news-1', title: 'Bug Fixes', description: 'Fixed portal gun simulation and character teleportation issues' },
    { id: 'news-2', title: 'Performance Optimizations', description: 'Improved game responsiveness and loading times' },
    { id: 'news-3', title: 'Coming Soon: Fusion Character', description: 'New character combining traits from multiple dimensions' },
    { id: 'news-4', title: 'In Development: Dimension Explorer', description: 'Explore new dimensions and collect exclusive rewards' }
  ], []);

  // Theme-based class für Styling-Konsistenz
  const themeClass = 'rick-morty-theme';
  
  return (
    <div className={`home-page ${themeClass} ${isMobile ? 'home-page-mobile' : ''}`}>
      {/* Hero Section mit verbesserten semantischen Elementen */}
      <header className="home-hero" role="banner">
        <h1 className="home-hero-title">Rick and Morty Adventure</h1>
        <p className="home-hero-subtitle">
          Experience interdimensional adventures, master missions, and solve quizzes 
          to unlock legendary characters!
        </p>
        
        <nav className="home-navigation" aria-label="Main Navigation">
          <ul className="home-nav-list">
            <li className="home-nav-item">
              <Link to="/characters" className="home-button home-button-primary">Characters</Link>
            </li>
            <li className="home-nav-item">
              <Link to="/missions" className="home-button home-button-primary">Missions</Link>
            </li>
            <li className="home-nav-item">
              <Link to="/quiz" className="home-button home-button-primary">Quiz</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="home-content">
        {/* Daily Bonus mit einfachem Fallback */}
        <Suspense fallback={
          <div className="home-daily-bonus-loading" aria-label="Loading daily bonus">
            Loading Daily Bonus...
          </div>
        }>
          <DailyBonus />
        </Suspense>

        {/* Progress Component */}
        <ProgressOverview level={level} rewardPoints={rewardPoints} coins={coins} />

        {/* Features Component */}
        <FeaturesList />

        {/* News & Updates */}
        <section className="home-section home-news" aria-labelledby="news-heading">
          <h2 id="news-heading" className="home-section-title">News & Updates</h2>
          <ul className="home-news-list">
            {newsItems.map(item => (
              <li key={item.id} className="home-news-item">
                <h3 className="home-news-title">{item.title}</h3>
                <p className="home-news-description">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="home-footer">
        <p className="home-footer-text">© {new Date().getFullYear()} Rick and Morty Adventure Game</p>
      </footer>
    </div>
  );
};

export default React.memo(Home);