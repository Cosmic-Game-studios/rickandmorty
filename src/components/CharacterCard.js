import React, { useContext, useEffect, useMemo } from 'react';
import { UserContext } from '../context/UserContext';

function CharacterCard({ character, unlocked }) {
  const { level, unlockCharacter, unlockedCharacters } = useContext(UserContext);
  
  // Falls der Charakter freigeschaltet ist, überschreibe die übergebenen Werte
  // mit den aktualisierten Werten aus unlockedCharacters
  const unlockedData = unlockedCharacters.find(c => c.id === character.id);
  const characterData = unlocked && unlockedData ? { ...character, ...unlockedData } : character;
  
  const {
    requiredLevel = 2,
    baseSpeed = 1,
    characterLevel = 1,
    rarity,
    image,
    name,
  } = characterData;

  const autoUnlocked = level >= requiredLevel;

  // Automatisches Freischalten, wenn der User-Level erreicht ist
  useEffect(() => {
    if (autoUnlocked && !unlocked) {
      unlockCharacter(character);
    }
  }, [autoUnlocked, unlocked, character, unlockCharacter]);

  // Berechne die effektive Geschwindigkeit basierend auf baseSpeed, Level-Bonus und rarity-Bonus
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
          <p>Rarity: {rarity !== undefined ? rarity : 'Not specified'}</p>
        </>
      ) : (
        <p className="required-level">Required level: {requiredLevel}</p>
      )}
    </div>
  );
}

export default React.memo(CharacterCard);
