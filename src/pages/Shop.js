import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Shop.css';

// Konstanten für Seltenheitsstufen
const RARITY = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5
};

// Helfer-Funktion für Formatierung
const formatCoins = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Erweiterte Charakter-Sammlung mit Beschreibungen und richtigen Bildern
const extendedShopItems = [
  {
    id: 101,
    name: "Evil Rick",
    image: "https://rickandmortyapi.com/api/character/avatar/119.jpeg",
    description: "Die böse Version von Rick aus einer alternativen Dimension. Bekannt für sein gnadenloses Vorgehen.",
    coinPrice: 200,
    requiredLevel: 3,
    rarity: RARITY.RARE,
    discount: 0
  },
  {
    id: 102,
    name: "Evil Morty",
    image: "https://rickandmortyapi.com/api/character/avatar/118.jpeg",
    description: "Ein mysteriöser Morty mit finsteren Plänen. Geführt von Ambitionen, die das Multiversum erschüttern könnten.",
    coinPrice: 350,
    requiredLevel: 8,
    rarity: RARITY.LEGENDARY,
    discount: 10
  },
  {
    id: 103,
    name: "Space Beth",
    image: "https://rickandmortyapi.com/api/character/avatar/665.jpeg",
    description: "Die abenteuerlustige Version von Beth, die das Universum bereist und gefährliche Missionen annimmt.",
    coinPrice: 250,
    requiredLevel: 5,
    rarity: RARITY.EPIC,
    discount: 0
  },
  {
    id: 104,
    name: "Pickle Rick",
    image: "https://rickandmortyapi.com/api/character/avatar/265.jpeg",
    description: "Rick hat sich in eine Gurke verwandelt! Einer seiner cleversten wissenschaftlichen Durchbrüche.",
    coinPrice: 300,
    requiredLevel: 5,
    rarity: RARITY.EPIC,
    featured: true,
    discount: 15
  },
  {
    id: 105,
    name: "Doofus Jerry",
    image: "https://rickandmortyapi.com/api/character/avatar/164.jpeg",
    description: "Eine noch ungeschicktere Version von Jerry. Überraschend beliebt für seine unbeabsichtigte Komik.",
    coinPrice: 150,
    requiredLevel: 2,
    rarity: RARITY.UNCOMMON,
    discount: 0
  },
  {
    id: 106,
    name: "Jaguar",
    image: "https://rickandmortyapi.com/api/character/avatar/312.jpeg",
    description: "Ein unglaublich fähiger Attentäter mit einem tiefen Sinn für Ehre.",
    coinPrice: 230,
    requiredLevel: 4,
    rarity: RARITY.RARE,
    discount: 0
  },
  {
    id: 107,
    name: "Mr. Meeseeks",
    image: "https://rickandmortyapi.com/api/character/avatar/242.jpeg",
    description: "Existiert nur, um eine Aufgabe zu erfüllen und dann zu verschwinden. 'Schau mich an!'",
    coinPrice: 210,
    requiredLevel: 4,
    rarity: RARITY.RARE,
    discount: 5
  },
  {
    id: 108,
    name: "Noob-Noob",
    image: "https://rickandmortyapi.com/api/character/avatar/265.jpeg",
    description: "Das am meisten unterschätzte Mitglied der Vindicators. Rick schätzt ihn wirklich.",
    coinPrice: 180,
    requiredLevel: 3,
    rarity: RARITY.UNCOMMON,
    discount: 0
  }
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

// Item Komponente
const ShopItem = ({ item, onPurchase, ownedItems }) => {
  const isOwned = ownedItems?.some(ownedItem => ownedItem.id === item.id);
  const hasDiscount = item.discount > 0;
  const finalPrice = hasDiscount 
    ? Math.floor(item.coinPrice * (1 - item.discount / 100)) 
    : item.coinPrice;
  
  // Handle image errors by showing backup or placeholder image
  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`;
  };

  // Get rarity display information
  const getRarityInfo = () => {
    switch(item.rarity) {
      case RARITY.COMMON:
        return { name: 'Gewöhnlich', color: '#9e9e9e' };
      case RARITY.UNCOMMON:
        return { name: 'Ungewöhnlich', color: '#4caf50' };
      case RARITY.RARE:
        return { name: 'Selten', color: '#2196f3' };
      case RARITY.EPIC:
        return { name: 'Episch', color: '#9c27b0' };
      case RARITY.LEGENDARY:
        return { name: 'Legendär', color: '#ff9800' };
      default:
        return null;
    }
  };

  const rarityInfo = getRarityInfo();
  
  return (
    <div className={`shop-card ${isOwned ? 'owned' : ''}`}>
      {item.featured && (
        <div className="featured-badge">⭐ Empfohlen</div>
      )}
      
      {hasDiscount && (
        <div className="discount-badge">-{item.discount}%</div>
      )}
      
      <div className="image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          onError={handleImageError}
        />
        {isOwned && <div className="owned-overlay">Im Besitz</div>}
      </div>
      
      <h3>{item.name}</h3>
      
      {rarityInfo && (
        <div 
          className="rarity-badge" 
          style={{ backgroundColor: rarityInfo.color }}
        >
          {rarityInfo.name}
        </div>
      )}
      
      <p className="item-description">{item.description}</p>
      
      {item.requiredLevel && (
        <div className="level-requirement">Level {item.requiredLevel}+</div>
      )}
      
      <div className="price-container">
        {hasDiscount && (
          <span className="original-price">{item.coinPrice}</span>
        )}
        <span className="price">{finalPrice} Münzen</span>
      </div>
      
      <button 
        onClick={() => !isOwned && onPurchase(item)}
        disabled={isOwned}
        className={isOwned ? 'owned-button' : 'shop-button'}
      >
        {isOwned ? 'Im Besitz' : 'Kaufen'}
      </button>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="toast-notification">
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

function Shop() {
  const { coins, level, unlockedCharacters, unlockCharacter, addCoins } = useContext(UserContext);
  const [dailyItems, setDailyItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [showToast, setShowToast] = useState({ visible: false, message: '' });

  // Check the current date (format: YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Check if shop items for the current day are already stored
    const storedDate = localStorage.getItem('dailyShopDate');
    const storedItems = localStorage.getItem('dailyShopItems');
    const storedFeatured = localStorage.getItem('featuredShopItems');

    if (storedDate === today && storedItems && storedFeatured) {
      // Use stored data
      setDailyItems(JSON.parse(storedItems));
      setFeaturedItems(JSON.parse(storedFeatured));
    } else {
      // Generate new daily shop items
      generateDailyShop();
    }
  }, [today]);

  // Generate daily shop items
  const generateDailyShop = () => {
    // Shuffle the extended pool and select 4 daily items
    const shuffled = shuffleArray(extendedShopItems);
    const newDailyItems = shuffled.slice(0, 4);
    
    // Select featured items (predefined or items with discount)
    const featured = extendedShopItems.filter(item => 
      item.featured || item.discount > 0
    ).slice(0, 2);
    
    setDailyItems(newDailyItems);
    setFeaturedItems(featured);
    
    localStorage.setItem('dailyShopDate', today);
    localStorage.setItem('dailyShopItems', JSON.stringify(newDailyItems));
    localStorage.setItem('featuredShopItems', JSON.stringify(featured));
  };

  // Show toast message
  const showToastMessage = (message) => {
    setShowToast({ visible: true, message });
  };

  // Close toast
  const closeToast = () => {
    setShowToast({ visible: false, message: '' });
  };

  // Purchase handler
  const purchaseCharacter = (item) => {
    // Check if the character is already unlocked
    if (unlockedCharacters.find(c => c.id === item.id)) {
      showToastMessage("Charakter bereits freigeschaltet!");
      return;
    }
    
    // Calculate price with discount
    const finalPrice = item.discount > 0 
      ? Math.floor(item.coinPrice * (1 - item.discount / 100)) 
      : item.coinPrice;
    
    // Check if the player has enough coins
    if (coins < finalPrice) {
      showToastMessage("Nicht genug Münzen!");
      return;
    }
    
    // Check if the player has reached the required level
    if (level < item.requiredLevel) {
      showToastMessage(`Level ${item.requiredLevel} erforderlich!`);
      return;
    }
    
    // Deduct coins
    addCoins(-finalPrice);
    
    // Unlock the character
    unlockCharacter({
      id: item.id,
      name: item.name,
      image: item.image
    });
    
    showToastMessage(`${item.name} wurde freigeschaltet!`);
  };

  // The shop is available only from level 5
  if (level < 5) {
    return (
      <div className="shop-page locked-shop">
        <h2>Charaktershop</h2>
        <div className="shop-locked-message">
          <div className="lock-icon">🔒</div>
          <p>Der Shop wird ab Level 5 freigeschaltet. Erreiche Level 5, um einzigartige Charaktere zu kaufen.</p>
          <div className="level-progress">
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${(level / 5) * 100}%` }}></div>
            </div>
            <div className="level-text">Level {level} / 5</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h2>Character Shop</h2>
        <div className="coin-display">
          <span className="coin-icon">💰</span>
          <span className="coin-value">{formatCoins(coins)}</span>
        </div>
      </div>
      
      <p className="shop-description">Kaufe einzigartige Charaktere mit deinen Münzen. Neue Angebote sind jeden Tag verfügbar!</p>
      
      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <div className="featured-section">
          <h3 className="section-title">Empfohlene Angebote</h3>
          <div className="featured-items">
            {featuredItems.map(item => (
              <ShopItem 
                key={item.id} 
                item={item} 
                onPurchase={purchaseCharacter}
                ownedItems={unlockedCharacters}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Daily Items Section */}
      <div className="daily-section">
        <h3 className="section-title">Tagesangebote</h3>
        <p className="section-description">Diese Angebote ändern sich täglich!</p>
        <div className="shop-grid">
          {dailyItems.map(item => (
            <ShopItem 
              key={item.id} 
              item={item} 
              onPurchase={purchaseCharacter}
              ownedItems={unlockedCharacters}
            />
          ))}
        </div>
      </div>
      
      {/* All Items Section */}
      <div className="all-items-section">
        <h3 className="section-title">Alle verfügbaren Charaktere</h3>
        <div className="shop-grid">
          {extendedShopItems.filter(item => level >= item.requiredLevel).map(item => (
            <ShopItem 
              key={item.id} 
              item={item} 
              onPurchase={purchaseCharacter}
              ownedItems={unlockedCharacters}
            />
          ))}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast.visible && (
        <Toast message={showToast.message} onClose={closeToast} />
      )}
    </div>
  );
}

export default Shop;