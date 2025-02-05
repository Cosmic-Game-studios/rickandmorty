import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';

function CharacterCard({ character, unlocked }) {
  const { level, unlockCharacter } = useContext(UserContext);
  
  // Wenn kein requiredLevel definiert ist, nehmen wir Standardwert 2
  const requiredLevel = character.requiredLevel || 2;
  const autoUnlocked = level >= requiredLevel;

  // Automatisches Freischalten: Sobald der User-Level das erforderliche Level erreicht und
  // der Charakter noch nicht freigeschaltet wurde (unlocked === false), wird unlockCharacter aufgerufen.
  useEffect(() => {
    if (autoUnlocked && !unlocked) {
      unlockCharacter(character);
    }
  }, [autoUnlocked, unlocked, character, unlockCharacter]);

  // Berechne die effektive Geschwindigkeit:
  // effectiveSpeed = baseSpeed + Upgradebonus + Rarity-Bonus
  // Upgradebonus: (characterLevel - 1) * 0.5
  // Rarity-Bonus: ((rarity - 1) * 0.5) – falls character.rarity definiert ist
  const effectiveSpeed =
    (character.baseSpeed || 1) +
    (((character.characterLevel || 1) - 1) * 0.5) +
    ((character.rarity ? (character.rarity - 1) * 0.5 : 0));

  return (
    <div className={`character-card ${autoUnlocked || unlocked ? 'unlocked' : 'locked'}`}>
      <img src={character.image} alt={character.name} />
      <h3>{character.name}</h3>
      {autoUnlocked || unlocked ? (
        <>
          <p>Freigeschaltet</p>
          <p>Speed: {effectiveSpeed.toFixed(2)}</p>
          <p>Rarity: {character.rarity ? character.rarity : "Nicht festgelegt"}</p>
        </>
      ) : (
        <p className="required-level">Benötigtes Level: {requiredLevel}</p>
      )}
    </div>
  );
}

export default CharacterCard;