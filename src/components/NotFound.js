import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      className="not-found-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Dimension nicht gefunden</h2>
        
        <div className="not-found-content">
          <p>
            Oh nein! Diese Dimension existiert nicht im Multiversum oder
            wurde von Rick für ein verrücktes Experiment zerstört.
          </p>
          
          <p>
            Vielleicht hat der Rat der Ricks diese Seite blockiert, oder du bist 
            in eine falsche Realität gesprungen.
          </p>
        </div>
        
        <div className="not-found-portal">
          <div className="portal-outer"></div>
          <div className="portal-inner"></div>
        </div>
        
        <div className="not-found-actions">
          <Link to="/" className="portal-button">
            Zurück zur sicheren Dimension
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;