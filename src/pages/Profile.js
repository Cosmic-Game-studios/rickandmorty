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

  // Calculate the threshold for the next level
  const nextLevelThreshold = level * 500;
  const pointsToNextLevel =
    nextLevelThreshold - rewardPoints > 0
      ? nextLevelThreshold - rewardPoints
      : 0;

  // Helper for calculating effective speed:
  // effectiveSpeed = baseSpeed + ((characterLevel - 1) * 0.5) + ((rarity - 1) * 0.5)
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
     Here we display e.g. 12 characters per page.
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
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <div className="profile-card">
          <h3>Level</h3>
          <p>{level}</p>
        </div>
        <div className="profile-card">
          <h3>Reward Points</h3>
          <p>{rewardPoints}</p>
        </div>
        <div className="profile-card">
          <h3>Next Level</h3>
          <p>{pointsToNextLevel} points needed</p>
        </div>
        <div className="profile-card">
          <h3>Coins</h3>
          <p>{coins}</p>
        </div>
      </div>

      <h3>Select an unlocked character for your Coin Farm</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <div className="coin-farm-scroll">
            {paginatedCoinFarmCharacters.map((character) => (
              <div
                key={character.id}
                className={`coin-farm-card ${
                  selectedCoinFarm === character.id ? 'selected' : ''
                }`}
                onClick={() => selectCoinFarm(character.id)}
              >
                <img src={character.image} alt={character.name} />
                <p>{character.name}</p>
              </div>
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
        <p>No characters unlocked.</p>
      )}

      <h3>Unlocked Characters</h3>
      {unlockedCharacters.length > 0 ? (
        <>
          <div className="unlocked-list">
            {paginatedCharacters.map((character) => (
              <div key={character.id} className="unlocked-card">
                <img src={character.image} alt={character.name} />
                <div className="card-details">
                  <p>{character.name}</p>
                  <p>Character Level: {character.characterLevel}</p>
                  <p>Speed: {calculateEffectiveSpeed(character)}</p>
                  <p>
                    Rarity: {character.rarity ? character.rarity : 'Not set'}
                  </p>
                </div>
                <button
                  onClick={() => upgradeCharacter(character.id)}
                  className="upgrade-button"
                >
                  Upgrade (Cost: {100 * (character.characterLevel || 1)} Coins)
                </button>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={goToPreviousPage} disabled={currentPage === 0}>
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
        <p>No characters unlocked.</p>
      )}

      <h3>Fuse Characters</h3>
      <FusionPanel />
    </div>
  );
}

export default Profile;
