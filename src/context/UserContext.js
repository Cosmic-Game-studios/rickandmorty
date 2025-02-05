import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const LOCAL_STORAGE_KEY = 'rickMortyUserData';

export function UserProvider({ children }) {
  // Lade gespeicherte Daten oder setze Standardwerte
  const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  const [unlockedCharacters, setUnlockedCharacters] = useState(storedData.unlockedCharacters || []);
  const [level, setLevel] = useState(storedData.level || 1);
  const [rewardPoints, setRewardPoints] = useState(storedData.rewardPoints || 0);
  const [coins, setCoins] = useState(storedData.coins || 0);
  const [selectedCoinFarm, setSelectedCoinFarm] = useState(storedData.selectedCoinFarm || null);

  // Passive Coin-Generierung (1 Coin pro Minute)
  const coinGenerationSpeed = 1;
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + coinGenerationSpeed);
    }, 60000);
    return () => clearInterval(interval);
  }, [coinGenerationSpeed]);

  // Speichere den Zustand in localStorage
  useEffect(() => {
    const data = { unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm]);

  const addRewardPoints = (points) => {
    setRewardPoints(prev => {
      const newPoints = prev + points;
      if (newPoints >= level * 500) {
        setLevel(current => current + 1);
      }
      return newPoints;
    });
  };

  // Coins hinzufügen
  const addCoins = (amount) => {
    setCoins(prev => prev + amount);
  };

  const completeMission = (reward = 100) => {
    addRewardPoints(reward);
  };

  const answerQuizCorrectly = (reward = 50) => {
    addRewardPoints(reward);
  };

  // Beim Freischalten eines Charakters:
  // - Setze den Startlevel auf 2, damit er sofort einen Bonus hat.
  // - Weise einen zufälligen Seltenheitsgrad (Rarity) zwischen 1 und 5 zu.
  const unlockCharacter = (character) => {
    setUnlockedCharacters(prev => {
      if (!prev.find(c => c.id === character.id)) {
        const randomRarity = Math.floor(Math.random() * 5) + 1; // Zufälliger Wert zwischen 1 und 5
        return [...prev, { ...character, characterLevel: 2, baseSpeed: 1, rarity: randomRarity }];
      }
      return prev;
    });
  };

  const upgradeCharacter = (characterId) => {
    const cost = 100;
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setUnlockedCharacters(prev =>
        prev.map(c =>
          c.id === characterId ? { ...c, characterLevel: (c.characterLevel || 1) + 1 } : c
        )
      );
    } else {
      alert("Nicht genügend Coins!");
    }
  };

  // Auswahl eines Coin Farm Charakters
  const selectCoinFarm = (characterId) => {
    setSelectedCoinFarm(characterId);
  };

  // Fusionsfunktion: Kombiniert zwei freigeschaltete Charaktere zu einem neuen Fusions-Charakter.
  // Die beiden ursprünglichen Charaktere werden aus der Liste entfernt.
  const fuseCharacters = (id1, id2) => {
    const char1 = unlockedCharacters.find(c => c.id === id1);
    const char2 = unlockedCharacters.find(c => c.id === id2);
    if (!char1 || !char2) {
      alert("Beide Charaktere müssen freigeschaltet sein!");
      return;
    }
    const newCharacter = {
      id: Date.now(), // Generiere eine eindeutige ID
      name: `Fusion of ${char1.name} & ${char2.name}`,
      image: "https://via.placeholder.com/150?text=Fusion", // Platzhalterbild
      // Setze den Level als Maximum der beiden plus 1
      characterLevel: Math.max(char1.characterLevel, char2.characterLevel) + 1,
      // Basisgeschwindigkeit als Durchschnitt der beiden
      baseSpeed: (char1.baseSpeed + char2.baseSpeed) / 2,
      // Seltenheit als aufgerundeter Durchschnitt der beiden
      rarity: Math.ceil((char1.rarity + char2.rarity) / 2),
      // Optional: Setze requiredLevel auf den niedrigeren Wert der beiden
      requiredLevel: Math.min(char1.requiredLevel, char2.requiredLevel)
    };
    // Entferne die beiden ursprünglichen Charaktere und füge den Fusions-Charakter hinzu
    setUnlockedCharacters(prev => prev.filter(c => c.id !== id1 && c.id !== id2).concat(newCharacter));
  };

  return (
    <UserContext.Provider
      value={{
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
        addCoins, // Wird für den täglichen Bonus genutzt
        fuseCharacters // Fusionsfunktion
      }}
    >
      {children}
    </UserContext.Provider>
  );
}