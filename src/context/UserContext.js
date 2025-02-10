import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const LOCAL_STORAGE_KEY = 'rickMortyUserData';

export function UserProvider({ children }) {
  // Load stored data from localStorage or set default values
  const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  const [unlockedCharacters, setUnlockedCharacters] = useState(storedData.unlockedCharacters || []);
  const [level, setLevel] = useState(storedData.level || 1);
  const [rewardPoints, setRewardPoints] = useState(storedData.rewardPoints || 0);
  const [coins, setCoins] = useState(storedData.coins || 0);
  const [selectedCoinFarm, setSelectedCoinFarm] = useState(storedData.selectedCoinFarm || null);

  // Passive coin generation: 1 coin per minute
  const coinGenerationSpeed = 1;
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + coinGenerationSpeed);
    }, 60000);
    return () => clearInterval(interval);
  }, [coinGenerationSpeed]);

  // Store state in localStorage whenever relevant values change
  useEffect(() => {
    const data = { unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [unlockedCharacters, level, rewardPoints, coins, selectedCoinFarm]);

  // Add reward points and increase level if a certain threshold is reached.
  const addRewardPoints = (points) => {
    setRewardPoints(prev => {
      const newPoints = prev + points;
      if (newPoints >= level * 500) {
        setLevel(current => current + 1);
      }
      return newPoints;
    });
  };

  // Add coins (e.g., through a daily bonus)
  const addCoins = (amount) => {
    setCoins(prev => prev + amount);
  };

  // Mission completed successfully: Reward the player with coins or reward points.
  const completeMission = (reward = 100) => {
    addRewardPoints(reward);
  };

  // Quiz answered correctly: Reward the player.
  const answerQuizCorrectly = (reward = 50) => {
    addRewardPoints(reward);
  };

  // Unlock character: When unlocking for the first time, assign starting values to the character.
  const unlockCharacter = (character) => {
    setUnlockedCharacters(prev => {
      // Only add if the character hasn't been unlocked yet
      if (!prev.find(c => c.id === character.id)) {
        const randomRarity = Math.floor(Math.random() * 5) + 1; // Random rarity value between 1 and 5
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

  // Upgrade character: Costs 100 coins if enough coins are available.
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
      alert("Not enough coins!");
    }
  };

  // Select a coin farm character
  const selectCoinFarm = (characterId) => {
    setSelectedCoinFarm(characterId);
  };

  // Fusion function: Combines two unlocked characters into a new fusion character.
  // The two original characters are removed from the list.
  const fuseCharacters = (id1, id2) => {
    const char1 = unlockedCharacters.find(c => c.id === id1);
    const char2 = unlockedCharacters.find(c => c.id === id2);
    if (!char1 || !char2) {
      alert("Both characters must be unlocked!");
      return;
    }
    const newCharacter = {
      id: Date.now(), // Generate a unique ID
      name: `Fusion of ${char1.name} & ${char2.name}`,
      image: "https://via.placeholder.com/150?text=Fusion", // Placeholder image
      // Character level: Maximum of the two plus 1
      characterLevel: Math.max(char1.characterLevel, char2.characterLevel) + 1,
      // Base speed as the average of the two
      baseSpeed: (char1.baseSpeed + char2.baseSpeed) / 2,
      // Rarity as the rounded-up average
      rarity: Math.ceil((char1.rarity + char2.rarity) / 2),
      // Optional: Set requiredLevel to the lower value of the two
      requiredLevel: Math.min(char1.requiredLevel, char2.requiredLevel)
    };
    // Remove the two original characters and add the fusion character
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
        addCoins,       // For daily bonus or other coin actions
        fuseCharacters  // Fusion function
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
