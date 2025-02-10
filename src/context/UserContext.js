import React, { createContext, useState, useEffect, useMemo } from 'react';

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
  const computeEffectiveSpeed = (character) => {
    const upgradeBonus = (character.characterLevel - 1) * 0.5;
    const rarityBonus = character.rarity ? (character.rarity - 1) * 0.5 : 0;
    return character.baseSpeed + upgradeBonus + rarityBonus;
  };

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
  }, [unlockedCharacters, selectedCoinFarm]);

  // Passive Coin-Generierung: Coins werden jede Minute anhand des coinGenerationSpeed hinzugefügt
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + coinGenerationSpeed);
    }, 60000); // 60000 ms = 1 Minute
    return () => clearInterval(interval);
  }, [coinGenerationSpeed]);

  // Zustand in localStorage speichern, sobald sich relevante Werte ändern
  useEffect(() => {
    const data = { unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm]);

  // Fügt Reward Points hinzu und erhöht ggf. den Level, wenn ein Schwellenwert erreicht wird
  const addRewardPoints = (points) => {
    setRewardPoints(prev => {
      const newPoints = prev + points;
      if (newPoints >= level * 500) {
        setLevel(current => current + 1);
      }
      return newPoints;
    });
  };

  // Coins hinzufügen (z. B. auch über einen täglichen Bonus)
  const addCoins = (amount) => {
    setCoins(prev => prev + amount);
  };

  // Mission erfolgreich abgeschlossen: Belohne den Spieler mit Coins bzw. Reward Points.
  const completeMission = (reward = 100) => {
    addRewardPoints(reward);
  };

  // Quiz korrekt beantwortet: Belohne den Spieler.
  const answerQuizCorrectly = (reward = 50) => {
    addRewardPoints(reward);
  };

  // Charakter freischalten: Beim ersten Unlock wird der Charakter mit Startwerten versehen.
  const unlockCharacter = (character) => {
    setUnlockedCharacters(prev => {
      // Nur hinzufügen, wenn der Charakter noch nicht freigeschaltet wurde
      if (!prev.find(c => c.id === character.id)) {
        const randomRarity = Math.floor(Math.random() * 5) + 1; // Zufälliger Rarity-Wert zwischen 1 und 5
        return [
          ...prev, 
          { 
            ...character, 
            characterLevel: 2, 
            baseSpeed: 1, 
            rarity: randomRarity 
          }
        ];
      }
      return prev;
    });
  };

  // Charakter upgraden: Kosten 100 Coins, wenn genügend Coins vorhanden sind
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

  // Auswahl eines Coin-Farm-Charakters
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
      // Level: Maximum der beiden + 1
      characterLevel: Math.max(char1.characterLevel, char2.characterLevel) + 1,
      // Basisgeschwindigkeit als Durchschnitt der beiden
      baseSpeed: (char1.baseSpeed + char2.baseSpeed) / 2,
      // Seltenheit als aufgerundeter Durchschnitt
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
        addCoins,       // Für den täglichen Bonus oder andere Coin-Aktionen
        fuseCharacters  // Fusionsfunktion
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
