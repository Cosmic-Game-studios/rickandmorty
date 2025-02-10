import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin';
import './Header.css'; // Importiere die CSS-Datei

function Header() {
  const { coins } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="coin-display">
          <Coin />
          <span>{coins} Coins</span>
        </div>
        <h1 className="site-title">Rick and Morty Adventure</h1>
        {/* Hamburger-Button – wird in der Desktop-Ansicht via CSS ausgeblendet */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Navigation umschalten">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      {/* Die Klasse "open" wird hinzugefügt, wenn menuOpen true ist */}
      <nav className={menuOpen ? "open" : ""}>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/characters">Charaktere</Link></li>
          <li><Link to="/episodes">Episoden</Link></li>
          <li><Link to="/locations">Orte</Link></li>
          <li><Link to="/missions">Missionen</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/profile">Profil</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
