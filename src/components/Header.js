import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin';
import './Header.css'; // Import the CSS file

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
        {/* Hamburger button – hidden in the desktop view via CSS */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      {/* The "open" class is added when menuOpen is true */}
      <nav className={menuOpen ? "open" : ""}>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/characters">Characters</Link></li>
          <li><Link to="/episodes">Episodes</Link></li>
          <li><Link to="/locations">Locations</Link></li>
          <li><Link to="/missions">Missions</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
