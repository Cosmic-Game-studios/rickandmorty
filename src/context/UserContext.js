import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

export const UserContext = createContext();

const LOCAL_STORAGE_KEY = 'rickMortyUserData';

// Konstanten für bessere Wartbarkeit und Anpassung
const CONSTANTS = {
  LEVEL_UP_THRESHOLD: 500,      // Basis-Punkte zum Level-Up (wird mit Level multipliziert)
  BASE_COIN_SPEED: 1,           // Basis-Coin-Generierung pro Minute
  UPGRADE_COST_BASE: 100,       // Basis-Kosten für Charakter-Upgrades
  SPEED_UPGRADE_BONUS: 0.5,     // Geschwindigkeitsbonus pro Level
  RARITY_SPEED_BONUS: 0.5,      // Geschwindigkeitsbonus pro Rarity-Stufe
  OFFLINE_GEN_FACTOR: 0.5,      // Faktor für Offline-Generierung (50% Effizienz)
  COIN_GEN_INTERVAL: 60000,     // Intervall für Coin-Generierung (1 Minute)
  MAX_OFFLINE_HOURS: 24,        // Maximale Stunden für Offline-Generierung
};

export function UserProvider({ children }) {
  // Lade Daten aus localStorage oder setze Standardwerte
  const [userData, setUserData] = useState(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
      return {
        unlockedCharacters: storedData.unlockedCharacters || [],
        level: storedData.level || 1,
        rewardPoints: storedData.rewardPoints || 0,
        coins: storedData.coins || 0,
        selectedCoinFarm: storedData.selectedCoinFarm || null,
        lastOnline: storedData.lastOnline || Date.now()
      };
    } catch (error) {
      console.error("Fehler beim Laden der Benutzerdaten:", error);
      return {
        unlockedCharacters: [],
        level: 1,
        rewardPoints: 0,
        coins: 0,
        selectedCoinFarm: null,
        lastOnline: Date.now()
      };
    }
  });

  // Destructure für einfacheren Zugriff und bessere Lesbarkeit
  const { 
    unlockedCharacters, 
    level, 
    rewardPoints, 
    coins, 
    selectedCoinFarm,
    lastOnline 
  } = userData;

  // Ref für Intervall-Cleanup
  const coinIntervalRef = useRef(null);

  // Hilfsfunktion: Berechnet die effektive Geschwindigkeit eines Charakters
  const computeEffectiveSpeed = useCallback((character) => {
    if (!character) return 0;
    
    const upgradeBonus = ((character.characterLevel || 1) - 1) * CONSTANTS.SPEED_UPGRADE_BONUS;
    const rarityBonus = character.rarity ? (character.rarity - 1) * CONSTANTS.RARITY_SPEED_BONUS : 0;
    return (character.baseSpeed || 1) + upgradeBonus + rarityBonus;
  }, []);

  // Dynamisch berechnete Coin-Generierungsgeschwindigkeit
  const coinGenerationSpeed = useMemo(() => {
    const baseSpeed = CONSTANTS.BASE_COIN_SPEED;
    let additionalSpeed = 0;
    
    if (selectedCoinFarm) {
      const farmCharacter = unlockedCharacters.find(c => c.id === selectedCoinFarm);
      if (farmCharacter) {
        additionalSpeed = computeEffectiveSpeed(farmCharacter);
      }
    }
    
    return baseSpeed + additionalSpeed;
  }, [unlockedCharacters, selectedCoinFarm, computeEffectiveSpeed]);

  // Sichere Update-Funktion für den UserData-State
  const updateUserData = useCallback((updater) => {
    setUserData(prevData => {
      const newData = typeof updater === 'function' 
        ? updater(prevData) 
        : { ...prevData, ...updater };
        
      // Speichere aktuelle Zeit bei jedem Update
      newData.lastOnline = Date.now();
      
      // Speichere in localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error("Fehler beim Speichern der Benutzerdaten:", error);
      }
      
      return newData;
    });
  }, []);

  // Berechne die während Offline-Zeit verdienten Coins bei App-Start
  useEffect(() => {
    const calculateOfflineCoins = () => {
      const now = Date.now();
      const offlineTime = now - lastOnline;
      
      // Ignoriere sehr kurze Offline-Zeiten
      if (offlineTime < 10000) return;
      
      // Begrenze die maximale Offline-Zeit für Coin-Generierung
      const maxOfflineTime = CONSTANTS.MAX_OFFLINE_HOURS * 60 * 60 * 1000;
      const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime);
      
      // Berechne verdiente Coins basierend auf der Offline-Zeit (in Minuten)
      const offlineMinutes = effectiveOfflineTime / 60000;
      const offlineCoins = Math.floor(offlineMinutes * coinGenerationSpeed * CONSTANTS.OFFLINE_GEN_FACTOR);
      
      if (offlineCoins > 0) {
        updateUserData(prev => ({
          ...prev,
          coins: prev.coins + offlineCoins
        }));
        
        // Hier könnte eine Benachrichtigung angezeigt werden
        console.log(`Du hast ${offlineCoins} Münzen verdient, während du offline warst!`);
      }
    };
    
    calculateOfflineCoins();
  }, [lastOnline, coinGenerationSpeed, updateUserData]);

  // Passive Coin-Generierung: Coins werden jede Minute anhand des coinGenerationSpeed hinzugefügt
  useEffect(() => {
    // Cleanup vorheriges Intervall
    if (coinIntervalRef.current) {
      clearInterval(coinIntervalRef.current);
    }
    
    coinIntervalRef.current = setInterval(() => {
      updateUserData(prev => ({
        ...prev,
        coins: prev.coins + coinGenerationSpeed
      }));
    }, CONSTANTS.COIN_GEN_INTERVAL);
    
    // Cleanup bei Unmount
    return () => {
      if (coinIntervalRef.current) {
        clearInterval(coinIntervalRef.current);
        coinIntervalRef.current = null;
      }
    };
  }, [coinGenerationSpeed, updateUserData]);

  // Fügt Reward Points hinzu und erhöht ggf. den Level
  const addRewardPoints = useCallback((points) => {
    updateUserData(prev => {
      const newPoints = prev.rewardPoints + points;
      const levelThreshold = prev.level * CONSTANTS.LEVEL_UP_THRESHOLD;
      
      // Überprüfe Level-Up
      if (newPoints >= levelThreshold) {
        return {
          ...prev,
          rewardPoints: newPoints,
          level: prev.level + 1
        };
      }
      
      return {
        ...prev,
        rewardPoints: newPoints
      };
    });
  }, [updateUserData]);

  // Coins hinzufügen
  const addCoins = useCallback((amount) => {
    updateUserData(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  }, [updateUserData]);

  // Mission erfolgreich abgeschlossen
  const completeMission = useCallback((reward = 100) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Quiz korrekt beantwortet
  const answerQuizCorrectly = useCallback((reward = 50) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Charakter freischalten
  const unlockCharacter = useCallback((character) => {
    updateUserData(prev => {
      // Prüfe, ob der Charakter bereits freigeschaltet ist
      if (prev.unlockedCharacters.some(c => c.id === character.id)) {
        return prev;
      }
      
      // Zufälliger Rarity-Wert zwischen 1 und 5
      const randomRarity = Math.floor(Math.random() * 5) + 1;
      
      const newCharacter = { 
        ...character, 
        characterLevel: 1, 
        baseSpeed: 1, 
        rarity: randomRarity,
        unlockDate: new Date().toISOString() 
      };
      
      return {
        ...prev,
        unlockedCharacters: [...prev.unlockedCharacters, newCharacter]
      };
    });
  }, [updateUserData]);

  // Charakter upgraden
  const upgradeCharacter = useCallback((characterId) => {
    updateUserData(prev => {
      const charIndex = prev.unlockedCharacters.findIndex(c => c.id === characterId);
      
      if (charIndex === -1) {
        console.error("Character not found!");
        return prev;
      }
      
      const character = prev.unlockedCharacters[charIndex];
      const currentLevel = character.characterLevel || 1;
      const cost = CONSTANTS.UPGRADE_COST_BASE * currentLevel;
      
      if (prev.coins < cost) {
        console.error("Not enough coins!");
        return prev;
      }
      
      // Clone the characters array
      const newCharacters = [...prev.unlockedCharacters];
      
      // Update the specific character
      newCharacters[charIndex] = {
        ...character,
        characterLevel: currentLevel + 1
      };
      
      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedCharacters: newCharacters
      };
    });
  }, [updateUserData]);

  // Auswahl eines Coin-Farm-Charakters
  const selectCoinFarm = useCallback((characterId) => {
    updateUserData(prev => ({
      ...prev,
      selectedCoinFarm: characterId
    }));
  }, [updateUserData]);

  // Fusionsfunktion: Kombiniert zwei freigeschaltete Charaktere
  const fuseCharacters = useCallback((id1, id2) => {
    updateUserData(prev => {
      const char1 = prev.unlockedCharacters.find(c => c.id === id1);
      const char2 = prev.unlockedCharacters.find(c => c.id === id2);
      
      if (!char1 || !char2) {
        console.error("Both characters must be unlocked!");
        return prev;
      }
      
      const newCharacter = {
        id: `fusion-${Date.now()}`,
        name: `Fusion: ${char1.name} & ${char2.name}`,
        image: char1.image, // Wir könnten hier ein Fusionsbild erstellen
        characterLevel: Math.max(char1.characterLevel || 1, char2.characterLevel || 1) + 1,
        baseSpeed: ((char1.baseSpeed || 1) + (char2.baseSpeed || 1)) / 1.5, // Etwas besser als Durchschnitt
        rarity: Math.min(5, Math.ceil((char1.rarity + char2.rarity) / 1.5)), // Rarity-Boost, max 5
        isFusion: true,
        parents: [id1, id2],
        unlockDate: new Date().toISOString()
      };
      
      return {
        ...prev,
        unlockedCharacters: prev.unlockedCharacters
          .filter(c => c.id !== id1 && c.id !== id2)
          .concat(newCharacter)
      };
    });
  }, [updateUserData]);

  // Neues Feature: Charakter verkaufen für Coins
  const sellCharacter = useCallback((characterId) => {
    updateUserData(prev => {
      const charIndex = prev.unlockedCharacters.findIndex(c => c.id === characterId);
      
      if (charIndex === -1) {
        console.error("Character not found!");
        return prev;
      }
      
      const character = prev.unlockedCharacters[charIndex];
      
      // Verkaufspreis basierend auf Level und Seltenheit
      const sellPrice = Math.floor(
        (character.characterLevel || 1) * 50 + 
        (character.rarity || 1) * 100
      );
      
      // Kann den aktuell ausgewählten Farm-Charakter nicht verkaufen
      if (characterId === prev.selectedCoinFarm) {
        console.error("Can't sell active farm character!");
        return prev;
      }
      
      return {
        ...prev,
        coins: prev.coins + sellPrice,
        unlockedCharacters: prev.unlockedCharacters.filter(c => c.id !== characterId)
      };
    });
  }, [updateUserData]);
  
  // Neues Feature: Levelaufstiegsbelohnungen
  const claimLevelUpReward = useCallback((claimedLevel) => {
    updateUserData(prev => {
      // Prüfe, ob die Belohnung noch nicht beansprucht wurde
      const hasClaimedReward = prev.claimedLevelRewards?.includes(claimedLevel);
      
      if (hasClaimedReward || prev.level < claimedLevel) {
        console.error("Reward already claimed or level not reached!");
        return prev;
      }
      
      // Belohnungsberechnung - steigt mit dem Level
      const coinReward = claimedLevel * 200;
      
      return {
        ...prev,
        coins: prev.coins + coinReward,
        claimedLevelRewards: [...(prev.claimedLevelRewards || []), claimedLevel]
      };
    });
  }, [updateUserData]);
  
  // Neues Feature: Täglichen Bonus beanspruchen
  const claimDailyBonus = useCallback(() => {
    updateUserData(prev => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastClaimDate = prev.lastDailyBonus?.split('T')[0];
      
      // Prüfe, ob der Bonus heute bereits beansprucht wurde
      if (lastClaimDate === today) {
        console.error("Daily bonus already claimed today!");
        return prev;
      }
      
      // Berechne Tagesstreak
      let streak = 1;
      if (prev.dailyBonusStreak && lastClaimDate) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        // Streak erhöhen, wenn gestern beansprucht, sonst zurücksetzen
        streak = lastClaimDate === yesterdayStr 
          ? prev.dailyBonusStreak + 1 
          : 1;
      }
      
      // Bonusberechnung - höherer Bonus bei längeren Streaks
      const baseBonus = 50;
      const streakMultiplier = Math.min(3, streak / 3); // Max. 3x nach 9 Tagen
      const bonusAmount = Math.floor(baseBonus * streakMultiplier);
      
      return {
        ...prev,
        coins: prev.coins + bonusAmount,
        lastDailyBonus: now.toISOString(),
        dailyBonusStreak: streak
      };
    });
  }, [updateUserData]);

  // Kontextwert mit useMemo für Performance-Optimierung
  const contextValue = useMemo(() => ({
    // States
    unlockedCharacters,
    level,
    rewardPoints,
    coins,
    selectedCoinFarm,
    
    // Berechnete Werte
    coinGenerationSpeed,
    
    // Status-Informationen
    dailyBonusAvailable: !userData.lastDailyBonus || 
      new Date().toISOString().split('T')[0] !== userData.lastDailyBonus?.split('T')[0],
    dailyBonusStreak: userData.dailyBonusStreak || 0,
    
    // Aktionen
    completeMission,
    answerQuizCorrectly,
    unlockCharacter,
    upgradeCharacter,
    selectCoinFarm,
    addCoins,
    fuseCharacters,
    sellCharacter,
    claimLevelUpReward,
    claimDailyBonus,
    
    // Hilfsfunktionen
    computeEffectiveSpeed
  }), [
    unlockedCharacters,
    level,
    rewardPoints,
    coins,
    selectedCoinFarm,
    userData.lastDailyBonus,
    userData.dailyBonusStreak,
    coinGenerationSpeed,
    completeMission,
    answerQuizCorrectly,
    unlockCharacter,
    upgradeCharacter,
    selectCoinFarm,
    addCoins,
    fuseCharacters,
    sellCharacter,
    claimLevelUpReward,
    claimDailyBonus,
    computeEffectiveSpeed
  ]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;