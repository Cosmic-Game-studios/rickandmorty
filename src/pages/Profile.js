import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import FusionPanel from '../components/FusionPanel';
import './Profile.css';

function Profile() {
  const {
    unlockedCharacters,
    level,
    rewardPoints,
    coins,
    upgradeCharacter,
    selectedCoinFarm,
    selectCoinFarm,
  } = useContext(UserContext);

  // Berechne den Schwellenwert für das nächste Level
  const nextLevelThreshold = level * 500;
  const pointsToNextLevel = nextLevelThreshold - rewardPoints > 0 
    ? nextLevelThreshold - rewardPoints 
    : 0;

  // Helper zur Berechnung der effektiven Geschwindigkeit:
  // effectiveSpeed = baseSpeed + ((characterLevel - 1) * 0.5) + ((rarity - 1) * 0.5)
  const calculateEffectiveSpeed = (character) => {
    const base = character.baseSpeed || 1;
    const upgradeBonus = ((character.characterLevel || 1) - 1) * 0.5;
    const rarityBonus = character.rarity ? (character.rarity - 1) * 0.5 : 0;
    return (base + upgradeBonus + rarityBonus).toFixed(2);
  };

  /* ===========================
     Coin Farm Auswahl (Horizontal, paginiert)
     ---------------------------
     Hier zeigen wir z. B. 8 Charaktere pro Seite an.
  ============================ */
  const coinFarmItemsPerPage = 8;
  const [coinFarmPage, setCoinFarmPage] = useState(0);
  const coinFarmTotalPages = Math.ceil(unlockedCharacters.length / coinFarmItemsPerPage);
  const paginatedCoinFarmCharacters = unlockedCharacters.slice(
    coinFarmPage * coinFarmItemsPerPage,
    (coinFarmPage + 1) * coinFarmItemsPerPage
  );

  const goToPreviousCoinFarmPage = () => {
    if (coinFarmPage > 0) {
      setCoinFarmPage(prev => prev - 1);
    }
  };

  const goToNextCoinFarmPage = () => {
    if (coinFarmPage < coinFarmTotalPages - 1) {
      setCoinFarmPage(prev => prev + 1);
    }
  };

  /* ===========================
     Freigeschaltete Charaktere (Vertikal, paginiert)
     ---------------------------
     Hier zeigen wir z. B. 12 Charaktere pro Seite an.
  ============================ */
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(unlockedCharacters.length / itemsPerPage);
  const paginatedCharacters = unlockedCharacters.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="profile-page">
      <h2>Dein Profil</h2>
      <div className="profile-info">
        <div className="profile-card">
          <h3>Level</h3>
          <p>{level}</p>
        </div>
        <div className="profile-card">
          <h3>Belohnungspunkte</h3>
          <p>{rewardPoints}</p>
        </div>
        <div className="profile-card">
          <h3>Nächstes Level</h3>
          <p>{pointsToNextLevel} Punkte benötigt</p>
        </div>
        <div className="profile-card">
          <h3>Coins</h3>
          <p>{coins}</p>
        </div>
      </div>

      <h3>Wähle einen freigeschalteten Charakter für deine Coin Farm</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <div className="coin-farm-scroll">
            {paginatedCoinFarmCharacters.map(character => (
              <div
                key={character.id}
                className={`coin-farm-card ${selectedCoinFarm === character.id ? 'selected' : ''}`}
                onClick={() => selectCoinFarm(character.id)}
              >
                <img src={character.image} alt={character.name} />
                <p>{character.name}</p>
              </div>
            ))}
          </div>
          {coinFarmTotalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={goToPreviousCoinFarmPage} disabled={coinFarmPage === 0}>
                Vorherige
              </button>
              <span>
                Seite {coinFarmPage + 1} von {coinFarmTotalPages}
              </span>
              <button onClick={goToNextCoinFarmPage} disabled={coinFarmPage === coinFarmTotalPages - 1}>
                Nächste
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Keine Charaktere freigeschaltet.</p>
      )}

      <h3>Freigeschaltete Charaktere</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <div className="unlocked-list">
            {paginatedCharacters.map(character => (
              <div key={character.id} className="unlocked-card">
                <img src={character.image} alt={character.name} />
                <div className="card-details">
                  <p>{character.name}</p>
                  <p>Charakter-Level: {character.characterLevel}</p>
                  <p>Speed: {calculateEffectiveSpeed(character)}</p>
                  <p>Rarity: {character.rarity ? character.rarity : "Nicht festgelegt"}</p>
                </div>
                <button onClick={() => upgradeCharacter(character.id)} className="upgrade-button">
                  Upgrade (100 Coins)
                </button>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={goToPreviousPage} disabled={currentPage === 0}>
                Vorherige Seite
              </button>
              <span>
                Seite {currentPage + 1} von {totalPages}
              </span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
                Nächste Seite
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Keine Charaktere freigeschaltet.</p>
      )}

      <h3>Charaktere fusionieren</h3>
      <FusionPanel />
    </div>
  );
}

export default Profile;