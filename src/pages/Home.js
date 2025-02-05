import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import DailyBonus from '../components/DailyBonus';

function Home() {
  const { level, rewardPoints, coins } = useContext(UserContext);

  return (
    <div className="home-page">
      {/* Daily Bonus */}
      <DailyBonus />

      {/* Hero Section as Header */}
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
        <ul>
          <li>Exciting missions and challenging quizzes</li>
          <li>Unlock and upgrade legendary characters</li>
          <li>Passive coin collection and daily bonus rewards</li>
          <li>Interdimensional adventures and exclusive events</li>
        </ul>
      </section>

      {/* News & Updates */}
      <section className="news-section">
        <h2>News & Updates</h2>
        <ul>
          <li>Bug Fixes</li>
          <li>Performance Optimizations</li>
          <li>WIP Fusion Character</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
