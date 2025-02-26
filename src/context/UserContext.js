import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

export const UserContext = createContext();

const LOCAL_STORAGE_KEY = 'rickMortyUserData';

const CONSTANTS = {
  LEVEL_UP_THRESHOLD: 500,
  BASE_COIN_SPEED: 1,
  UPGRADE_COST_BASE: 100,
  SPEED_UPGRADE_BONUS: 0.5,
  RARITY_SPEED_BONUS: 0.5,
  OFFLINE_GEN_FACTOR: 0.5,
  COIN_GEN_INTERVAL: 60000,
  MAX_OFFLINE_HOURS: 24
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

  const { 
    unlockedCharacters, 
    level, 
    rewardPoints, 
    coins, 
    selectedCoinFarm,
    lastOnline 
  } = userData;

  const coinIntervalRef = useRef(null);

  // Berechnet effektive Geschwindigkeit eines Charakters
  const computeEffectiveSpeed = useCallback((character) => {
    if (!character) return 0;
    const upgradeBonus = ((character.characterLevel || 1) - 1) * CONSTANTS.SPEED_UPGRADE_BONUS;
    const rarityBonus = character.rarity
      ? (character.rarity - 1) * CONSTANTS.RARITY_SPEED_BONUS
      : 0;
    return (character.baseSpeed || 1) + upgradeBonus + rarityBonus;
  }, []);

  // Gesamte Coin-Generierungsgeschwindigkeit
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

  // Sichere Update-Funktion
  const updateUserData = useCallback((updater) => {
    setUserData(prevData => {
      const newData = typeof updater === 'function' 
        ? updater(prevData) 
        : { ...prevData, ...updater };
        
      newData.lastOnline = Date.now();
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error("Fehler beim Speichern der Benutzerdaten:", error);
      }
      return newData;
    });
  }, []);

  // Offline-Zeit auswerten
  useEffect(() => {
    const calculateOfflineCoins = () => {
      const now = Date.now();
      const offlineTime = now - lastOnline;
      if (offlineTime < 10000) return; // zu kurz, keine Berechnung

      const maxOfflineTime = CONSTANTS.MAX_OFFLINE_HOURS * 60 * 60 * 1000;
      const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime);
      const offlineMinutes = effectiveOfflineTime / 60000;
      const offlineCoins = Math.floor(
        offlineMinutes * coinGenerationSpeed * CONSTANTS.OFFLINE_GEN_FACTOR
      );
      
      if (offlineCoins > 0) {
        updateUserData(prev => ({
          ...prev,
          coins: prev.coins + offlineCoins
        }));
        console.log(`Du hast ${offlineCoins} Münzen im Offline-Modus verdient!`);
      }
    };
    calculateOfflineCoins();
  }, [lastOnline, coinGenerationSpeed, updateUserData]);

  // Passive Coin-Generierung (Intervall)
  useEffect(() => {
    if (coinIntervalRef.current) {
      clearInterval(coinIntervalRef.current);
    }
    coinIntervalRef.current = setInterval(() => {
      updateUserData(prev => ({
        ...prev,
        coins: prev.coins + coinGenerationSpeed
      }));
    }, CONSTANTS.COIN_GEN_INTERVAL);
    
    return () => {
      if (coinIntervalRef.current) {
        clearInterval(coinIntervalRef.current);
        coinIntervalRef.current = null;
      }
    };
  }, [coinGenerationSpeed, updateUserData]);

  // Reward Points hinzufügen + ggf. Level-Up
  const addRewardPoints = useCallback((points) => {
    updateUserData(prev => {
      const newPoints = prev.rewardPoints + points;
      const levelThreshold = prev.level * CONSTANTS.LEVEL_UP_THRESHOLD;
      
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

  // Mission abgeschlossen
  const completeMission = useCallback((reward = 100) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Quiz richtig beantwortet
  const answerQuizCorrectly = useCallback((reward = 50) => {
    addRewardPoints(reward);
  }, [addRewardPoints]);

  // Charakter freischalten
  const unlockCharacter = useCallback((character) => {
    updateUserData(prev => {
      if (prev.unlockedCharacters.some(c => c.id === character.id)) {
        return prev;
      }
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
      const newCharacters = [...prev.unlockedCharacters];
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

  // Coin-Farm-Charakter auswählen
  const selectCoinFarm = useCallback((characterId) => {
    updateUserData(prev => ({
      ...prev,
      selectedCoinFarm: characterId
    }));
  }, [updateUserData]);

  // Charakter fusionieren
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
        image: char1.image,
        characterLevel: Math.max(char1.characterLevel || 1, char2.characterLevel || 1) + 1,
        baseSpeed: ((char1.baseSpeed || 1) + (char2.baseSpeed || 1)) / 1.5,
        rarity: Math.min(5, Math.ceil((char1.rarity + char2.rarity) / 1.5)),
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

  // Charakter verkaufen
  const sellCharacter = useCallback((characterId) => {
    updateUserData(prev => {
      const charIndex = prev.unlockedCharacters.findIndex(c => c.id === characterId);
      if (charIndex === -1) {
        console.error("Character not found!");
        return prev;
      }
      if (characterId === prev.selectedCoinFarm) {
        console.error("Can't sell active farm character!");
        return prev;
      }
      const character = prev.unlockedCharacters[charIndex];
      const sellPrice = Math.floor(
        (character.characterLevel || 1) * 50 + 
        (character.rarity || 1) * 100
      );
      return {
        ...prev,
        coins: prev.coins + sellPrice,
        unlockedCharacters: prev.unlockedCharacters.filter(c => c.id !== characterId)
      };
    });
  }, [updateUserData]);

  // Levelaufstiegsbelohnung
  const claimLevelUpReward = useCallback((claimedLevel) => {
    updateUserData(prev => {
      const hasClaimed = prev.claimedLevelRewards?.includes(claimedLevel);
      if (hasClaimed || prev.level < claimedLevel) {
        console.error("Reward already claimed or level not reached!");
        return prev;
      }
      const coinReward = claimedLevel * 200;
      return {
        ...prev,
        coins: prev.coins + coinReward,
        claimedLevelRewards: [...(prev.claimedLevelRewards || []), claimedLevel]
      };
    });
  }, [updateUserData]);

  // Täglicher Bonus
  const claimDailyBonus = useCallback(() => {
    updateUserData(prev => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastClaimDate = prev.lastDailyBonus?.split('T')[0];
      if (lastClaimDate === today) {
        console.error("Daily bonus already claimed today!");
        return prev;
      }
      let streak = 1;
      if (prev.dailyBonusStreak && lastClaimDate) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        streak = lastClaimDate === yesterdayStr 
          ? prev.dailyBonusStreak + 1 
          : 1;
      }
      const baseBonus = 50;
      const streakMultiplier = Math.min(3, streak / 3);
      const bonusAmount = Math.floor(baseBonus * streakMultiplier);
      return {
        ...prev,
        coins: prev.coins + bonusAmount,
        lastDailyBonus: now.toISOString(),
        dailyBonusStreak: streak
      };
    });
  }, [updateUserData]);

  const contextValue = useMemo(() => ({
    unlockedCharacters,
    level,
    rewardPoints,
    coins,
    selectedCoinFarm,
    coinGenerationSpeed,
    dailyBonusAvailable:
      !userData.lastDailyBonus ||
      new Date().toISOString().split('T')[0] !== userData.lastDailyBonus.split('T')[0],
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