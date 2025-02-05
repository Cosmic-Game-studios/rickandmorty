import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './Shop.css';

// Erweiterten Pool mit mehreren möglichen Shop-Artikeln
const biggerShopCharacters = [
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
  // Füge hier weitere Shop-Artikel hinzu, falls gewünscht.
];

// Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates Shuffle)
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

  // Überprüfe das aktuelle Datum (im Format YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Prüfe, ob für den aktuellen Tag bereits Shop-Artikel gespeichert sind
    const storedDate = localStorage.getItem('dailyShopDate');
    const storedItems = localStorage.getItem('dailyShopItems');

    if (storedDate === today && storedItems) {
      setDailyItems(JSON.parse(storedItems));
    } else {
      // Mische den erweiterten Pool und wähle z. B. 4 Artikel aus
      const shuffled = shuffleArray(biggerShopCharacters);
      const newDailyItems = shuffled.slice(0, 4);
      setDailyItems(newDailyItems);
      localStorage.setItem('dailyShopDate', today);
      localStorage.setItem('dailyShopItems', JSON.stringify(newDailyItems));
    }
  }, [today]);

  // Shop ist erst ab Level 10 verfügbar
  if (level < 10) {
    return (
      <div className="shop-page">
        <h2>Charakter-Shop</h2>
        <p>Der Shop ist ab Level 10 verfügbar. Erreiche Level 10, um einzigartige Charaktere zu kaufen.</p>
      </div>
    );
  }

  const purchaseCharacter = (item) => {
    // Prüfe, ob der Charakter bereits freigeschaltet wurde
    if (unlockedCharacters.find(c => c.id === item.id)) {
      alert("Charakter bereits freigeschaltet!");
      return;
    }
    // Prüfe, ob der Spieler genügend Coins hat
    if (coins < item.coinPrice) {
      alert("Nicht genügend Coins!");
      return;
    }
    // Prüfe, ob der Spieler das erforderliche Level erreicht hat
    if (level < item.requiredLevel) {
      alert("Dein Level ist zu niedrig!");
      return;
    }
    // Coins abziehen
    addCoins(-item.coinPrice);
    // Freischalten des Charakters
    unlockCharacter(item);
    alert(`${item.name} wurde freigeschaltet!`);
  };

  return (
    <div className="shop-page">
      <h2>Charakter-Shop</h2>
      <p>Erwerbe einzigartige Charaktere mit deinen Coins. Jeden Tag gibt es neue Angebote!</p>
      <div className="shop-grid">
        {dailyItems.map(item => (
          <div key={item.id} className="shop-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Preis: {item.coinPrice} Coins</p>
            <p>Erforderliches Level: {item.requiredLevel}</p>
            <p>Rarity: {item.rarity}</p>
            <button onClick={() => purchaseCharacter(item)} className="shop-button">
              Kaufen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;