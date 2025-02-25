import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './Coin.css';

/**
 * Interaktive Münzkomponente für das Rick and Morty Adventure
 * - Animierte Darstellung
 * - Pulse-Animation beim Münzgewinn
 * - Responsive Design
 */
function Coin({ size, onClick, pulseOnChange = false }) {
  const { coins } = useContext(UserContext);
  const [isPulsing, setIsPulsing] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);
  
  // Optional: Pulse-Animation, wenn sich die Münzanzahl ändert
  useEffect(() => {
    if (pulseOnChange && coins !== prevCoins) {
      setIsPulsing(true);
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 500);
      
      setPrevCoins(coins);
      return () => clearTimeout(timer);
    }
  }, [coins, prevCoins, pulseOnChange]);
  
  // Handle optional click event
  const handleClick = () => {
    if (onClick) {
      onClick();
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }
  };
  
  // Custom style for optional size
  const customStyle = size ? {
    '--coin-size': `${size}px`,
    '--coin-size-large': `${size}px`,
  } : {};
  
  return (
    <div className="coin-container" style={customStyle}>
      <div 
        className={`coin ${isPulsing ? 'pulse' : ''}`}
        onClick={handleClick}
        aria-label="Coin"
        role={onClick ? "button" : "presentation"}
      >
        <div className="coin-inner">
          <span className="coin-text">RM</span>
        </div>
      </div>
    </div>
  );
}

export default Coin;