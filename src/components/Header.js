import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin';
import './Header.css';

function Header() {
  const { coins } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  
  // Toggle menu state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target) && !event.target.closest('.hamburger')) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  
  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  // Handle coin change animation
  useEffect(() => {
    if (coins !== prevCoins) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Animation dauert 500ms
      
      setPrevCoins(coins);
      return () => clearTimeout(timer);
    }
  }, [coins, prevCoins]);
  
  // Check if a nav link is active based on current location
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className={`coin-display ${isAnimating ? 'coin-change' : ''}`}>
          <Coin />
          <span>{coins} Coins</span>
        </div>
        
        <h1 className="site-title">Rick and Morty Adventure</h1>
        
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
      
      <div 
        ref={navRef}
        className={`nav-container ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen && window.innerWidth <= 768}
      >
        <nav>
          <ul className="nav-list">
            <li><Link to="/" className={isActiveLink('/') ? 'active' : ''}>Home</Link></li>
            <li><Link to="/characters" className={isActiveLink('/characters') ? 'active' : ''}>Characters</Link></li>
            <li><Link to="/episodes" className={isActiveLink('/episodes') ? 'active' : ''}>Episodes</Link></li>
            <li><Link to="/locations" className={isActiveLink('/locations') ? 'active' : ''}>Locations</Link></li>
            <li><Link to="/missions" className={isActiveLink('/missions') ? 'active' : ''}>Missions</Link></li>
            <li><Link to="/quiz" className={isActiveLink('/quiz') ? 'active' : ''}>Quiz</Link></li>
            <li><Link to="/profile" className={isActiveLink('/profile') ? 'active' : ''}>Profile</Link></li>
            <li><Link to="/shop" className={isActiveLink('/shop') ? 'active' : ''}>Shop</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;