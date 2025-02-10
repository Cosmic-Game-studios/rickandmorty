import React, { useContext, useEffect, useMemo } from 'react';
import { UserContext } from '../context/UserContext';

function CharacterCard({ character, unlocked }) {
  const { level, unlockCharacter } = useContext(UserContext);
  const {
    requiredLevel = 2,
    baseSpeed = 1,
    characterLevel = 1,
    rarity,
    image,
    name,
  } = character;

  const autoUnlocked = level >= requiredLevel;

  // Automatically unlock when the user's level is reached
  useEffect(() => {
    if (autoUnlocked && !unlocked) {
      unlockCharacter(character);
    }
  }, [autoUnlocked, unlocked, character, unlockCharacter]);

  // Calculate the effective speed only when the values change
  const effectiveSpeed = useMemo(() => {
    const upgradeBonus = (characterLevel - 1) * 0.5;
    const rarityBonus = rarity ? (rarity - 1) * 0.5 : 0;
    return baseSpeed + upgradeBonus + rarityBonus;
  }, [baseSpeed, characterLevel, rarity]);

  return (
    <div className={`character-card ${autoUnlocked || unlocked ? 'unlocked' : 'locked'}`}>
      <img src={image} alt={name} loading="lazy" />
      <h3>{name}</h3>
      {autoUnlocked || unlocked ? (
        <>
          <p>Unlocked</p>
          <p>Speed: {effectiveSpeed.toFixed(2)}</p>
          <p>Rarity: {rarity || "Not specified"}</p>
        </>
      ) : (
        <p className="required-level">Required level: {requiredLevel}</p>
      )}
    </div>
  );
}

export default React.memo(CharacterCard);
