import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Shop.css';

// Extended pool with multiple possible shop items
const extendedShopItems = [
  {
    id: 101,
    name: "Rick's Clone",
    image: "https://via.placeholder.com/150?text=Rick+Clone",
    coinPrice: 200,
    requiredLevel: 3,
    rarity: 3
  },
  {
    id: 102,
    name: "Interdimensional Morty",
    image: "https://via.placeholder.com/150?text=Interdimensional+Morty",
    coinPrice: 150,
    requiredLevel: 2,
    rarity: 2
  },
  {
    id: 103,
    name: "Super Summer",
    image: "https://via.placeholder.com/150?text=Super+Summer",
    coinPrice: 250,
    requiredLevel: 4,
    rarity: 4
  },
  {
    id: 104,
    name: "Mystery Beth",
    image: "https://via.placeholder.com/150?text=Mystery+Beth",
    coinPrice: 300,
    requiredLevel: 5,
    rarity: 5
  },
  {
    id: 105,
    name: "Cosmic Jerry",
    image: "https://via.placeholder.com/150?text=Cosmic+Jerry",
    coinPrice: 180,
    requiredLevel: 3,
    rarity: 2
  },
  {
    id: 106,
    name: "Time-Traveling Summer",
    image: "https://via.placeholder.com/150?text=Time-Traveling+Summer",
    coinPrice: 220,
    requiredLevel: 3,
    rarity: 3
  },
  {
    id: 107,
    name: "Agent Morty",
    image: "https://via.placeholder.com/150?text=Agent+Morty",
    coinPrice: 210,
    requiredLevel: 4,
    rarity: 3
  },
  {
    id: 108,
    name: "Quantum Beth",
    image: "https://via.placeholder.com/150?text=Quantum+Beth",
    coinPrice: 320,
    requiredLevel: 5,
    rarity: 4
  }
  // Add more shop items here if desired.
];

// Helper function: Shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function Shop() {
  const { coins, level, unlockedCharacters, unlockCharacter, addCoins } = useContext(UserContext);
  const [dailyItems, setDailyItems] = useState([]);

  // Check the current date (format: YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Check if shop items for the current day are already stored
    const storedDate = localStorage.getItem('dailyShopDate');
    const storedItems = localStorage.getItem('dailyShopItems');

    if (storedDate === today && storedItems) {
      setDailyItems(JSON.parse(storedItems));
    } else {
      // Shuffle the extended pool and select, for example, 4 items
      const shuffled = shuffleArray(extendedShopItems);
      const newDailyItems = shuffled.slice(0, 4);
      setDailyItems(newDailyItems);
      localStorage.setItem('dailyShopDate', today);
      localStorage.setItem('dailyShopItems', JSON.stringify(newDailyItems));
    }
  }, [today]);

  // The shop is available only from level 10
  if (level < 10) {
    return (
      <div className="shop-page">
        <h2>Character Shop</h2>
        <p>The shop is available from level 10. Reach level 10 to purchase unique characters.</p>
      </div>
    );
  }

  const purchaseCharacter = (item) => {
    // Check if the character is already unlocked
    if (unlockedCharacters.find(c => c.id === item.id)) {
      alert("Character already unlocked!");
      return;
    }
    // Check if the player has enough coins
    if (coins < item.coinPrice) {
      alert("Not enough coins!");
      return;
    }
    // Check if the player has reached the required level
    if (level < item.requiredLevel) {
      alert("Your level is too low!");
      return;
    }
    // Deduct coins
    addCoins(-item.coinPrice);
    // Unlock the character
    unlockCharacter(item);
    alert(`${item.name} has been unlocked!`);
  };

  return (
    <div className="shop-page">
      <h2>Character Shop</h2>
      <p>Purchase unique characters with your coins. New offers available every day!</p>
      <div className="shop-grid">
        {dailyItems.map(item => (
          <div key={item.id} className="shop-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Price: {item.coinPrice} Coins</p>
            <p>Required Level: {item.requiredLevel}</p>
            <p>Rarity: {item.rarity}</p>
            <button onClick={() => purchaseCharacter(item)} className="shop-button">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
