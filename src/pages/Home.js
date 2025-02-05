import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import DailyBonus from '../components/DailyBonus';

function Home() {
  const { level, rewardPoints, coins } = useContext(UserContext);

  return (
    <div className="home-page">
      {/* Täglicher Bonus */}
      <DailyBonus />

      {/* Hero-Bereich als Header */}
      <header className="hero-section">
        <h1 className="hero-title">Rick and Morty Adventure</h1>
        <p className="hero-subtitle">
          Erlebe interdimensionale Abenteuer, meistere Missionen und löse Quizfragen, um legendäre Charaktere freizuschalten!
        </p>
        <nav className="hero-buttons" aria-label="Hauptnavigation">
          <Link to="/characters" className="hero-button">Charaktere</Link>
          <Link to="/missions" className="hero-button">Missionen</Link>
          <Link to="/quiz" className="hero-button">Quiz</Link>
        </nav>
      </header>

      {/* Fortschrittsübersicht */}
      <section className="info-section">
        <h2>Dein Fortschritt</h2>
        <p>Level: {level}</p>
        <p>Belohnungspunkte: {rewardPoints}</p>
        <p>Coins: {coins}</p>
        <Link to="/profile" className="hero-button">Zum Profil</Link>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Spannende Missionen und herausfordernde Quizfragen</li>
          <li>Freischalten und Upgraden von legendären Charakteren</li>
          <li>Passives Coin-Sammeln und tägliche Bonusbelohnungen</li>
          <li>Interdimensionale Abenteuer und exklusive Events</li>
        </ul>
      </section>

      {/* Neuigkeiten & Updates */}
      <section className="news-section">
        <h2>Neuigkeiten & Updates</h2>
        <p>
          Bleib immer auf dem neuesten Stand: Erfahre mehr über kommende Events, Updates und spezielle Aktionen!
        </p>
      </section>
    </div>
  );
}

export default Home;