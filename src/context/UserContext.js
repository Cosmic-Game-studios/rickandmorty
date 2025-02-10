import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

export const UserContext = createContext();

const LOCAL_STORAGE_KEY = 'rickMortyUserData';

export function UserProvider({ children }) {
  // Gespeicherte Daten aus dem localStorage laden oder Standardwerte setzen
  const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  const [unlockedCharacters, setUnlockedCharacters] = useState(storedData.unlockedCharacters || []);
  const [level, setLevel] = useState(storedData.level || 1);
  const [rewardPoints, setRewardPoints] = useState(storedData.rewardPoints || 0);
  const [coins, setCoins] = useState(storedData.coins || 0);
  const [selectedCoinFarm, setSelectedCoinFarm] = useState(storedData.selectedCoinFarm || null);

  // Hilfsfunktion: Berechnet die effektive Geschwindigkeit eines Charakters
  const computeEffectiveSpeed = useCallback((character) => {
    const upgradeBonus = (character.characterLevel - 1) * 0.5;
    const rarityBonus = character.rarity ? (character.rarity - 1) * 0.5 : 0;
    return character.baseSpeed + upgradeBonus + rarityBonus;
  }, []);

  // Dynamisch berechnete Coin-Generierungsgeschwindigkeit:
  // Basisgeschwindigkeit (mindestens 1 Coin pro Minute) + effektive Geschwindigkeit des ausgewählten Coin-Farm-Charakters (falls ausgewählt)
  const coinGenerationSpeed = useMemo(() => {
    const baseSpeed = 1;
    let additionalSpeed = 0;
    if (selectedCoinFarm) {
      const farmCharacter = unlockedCharacters.find(c => c.id === selectedCoinFarm);
      if (farmCharacter) {
        additionalSpeed = computeEffectiveSpeed(farmCharacter);
      }
    }
    return baseSpeed + additionalSpeed;
  }, [unlockedCharacters, selectedCoinFarm, computeEffectiveSpeed]);

  // Passive Coin-Generierung: Coins werden jede Minute anhand des coinGenerationSpeed hinzugefügt
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => prevCoins + coinGenerationSpeed);
    }, 60000); // 60000 ms = 1 Minute
    return () => clearInterval(interval);
  }, [coinGenerationSpeed]);

  // Zustand in localStorage speichern, sobald sich relevante Werte ändern
  useEffect(() => {
    const data = { unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm]);

  // Fügt Reward Points hinzu und erhöht ggf. den Level, wenn ein Schwellenwert erreicht wird
  const addRewardPoints = useCallback((points) => {
    setRewardPoints(prevPoints => {
      const newPoints = prevPoints + points;
      if (newPoints >= level * 500) {
        setLevel(currentLevel => currentLevel + 1);
      }
      return newPoints;
    });
  }, [level]);

  // Coins hinzufügen (z. B. auch über einen täglichen Bonus)
  const addCoins = useCallback((amount) => {
    setCoins(prevCoins => prevCoins + amount);
  }, []);

  // Mission erfolgreich abgeschlossen: Belohne den Spieler
  const completeMission = useCallback((reward = 100) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Quiz korrekt beantwortet: Belohne den Spieler
  const answerQuizCorrectly = useCallback((reward = 50) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Charakter freischalten: Beim ersten Unlock wird der Charakter mit Startwerten versehen
  const unlockCharacter = useCallback((character) => {
    setUnlockedCharacters(prevChars => {
      // Nur hinzufügen, wenn der Charakter noch nicht freigeschaltet wurde
      if (!prevChars.find(c => c.id === character.id)) {
        const randomRarity = Math.floor(Math.random() * 5) + 1; // Zufälliger Rarity-Wert zwischen 1 und 5
        return [
          ...prevChars, 
          { 
            ...character, 
            characterLevel: 2, 
            baseSpeed: 1, 
            rarity: randomRarity 
          }
        ];
      }
      return prevChars;
    });
  }, []);

  // Charakter upgraden: Kosten steigen dynamisch – der Upgrade kostet 100 Coins mal dem aktuellen Level des Charakters
  const upgradeCharacter = useCallback((characterId) => {
    setUnlockedCharacters(prevChars => {
      const charToUpgrade = prevChars.find(c => c.id === characterId);
      if (!charToUpgrade) {
        alert("Character not found!");
        return prevChars;
      }
      const currentLevel = charToUpgrade.characterLevel || 1;
      const cost = 100 * currentLevel;
      if (coins < cost) {
        alert("Not enough coins!");
        return prevChars;
      }
      // Coins werden abgezogen
      setCoins(prevCoins => prevCoins - cost);
      // Charakter-Level wird erhöht
      return prevChars.map(c =>
        c.id === characterId ? { ...c, characterLevel: currentLevel + 1 } : c
      );
    });
  }, [coins]);

  // Auswahl eines Coin-Farm-Charakters
  const selectCoinFarm = useCallback((characterId) => {
    setSelectedCoinFarm(characterId);
  }, []);

  // Fusionsfunktion: Kombiniert zwei freigeschaltete Charaktere zu einem neuen Fusions-Charakter.
  // Die beiden ursprünglichen Charaktere werden aus der Liste entfernt.
  const fuseCharacters = useCallback((id1, id2) => {
    setUnlockedCharacters(prevChars => {
      const char1 = prevChars.find(c => c.id === id1);
      const char2 = prevChars.find(c => c.id === id2);
      if (!char1 || !char2) {
        alert("Both characters must be unlocked!");
        return prevChars;
      }
      const newCharacter = {
        id: Date.now(), // Generiere eine eindeutige ID
        name: `Fusion of ${char1.name} & ${char2.name}`,
        image: "https://via.placeholder.com/150?text=Fusion", // Platzhalterbild
        characterLevel: Math.max(char1.characterLevel, char2.characterLevel) + 1,
        baseSpeed: (char1.baseSpeed + char2.baseSpeed) / 2,
        rarity: Math.ceil((char1.rarity + char2.rarity) / 2),
        requiredLevel: Math.min(char1.requiredLevel, char2.requiredLevel)
      };
      return prevChars.filter(c => c.id !== id1 && c.id !== id2).concat(newCharacter);
    });
  }, []);

  // Den gesamten Kontextwert memoisieren
  const contextValue = useMemo(() => ({
    unlockedCharacters,
    unlockCharacter,
    level,
    rewardPoints,
    coins,
    completeMission,
    answerQuizCorrectly,
    upgradeCharacter,
    selectedCoinFarm,
    selectCoinFarm,
    addCoins,       // Für den täglichen Bonus oder andere Coin-Aktionen
    fuseCharacters  // Fusionsfunktion
  }), [
    unlockedCharacters,
    unlockCharacter,
    level,
    rewardPoints,
    coins,
    completeMission,
    answerQuizCorrectly,
    upgradeCharacter,
    selectedCoinFarm,
    selectCoinFarm,
    addCoins,
    fuseCharacters
  ]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
