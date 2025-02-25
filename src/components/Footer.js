import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Social media icons using simple text representations
  // In a real app, you would use actual icons from a library like react-icons, Font Awesome, etc.
  const socialIcons = {
    twitter: '𝕏',
    facebook: 'f',
    instagram: '📷',
    youtube: '▶',
    discord: 'ᗪ'
  };
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Rick and Morty Adventure
        </div>
        
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>Discover</h4>
            <ul>
              <li><Link to="/characters">Characters</Link></li>
              <li><Link to="/episodes">Episodes</Link></li>
              <li><Link to="/locations">Locations</Link></li>
              <li><Link to="/shop">Shop</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Gameplay</h4>
            <ul>
              <li><Link to="/missions">Missions</Link></li>
              <li><Link to="/quiz">Quiz</Link></li>
              <li><Link to="/profile">Your Profile</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>About</h4>
            <ul>
              <li><a href="#about">About the Game</a></li>
              <li><a href="#team">Development Team</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="social-icons">
          {Object.entries(socialIcons).map(([platform, icon]) => (
            <a 
              key={platform}
              href={`https://${platform}.com/rickandmortyadventure`} 
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label={`Visit our ${platform} page`}
            >
              {icon}
            </a>
          ))}
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} Rick and Morty Adventure. All rights reserved.
          </div>
          
          <div className="legal-links">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;