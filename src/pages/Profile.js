import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import FusionPanel from '../components/FusionPanel';
import { Link } from 'react-router-dom';
import './Profile.css';

// Card-Komponente für Status-Informationen
const StatCard = ({ title, value, subtitle }) => (
  <div className="profile-card">
    <h3>{title}</h3>
    <p>{value}</p>
    {subtitle && <p className="card-subtitle">{subtitle}</p>}
  </div>
);

// Komponente für die Anzeige von Charakteren in der Coin Farm
const CoinFarmCharacterCard = ({ character, isSelected, onSelect }) => (
  <div
    className={`coin-farm-card ${isSelected ? 'selected' : ''}`}
    onClick={onSelect}
  >
    <img 
      src={character.image} 
      alt={character.name} 
      loading="lazy"
    />
    <p>{character.name}</p>
  </div>
);

// Komponente für einen freigeschalteten Charakter
const UnlockedCharacterCard = ({ character, onUpgrade, calculateSpeed, coins }) => {
  const upgradePrice = 100 * (character.characterLevel || 1);
  const canAfford = coins >= upgradePrice;
  
  return (
    <div className="unlocked-card">
      <img 
        src={character.image} 
        alt={character.name} 
        loading="lazy"
      />
      <div className="card-details">
        <p>{character.name}</p>
        <p>Character Level: {character.characterLevel || 1}</p>
        <p>Speed: {calculateSpeed(character)}</p>
        <p>Rarity: {character.rarity || 'Common'}</p>
      </div>
      <button
        onClick={() => onUpgrade(character.id)}
        className={`upgrade-button ${!canAfford ? 'disabled' : ''}`}
        disabled={!canAfford}
        title={!canAfford ? 'Not enough coins' : `Upgrade ${character.name}`}
      >
        Upgrade (Cost: {upgradePrice} Coins)
      </button>
    </div>
  );
};

// Hauptprofil-Komponente
function Profile() {
  const {
    unlockedCharacters = [],
    level = 1,
    rewardPoints = 0,
    coins = 0,
    upgradeCharacter,
    selectedCoinFarm,
    selectCoinFarm,
  } = useContext(UserContext) || {};
  
  const [isLoading, setIsLoading] = useState(true);

  // Berechnung des Schwellwerts für das nächste Level
  const nextLevelThreshold = level * 500;
  const pointsToNextLevel =
    nextLevelThreshold - rewardPoints > 0
      ? nextLevelThreshold - rewardPoints
      : 0;
  
  // Fortschritt zum nächsten Level in Prozent
  const levelProgress = 
    Math.min(100, ((rewardPoints % 500) / 500) * 100).toFixed(0);

  // Hilfsfunction für die Berechnung der effektiven Geschwindigkeit
  const calculateEffectiveSpeed = (character) => {
    const base = character.baseSpeed || 1;
    const upgradeBonus = ((character.characterLevel || 1) - 1) * 0.5;
    const rarityBonus = character.rarity ? (character.rarity - 1) * 0.5 : 0;
    return (base + upgradeBonus + rarityBonus).toFixed(2);
  };

  /* ===========================
     Coin Farm Selection (Horizontal, paginated)
     ---------------------------
     Here we display e.g. 8 characters per page.
  ============================ */
  const coinFarmItemsPerPage = 8;
  const [coinFarmPage, setCoinFarmPage] = useState(0);
  const coinFarmTotalPages = Math.ceil(
    unlockedCharacters.length / coinFarmItemsPerPage
  );
  const paginatedCoinFarmCharacters = unlockedCharacters.slice(
    coinFarmPage * coinFarmItemsPerPage,
    (coinFarmPage + 1) * coinFarmItemsPerPage
  );

  const goToPreviousCoinFarmPage = () => {
    if (coinFarmPage > 0) {
      setCoinFarmPage((prev) => prev - 1);
    }
  };

  const goToNextCoinFarmPage = () => {
    if (coinFarmPage < coinFarmTotalPages - 1) {
      setCoinFarmPage((prev) => prev + 1);
    }
  };

  /* ===========================
     Unlocked Characters (Vertical, paginated)
     ---------------------------
     Here we display e.g. 6 characters per page.
  ============================ */
  const itemsPerPage = 6; // Reduziert für eine bessere mobile Darstellung
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(unlockedCharacters.length / itemsPerPage);
  const paginatedCharacters = unlockedCharacters.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  // Simuliere Ladezeit
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="profile-page">
        <h2>Your Profile</h2>
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading your profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      
      {/* Statuskarten */}
      <div className="profile-info">
        <StatCard 
          title="Level" 
          value={level} 
          subtitle={`${levelProgress}% to Level ${level + 1}`}
        />
        <StatCard 
          title="Reward Points" 
          value={rewardPoints} 
        />
        <StatCard 
          title="Next Level" 
          value={`${pointsToNextLevel} points needed`} 
        />
        <StatCard 
          title="Coins" 
          value={coins} 
        />
      </div>

      {/* Coin Farm Auswahl */}
      <h3>Coin Farm Characters</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <p className="section-description">
            Select a character to collect coins automatically. Higher level characters collect coins faster!
          </p>
          <div className="coin-farm-scroll">
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
            <div className="pagination-controls">
              <button
                onClick={goToPreviousCoinFarmPage}
                disabled={coinFarmPage === 0}
              >
                Previous
              </button>
              <span>
                Page {coinFarmPage + 1} of {coinFarmTotalPages}
              </span>
              <button
                onClick={goToNextCoinFarmPage}
                disabled={coinFarmPage === coinFarmTotalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No characters unlocked yet. Complete missions to unlock characters!</p>
      )}

      {/* Freigeschaltete Charaktere */}
      <h3>Your Character Collection</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <p className="section-description">
            Upgrade your characters to increase their coin collection speed and unlock special abilities.
          </p>
          <div className="unlocked-list">
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
            <div className="pagination-controls">
              <button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 0}
              >
                Previous Page
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next Page
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-collection">
          <p>You haven't unlocked any characters yet.</p>
          <Link to="/missions" className="hero-button">Go to Missions</Link>
        </div>
      )}

      {/* Fusion Panel */}
      <h3>Fuse Characters</h3>
      <FusionPanel />
    </div>
  );
}

export default Profile;