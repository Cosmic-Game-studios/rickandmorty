import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import FusionPanel from '../components/FusionPanel';
import { Link } from 'react-router-dom';
import './Profile.css';

// Extracted components for better code organization
const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="profile-card">
    {icon && <div className="card-icon">{icon}</div>}
    <h3>{title}</h3>
    <p className="card-value">{value}</p>
    {subtitle && <p className="card-subtitle">{subtitle}</p>}
  </div>
);

const LevelProgressBar = ({ percentage }) => (
  <div className="level-progress-container">
    <div 
      className="level-progress-bar" 
      style={{ width: `${percentage}%` }}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={percentage}
      role="progressbar"
    />
  </div>
);

const CoinFarmCharacterCard = ({ character, isSelected, onSelect }) => (
  <div
    className={`coin-farm-card ${isSelected ? 'selected' : ''}`}
    onClick={onSelect}
    role="button"
    aria-pressed={isSelected}
    tabIndex={0}
  >
    <div className="character-image-container">
      <img 
        src={character.image} 
        alt={character.name} 
        loading="lazy"
      />
      {isSelected && <div className="selected-indicator" aria-hidden="true">✓</div>}
    </div>
    <p>{character.name}</p>
    <div className="character-speed">
      <span className="speed-icon">⚡</span>
      <span>{(character.baseSpeed || 1) + ((character.characterLevel || 1) - 1) * 0.5}</span>
    </div>
  </div>
);

const UnlockedCharacterCard = ({ character, onUpgrade, calculateSpeed, coins }) => {
  const upgradePrice = 100 * (character.characterLevel || 1);
  const canAfford = coins >= upgradePrice;
  
  const rarityColors = {
    'Common': '#A0A0A0',
    'Uncommon': '#4CAF50',
    'Rare': '#2196F3',
    'Epic': '#9C27B0',
    'Legendary': '#FFC107'
  };
  
  return (
    <div className="unlocked-card">
      <div className="character-image-container" style={{ borderColor: rarityColors[character.rarity || 'Common'] }}>
        <img 
          src={character.image} 
          alt={character.name} 
          loading="lazy"
        />
        <span className="character-level">Lv.{character.characterLevel || 1}</span>
      </div>
      <div className="card-details">
        <h4>{character.name}</h4>
        <div className="character-stats">
          <p>
            <span className="stat-label">Speed:</span> 
            <span className="stat-value">{calculateSpeed(character)}</span>
          </p>
          <p>
            <span className="stat-label">Rarity:</span> 
            <span className="stat-value" style={{ color: rarityColors[character.rarity || 'Common'] }}>
              {character.rarity || 'Common'}
            </span>
          </p>
        </div>
      </div>
      <button
        onClick={() => onUpgrade(character.id)}
        className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}
        disabled={!canAfford}
        title={!canAfford ? 'Not enough coins' : `Upgrade ${character.name}`}
      >
        {canAfford ? (
          <>Upgrade <span className="coin-cost">{upgradePrice} 🪙</span></>
        ) : (
          <>Need <span className="coin-cost">{upgradePrice} 🪙</span></>
        )}
      </button>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => (
  <div className="pagination-controls">
    <button
      onClick={onPrevious}
      disabled={currentPage === 0}
      className="pagination-button"
      aria-label="Go to previous page"
    >
      ← Previous
    </button>
    <span className="page-indicator">
      Page {currentPage + 1} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages - 1}
      className="pagination-button"
      aria-label="Go to next page"
    >
      Next →
    </button>
  </div>
);

const LoadingIndicator = () => (
  <div className="loading-indicator">
    <div className="loading-spinner"></div>
    <p>Loading your profile data...</p>
  </div>
);

// Main Profile component
function Profile() {
  const {
    unlockedCharacters = [],
    level = 1,
    rewardPoints = 0,
    coins = 0,
    upgradeCharacter,
    selectedCoinFarm,
    selectCoinFarm,
    error
  } = useContext(UserContext) || {};
  
  const [isLoading, setIsLoading] = useState(true);

  // Calculate level stats
  const nextLevelThreshold = useMemo(() => level * 500, [level]);
  const pointsToNextLevel = useMemo(() => 
    Math.max(0, nextLevelThreshold - rewardPoints), 
    [nextLevelThreshold, rewardPoints]
  );
  
  const levelProgress = useMemo(() => 
    Math.min(100, ((rewardPoints % 500) / 500) * 100).toFixed(0),
    [rewardPoints]
  );

  // Character speed calculation
  const calculateEffectiveSpeed = useCallback((character) => {
    const base = character.baseSpeed || 1;
    const upgradeBonus = ((character.characterLevel || 1) - 1) * 0.5;
    const rarityMultipliers = {
      'Common': 0,
      'Uncommon': 0.5,
      'Rare': 1,
      'Epic': 1.5,
      'Legendary': 2
    };
    const rarityBonus = rarityMultipliers[character.rarity || 'Common'];
    return (base + upgradeBonus + rarityBonus).toFixed(2);
  }, []);

  // Coin Farm pagination
  const coinFarmItemsPerPage = 8;
  const [coinFarmPage, setCoinFarmPage] = useState(0);
  
  const coinFarmTotalPages = useMemo(() => 
    Math.ceil(unlockedCharacters.length / coinFarmItemsPerPage),
    [unlockedCharacters.length, coinFarmItemsPerPage]
  );
  
  const paginatedCoinFarmCharacters = useMemo(() => 
    unlockedCharacters.slice(
      coinFarmPage * coinFarmItemsPerPage,
      (coinFarmPage + 1) * coinFarmItemsPerPage
    ),
    [unlockedCharacters, coinFarmPage, coinFarmItemsPerPage]
  );

  const goToPreviousCoinFarmPage = useCallback(() => {
    setCoinFarmPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextCoinFarmPage = useCallback(() => {
    setCoinFarmPage(prev => Math.min(coinFarmTotalPages - 1, prev + 1));
  }, [coinFarmTotalPages]);

  // Character collection pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = useMemo(() => 
    Math.ceil(unlockedCharacters.length / itemsPerPage),
    [unlockedCharacters.length, itemsPerPage]
  );
  
  const paginatedCharacters = useMemo(() => 
    unlockedCharacters.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ),
    [unlockedCharacters, currentPage, itemsPerPage]
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);
  
  // Auto-select first character for coin farm if none selected
  useEffect(() => {
    if (!selectedCoinFarm && unlockedCharacters.length > 0 && selectCoinFarm) {
      selectCoinFarm(unlockedCharacters[0].id);
    }
  }, [unlockedCharacters, selectedCoinFarm, selectCoinFarm]);
  
  // Simulating loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Error handling
  if (error) {
    return (
      <div className="profile-page error-state">
        <h2>Oops! Something went wrong</h2>
        <p>{error.message || 'Failed to load profile data'}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <h2>Your Profile</h2>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <Link to="/settings" className="settings-link" aria-label="Settings">
          ⚙️
        </Link>
      </div>
      
      {/* Status cards */}
      <div className="profile-info">
        <StatCard 
          title="Level" 
          value={level} 
          subtitle={`${pointsToNextLevel} points to level ${level + 1}`}
          icon="🏆"
        />
        <div className="level-progress-wrapper">
          <LevelProgressBar percentage={levelProgress} />
          <span className="progress-text">{levelProgress}%</span>
        </div>
        
        <div className="stats-row">
          <StatCard 
            title="Reward Points" 
            value={rewardPoints} 
            icon="⭐"
          />
          <StatCard 
            title="Coins" 
            value={coins} 
            icon="🪙"
          />
        </div>
      </div>

      {/* Coin Farm Selection */}
      <section className="section coin-farm-section">
        <div className="section-header">
          <h3>Coin Farm</h3>
          <button className="help-button" title="How Coin Farms work">?</button>
        </div>

        {unlockedCharacters.length > 0 ? (
          <>
            <p className="section-description">
              Select a character to collect coins automatically. Higher level characters earn more!
            </p>
            <div className="coin-farm-scroll" role="listbox" aria-label="Selectable characters for coin farming">
              {paginatedCoinFarmCharacters.map((character) => (
                <CoinFarmCharacterCard 
                  key={character.id}
                  character={character}
                  isSelected={selectedCoinFarm === character.id}
                  onSelect={() => selectCoinFarm(character.id)}
                />
              ))}
            </div>
            {coinFarmTotalPages > 1 && (
              <Pagination 
                currentPage={coinFarmPage}
                totalPages={coinFarmTotalPages}
                onPrevious={goToPreviousCoinFarmPage}
                onNext={goToNextCoinFarmPage}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No characters unlocked yet.</p>
            <Link to="/missions" className="cta-button">Complete Missions</Link>
          </div>
        )}
      </section>

      {/* Character Collection */}
      <section className="section character-collection-section">
        <div className="section-header">
          <h3>Character Collection</h3>
          <span className="collection-count">{unlockedCharacters.length} / 30</span>
        </div>

        {unlockedCharacters.length > 0 ? (
          <>
            <p className="section-description">
              Upgrade your characters to increase their coin collection speed.
            </p>
            <div className="unlocked-list" role="list" aria-label="Your character collection">
              {paginatedCharacters.map((character) => (
                <UnlockedCharacterCard 
                  key={character.id}
                  character={character}
                  onUpgrade={upgradeCharacter}
                  calculateSpeed={calculateEffectiveSpeed}
                  coins={coins}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
              />
            )}
          </>
        ) : (
          <div className="empty-collection">
            <p>You haven't unlocked any characters yet.</p>
            <Link to="/missions" className="cta-button">Go to Missions</Link>
          </div>
        )}
      </section>

      {/* Fusion Panel */}
      <section className="section fusion-section">
        <div className="section-header">
          <h3>Character Fusion</h3>
          <button className="help-button" title="How Fusion works">?</button>
        </div>
        <FusionPanel />
      </section>
    </div>
  );
}

export default Profile;