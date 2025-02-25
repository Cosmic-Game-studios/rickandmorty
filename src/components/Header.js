import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin';
import './Header.css'; // Stelle sicher, dass diese Datei aktualisiert wird

function Header() {
  const { coins } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Schließe das Menü beim Standortwechsel (Navigationswechsel)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Schließe das Menü, wenn außerhalb des Menüs geklickt wird
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target) && 
          !event.target.classList.contains('hamburger') && menuOpen) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Animation für den Hamburger-Button und Navigation-Toggle
  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  // Berechne, ob der aktuelle Pfad dem Link entspricht
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-top">
          <div className="logo-container">
            <h1 className="site-title">
              <Link to="/">
                Rick and Morty Adventure
              </Link>
            </h1>
          </div>
          
          <div className="coin-display">
            <Coin size="medium" />
            <span className="coin-count">{coins}</span>
          </div>
          
          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
        
        <nav 
          className={`main-nav ${menuOpen ? 'open' : ''}`}
          ref={navRef}
          aria-hidden={!menuOpen}
        >
          <ul className="nav-list">
            <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
            <li><Link to="/characters" className={isActive('/characters') ? 'active' : ''}>Characters</Link></li>
            <li><Link to="/episodes" className={isActive('/episodes') ? 'active' : ''}>Episodes</Link></li>
            <li><Link to="/locations" className={isActive('/locations') ? 'active' : ''}>Locations</Link></li>
            <li><Link to="/missions" className={isActive('/missions') ? 'active' : ''}>Missions</Link></li>
            <li><Link to="/quiz" className={isActive('/quiz') ? 'active' : ''}>Quiz</Link></li>
            <li><Link to="/profile" className={isActive('/profile') ? 'active' : ''}>Profile</Link></li>
            <li><Link to="/shop" className={isActive('/shop') ? 'active' : ''}>Shop</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;