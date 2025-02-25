import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="portal-animation">
          <div className="portal-outer"></div>
          <div className="portal-inner"></div>
        </div>
        <h2>Dimensionsportal wird geöffnet...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;