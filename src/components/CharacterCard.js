import React, { useContext, useEffect, useMemo } from 'react';
import { UserContext } from '../context/UserContext';

function CharacterCard({ character, unlocked }) {
  const { level, unlockCharacter } = useContext(UserContext);

  // Destrukturiere die relevanten Eigenschaften aus character mit Standardwerten
  const {
    requiredLevel = 2,
    baseSpeed = 1,
    characterLevel = 1,
    rarity,
    image,
    name,
  } = character;

  const autoUnlocked = level >= requiredLevel;

  // Automatisches Freischalten, sobald der User-Level das erforderliche Level erreicht
  useEffect(() => {
    if (autoUnlocked && !unlocked) {
      unlockCharacter(character);
    }
  }, [autoUnlocked, unlocked, character, unlockCharacter]);

  // Berechne die effektive Geschwindigkeit nur, wenn sich die Werte ändern
  const effectiveSpeed = useMemo(() => {
    const upgradeBonus = (characterLevel - 1) * 0.5;
    const rarityBonus = rarity ? (rarity - 1) * 0.5 : 0;
    return baseSpeed + upgradeBonus + rarityBonus;
  }, [baseSpeed, characterLevel, rarity]);

  return (
    <div className={`character-card ${autoUnlocked || unlocked ? 'unlocked' : 'locked'}`}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {autoUnlocked || unlocked ? (
        <>
          <p>Freigeschaltet</p>
          <p>Speed: {effectiveSpeed.toFixed(2)}</p>
          <p>Rarity: {rarity ? rarity : "Nicht festgelegt"}</p>
        </>
      ) : (
        <p className="required-level">Benötigtes Level: {requiredLevel}</p>
      )}
    </div>
  );
}

export default React.memo(CharacterCard);
