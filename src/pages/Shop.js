import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Shop.css';
import useIsMobile from '../hooks/useIsMobile';

// Konstanten für Seltenheitsstufen
const RARITY = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
  MYTHIC: 6
};

// Konstanten für Shop-Kategorien
const SHOP_CATEGORIES = {
  FEATURED: 'featured',
  CHARACTERS: 'characters',
  BOOSTERS: 'boosters',
  BUNDLES: 'bundles'
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
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
    category: SHOP_CATEGORIES.CHARACTERS,
    discount: 0
  },
  {
    id: 109,
    name: "Phoenixperson",
    image: "https://rickandmortyapi.com/api/character/avatar/47.jpeg",
    description: "Der kybernetisch verbesserte Birdperson. Mächtig und gefährlich.",
    coinPrice: 400,
    requiredLevel: 10,
    rarity: RARITY.LEGENDARY,
    category: SHOP_CATEGORIES.CHARACTERS,
    featured: true,
    discount: 0
  },
  {
    id: 110,
    name: "Abradolf Lincler",
    image: "https://rickandmortyapi.com/api/character/avatar/7.jpeg",
    description: "Die DNa-Mischung von Abraham Lincoln und Adolf Hitler. Ein moralisch verwirrter Charakter.",
    coinPrice: 200,
    requiredLevel: 4,
    rarity: RARITY.RARE,
    category: SHOP_CATEGORIES.CHARACTERS,
    discount: 0
  },
  {
    id: 201,
    name: "Exp. Boost: Klein",
    image: "/assets/shop/exp-boost-small.png",
    imageBackup: "https://via.placeholder.com/150?text=Exp+Boost+S",
    description: "Erhöht den erhaltenen Erfahrungspunkte für 1 Stunde um 50%.",
    coinPrice: 50,
    requiredLevel: 1,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "1 Stunde",
    effect: "50% mehr EP",
    discount: 0
  },
  {
    id: 202,
    name: "Exp. Boost: Medium",
    image: "/assets/shop/exp-boost-medium.png",
    imageBackup: "https://via.placeholder.com/150?text=Exp+Boost+M",
    description: "Erhöht den erhaltenen Erfahrungspunkte für 3 Stunden um 75%.",
    coinPrice: 120,
    requiredLevel: 3,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "3 Stunden",
    effect: "75% mehr EP",
    discount: 0
  },
  {
    id: 203,
    name: "Exp. Boost: Groß",
    image: "/assets/shop/exp-boost-large.png",
    imageBackup: "https://via.placeholder.com/150?text=Exp+Boost+L",
    description: "Verdoppelt die erhaltenen Erfahrungspunkte für 5 Stunden!",
    coinPrice: 200,
    requiredLevel: 5,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "5 Stunden",
    effect: "100% mehr EP",
    featured: true,
    discount: 20
  },
  {
    id: 204,
    name: "Münzen-Boost: Klein",
    image: "/assets/shop/coin-boost-small.png",
    imageBackup: "https://via.placeholder.com/150?text=Coin+Boost+S",
    description: "Erhöht die erhaltenen Münzen für 1 Stunde um 50%.",
    coinPrice: 80,
    requiredLevel: 2,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "1 Stunde",
    effect: "50% mehr Münzen",
    discount: 0
  },
  {
    id: 205,
    name: "Münzen-Boost: Medium",
    image: "/assets/shop/coin-boost-medium.png",
    imageBackup: "https://via.placeholder.com/150?text=Coin+Boost+M",
    description: "Erhöht die erhaltenen Münzen für 3 Stunden um 75%.",
    coinPrice: 150,
    requiredLevel: 4,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "3 Stunden",
    effect: "75% mehr Münzen",
    discount: 0
  },
  {
    id: 206,
    name: "Münzen-Boost: Groß",
    image: "/assets/shop/coin-boost-large.png",
    imageBackup: "https://via.placeholder.com/150?text=Coin+Boost+L",
    description: "Verdoppelt die erhaltenen Münzen für 5 Stunden!",
    coinPrice: 250,
    requiredLevel: 6,
    category: SHOP_CATEGORIES.BOOSTERS,
    consumable: true,
    duration: "5 Stunden",
    effect: "100% mehr Münzen",
    discount: 0
  },
  {
    id: 301,
    name: "Anfänger-Bundle",
    image: "/assets/shop/starter-bundle.png",
    imageBackup: "https://via.placeholder.com/150?text=Starter+Bundle",
    description: "Perfekt für Neulinge! Enthält Doofus Jerry und einen kleinen EP-Boost.",
    coinPrice: 180,
    requiredLevel: 1,
    category: SHOP_CATEGORIES.BUNDLES,
    contains: [105, 201],
    originalPrice: 200,
    discount: 10
  },
  {
    id: 302,
    name: "Abenteurer-Bundle",
    image: "/assets/shop/adventure-bundle.png",
    imageBackup: "https://via.placeholder.com/150?text=Adventure+Bundle",
    description: "Für mutige Entdecker! Enthält Jaguar, einen mittleren EP-Boost und einen kleinen Münzen-Boost.",
    coinPrice: 350,
    requiredLevel: 4,
    category: SHOP_CATEGORIES.BUNDLES,
    contains: [106, 202, 204],
    originalPrice: 450,
    featured: true,
    discount: 22
  },
  {
    id: 303,
    name: "Legendäres Bundle",
    image: "/assets/shop/legendary-bundle.png",
    imageBackup: "https://via.placeholder.com/150?text=Legendary+Bundle",
    description: "Die ultimative Sammlung! Enthält Evil Morty, Phoenixperson, und alle großen Boosts.",
    coinPrice: 850,
    requiredLevel: 10,
    category: SHOP_CATEGORIES.BUNDLES,
    contains: [102, 109, 203, 206],
    originalPrice: 1200,
    discount: 29
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
const ShopItem = ({ item, onPurchase, ownedItems, isFeatureSection = false }) => {
  const isOwned = ownedItems?.some(ownedItem => ownedItem.id === item.id);
  const hasDiscount = item.discount > 0;
  const originalPrice = item.originalPrice || item.coinPrice;
  const finalPrice = hasDiscount 
    ? Math.floor(item.coinPrice * (1 - item.discount / 100)) 
    : item.coinPrice;
  
  // Handle image errors by showing backup or placeholder image
  const handleImageError = (e) => {
    if (item.imageBackup) {
      e.target.src = item.imageBackup;
    } else {
      e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`;
    }
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
      case RARITY.MYTHIC:
        return { name: 'Mythisch', color: '#f44336' };
      default:
        return null;
    }
  };

  const rarityInfo = getRarityInfo();
  
  return (
    <div className={`shop-item ${isFeatureSection ? 'featured-item' : ''} ${isOwned ? 'owned' : ''}`}>
      {item.featured && !isFeatureSection && (
        <div className="featured-badge">⭐ Empfohlen</div>
      )}
      
      {hasDiscount && (
        <div className="discount-badge">-{item.discount}%</div>
      )}
      
      <div className="item-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="item-image"
          onError={handleImageError}
        />
        {isOwned && <div className="owned-overlay">Im Besitz</div>}
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        
        {rarityInfo && (
          <div 
            className="item-rarity" 
            style={{ color: rarityInfo.color }}
          >
            {rarityInfo.name}
          </div>
        )}
        
        {item.category === SHOP_CATEGORIES.BOOSTERS && (
          <div className="item-specs">
            <span className="item-duration">{item.duration}</span>
            <span className="item-effect">{item.effect}</span>
          </div>
        )}
        
        <p className="item-description">{item.description}</p>
        
        {item.requiredLevel && (
          <div className="item-requirement">Level {item.requiredLevel}+</div>
        )}
        
        {item.category === SHOP_CATEGORIES.BUNDLES && (
          <div className="bundle-contents">
            <p className="bundle-title">Enthält:</p>
            <ul className="bundle-items">
              {item.contains.map(itemId => {
                const bundleItem = extendedShopItems.find(i => i.id === itemId);
                return bundleItem ? (
                  <li key={itemId}>{bundleItem.name}</li>
                ) : null;
              })}
            </ul>
          </div>
        )}
        
        <div className="item-price-container">
          {hasDiscount && (
            <span className="original-price">{formatCoins(originalPrice)}</span>
          )}
          <div className="item-price">
            <span className="price-value">{formatCoins(finalPrice)}</span>
            <span className="price-currency">Münzen</span>
          </div>
        </div>
        
        <button 
          className={`purchase-button ${isOwned ? 'disabled' : ''}`}
          onClick={() => !isOwned && onPurchase(item)}
          disabled={isOwned}
        >
          {isOwned ? 'Im Besitz' : 'Kaufen'}
        </button>
      </div>
    </div>
  );
};

function Shop() {
  const isMobile = useIsMobile();
  const { coins, level, unlockedCharacters, unlockCharacter, addCoins } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState(SHOP_CATEGORIES.FEATURED);
  const [dailyItems, setDailyItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [shopInventory, setShopInventory] = useState({
    [SHOP_CATEGORIES.CHARACTERS]: [],
    [SHOP_CATEGORIES.BOOSTERS]: [],
    [SHOP_CATEGORIES.BUNDLES]: []
  });
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const saved = localStorage.getItem('shopPurchaseHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchaseAnimation, setPurchaseAnimation] = useState(false);
  const [lastPurchasedItem, setLastPurchasedItem] = useState(null);
  const [showToast, setShowToast] = useState({ visible: false, message: '', type: '' });

  // Check the current date (format: YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Check if shop items for the current day are already stored
    const storedDate = localStorage.getItem('dailyShopDate');
    const storedItems = localStorage.getItem('dailyShopItems');
    const storedInventory = localStorage.getItem('shopInventory');

    if (storedDate === today && storedItems && storedInventory) {
      // Use stored data
      setDailyItems(JSON.parse(storedItems));
      setShopInventory(JSON.parse(storedInventory));
      
      // Set featured items (items marked as featured or with high discounts)
      const featured = extendedShopItems.filter(item => 
        item.featured || item.discount >= 20
      ).slice(0, 3);
      setFeaturedItems(featured);
    } else {
      // Generate new shop inventory
      generateDailyShop();
    }
  }, [today]);

  // Save purchase history
  useEffect(() => {
    localStorage.setItem('shopPurchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  // Toast timer
  useEffect(() => {
    if (showToast.visible) {
      const timer = setTimeout(() => {
        setShowToast({ ...showToast, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Generate daily shop items
  const generateDailyShop = () => {
    // Create a pool of items for each category
    const characterItems = extendedShopItems.filter(
      item => item.category === SHOP_CATEGORIES.CHARACTERS
    );
    const boosterItems = extendedShopItems.filter(
      item => item.category === SHOP_CATEGORIES.BOOSTERS
    );
    const bundleItems = extendedShopItems.filter(
      item => item.category === SHOP_CATEGORIES.BUNDLES
    );
    
    // Shuffle and select items for each category
    const shuffledCharacters = shuffleArray(characterItems);
    const shuffledBoosters = shuffleArray(boosterItems);
    const shuffledBundles = shuffleArray(bundleItems);
    
    const selectedCharacters = shuffledCharacters.slice(0, 6);
    const selectedBoosters = shuffledBoosters.slice(0, 4);
    const selectedBundles = shuffledBundles.slice(0, 2);
    
    // Set daily rotating items (4 random items from all categories)
    const allShuffled = shuffleArray([
      ...shuffledCharacters.slice(6, 10),
      ...shuffledBoosters.slice(4, 6),
      ...shuffledBundles.slice(2, 3)
    ]);
    const newDailyItems = allShuffled.slice(0, 4);
    
    // Update shop inventory
    const newInventory = {
      [SHOP_CATEGORIES.CHARACTERS]: selectedCharacters,
      [SHOP_CATEGORIES.BOOSTERS]: selectedBoosters,
      [SHOP_CATEGORIES.BUNDLES]: selectedBundles
    };
    
    // Set featured items (items marked as featured or with high discounts)
    const featured = extendedShopItems.filter(item => 
      item.featured || item.discount >= 20
    ).slice(0, 3);
    
    // Save everything to state and localStorage
    setDailyItems(newDailyItems);
    setShopInventory(newInventory);
    setFeaturedItems(featured);
    
    localStorage.setItem('dailyShopDate', today);
    localStorage.setItem('dailyShopItems', JSON.stringify(newDailyItems));
    localStorage.setItem('shopInventory', JSON.stringify(newInventory));
  };

  // Handle purchase
  const handlePurchase = (item) => {
    // Check if the character is already unlocked
    if (item.category === SHOP_CATEGORIES.CHARACTERS && 
        unlockedCharacters.find(c => c.id === item.id)) {
      showToastMessage("Charakter bereits freigeschaltet!", "error");
      return;
    }
    
    // Check if this is a bundle and if any of its characters are already unlocked
    if (item.category === SHOP_CATEGORIES.BUNDLES) {
      const characterItems = item.contains.filter(id => {
        const bundleItem = extendedShopItems.find(i => i.id === id);
        return bundleItem && bundleItem.category === SHOP_CATEGORIES.CHARACTERS;
      });
      
      const alreadyOwned = characterItems.some(id => 
        unlockedCharacters.find(c => c.id === id)
      );
      
      if (alreadyOwned) {
        showToastMessage("Das Bundle enthält bereits freigeschaltete Charaktere!", "error");
        return;
      }
    }
    
    // Calculate final price with discount
    const finalPrice = item.discount > 0 
      ? Math.floor(item.coinPrice * (1 - item.discount / 100)) 
      : item.coinPrice;
    
    // Check if the player has enough coins
    if (coins < finalPrice) {
      showToastMessage("Nicht genug Münzen!", "error");
      return;
    }
    
    // Check if the player has reached the required level
    if (level < (item.requiredLevel || 0)) {
      showToastMessage(`Dein Level ist zu niedrig! Level ${item.requiredLevel} erforderlich.`, "error");
      return;
    }
    
    // Process the purchase based on item type
    if (item.category === SHOP_CATEGORIES.CHARACTERS) {
      // Deduct coins
      addCoins(-finalPrice);
      // Unlock the character
      unlockCharacter({ id: item.id, name: item.name, image: item.image });
      // Add to purchase history
      addToPurchaseHistory(item);
      // Show success message
      showToastMessage(`${item.name} wurde freigeschaltet!`, "success");
      // Show purchase animation
      triggerPurchaseAnimation(item);
    } 
    else if (item.category === SHOP_CATEGORIES.BOOSTERS) {
      // Deduct coins
      addCoins(-finalPrice);
      // Add to inventory or activate immediately (in a real app)
      // For now, just add to purchase history
      addToPurchaseHistory(item);
      // Show success message
      showToastMessage(`${item.name} wurde gekauft!`, "success");
      // Show purchase animation
      triggerPurchaseAnimation(item);
    }
    else if (item.category === SHOP_CATEGORIES.BUNDLES) {
      // Deduct coins
      addCoins(-finalPrice);
      // Process each item in the bundle
      item.contains.forEach(itemId => {
        const bundleItem = extendedShopItems.find(i => i.id === itemId);
        if (bundleItem) {
          if (bundleItem.category === SHOP_CATEGORIES.CHARACTERS) {
            unlockCharacter({ id: bundleItem.id, name: bundleItem.name, image: bundleItem.image });
          }
          // Process other item types in a real app
        }
      });
      // Add to purchase history
      addToPurchaseHistory(item);
      // Show success message
      showToastMessage(`${item.name} wurde gekauft!`, "success");
      // Show purchase animation
      triggerPurchaseAnimation(item);
    }
  };

  // Add to purchase history
  const addToPurchaseHistory = (item) => {
    const purchaseTime = new Date().toISOString();
    setPurchaseHistory(prev => [
      { itemId: item.id, itemName: item.name, purchaseTime },
      ...prev
    ]);
  };

  // Trigger purchase animation
  const triggerPurchaseAnimation = (item) => {
    setLastPurchasedItem(item);
    setPurchaseAnimation(true);
    setTimeout(() => {
      setPurchaseAnimation(false);
      setLastPurchasedItem(null);
    }, 3000);
  };

  // Show toast message
  const showToastMessage = (message, type) => {
    setShowToast({ visible: true, message, type });
  };

  // The shop is available only from level 2
  if (level < 2) {
    return (
      <div className="shop-page locked-shop">
        <h2>Charaktershop</h2>
        <div className="shop-locked-message">
          <div className="lock-icon">🔒</div>
          <p>Der Shop wird ab Level 2 freigeschaltet. Erreiche Level 2, um einzigartige Charaktere und Gegenstände zu kaufen.</p>
          <div className="level-progress">
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${(level / 2) * 100}%` }}></div>
            </div>
            <div className="level-text">Level {level} / 2</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`shop-page ${isMobile ? 'mobile' : ''}`}>
      <div className="shop-header">
        <h2>Rick & Morty Shop</h2>
        <div className="shop-coins">
          <span className="coin-icon">💰</span>
          <span className="coin-amount">{formatCoins(coins)}</span>
        </div>
      </div>
      
      <p className="shop-description">
        Kaufe einzigartige Charaktere, Booster und Bundles mit deinen Münzen. 
        Neue Angebote jeden Tag verfügbar!
      </p>
      
      {/* Daily featured items */}
      <div className="shop-section daily-section">
        <h3 className="section-title">Tagesangebote</h3>
        <p className="section-description">
          Diese Angebote ändern sich jeden Tag. Greif schnell zu!
        </p>
        
        <div className="daily-items-grid">
          {dailyItems.map(item => (
            <ShopItem 
              key={item.id}
              item={item}
              onPurchase={handlePurchase}
              ownedItems={unlockedCharacters}
            />
          ))}
        </div>
      </div>
      
      {/* Featured items */}
      {featuredItems.length > 0 && (
        <div className="shop-section featured-section">
          <h3 className="section-title">Empfohlene Angebote</h3>
          <div className="featured-items-carousel">
            {featuredItems.map(item => (
              <ShopItem 
                key={item.id}
                item={item}
                onPurchase={handlePurchase}
                ownedItems={unlockedCharacters}
                isFeatureSection={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Category tabs */}
      <div className="shop-category-tabs">
        <button 
          className={`category-tab ${activeCategory === SHOP_CATEGORIES.FEATURED ? 'active' : ''}`}
          onClick={() => setActiveCategory(SHOP_CATEGORIES.FEATURED)}
        >
          Empfohlen
        </button>
        <button 
          className={`category-tab ${activeCategory === SHOP_CATEGORIES.CHARACTERS ? 'active' : ''}`}
          onClick={() => setActiveCategory(SHOP_CATEGORIES.CHARACTERS)}
        >
          Charaktere
        </button>
        <button 
          className={`category-tab ${activeCategory === SHOP_CATEGORIES.BOOSTERS ? 'active' : ''}`}
          onClick={() => setActiveCategory(SHOP_CATEGORIES.BOOSTERS)}
        >
          Booster
        </button>
        <button 
          className={`category-tab ${activeCategory === SHOP_CATEGORIES.BUNDLES ? 'active' : ''}`}
          onClick={() => setActiveCategory(SHOP_CATEGORIES.BUNDLES)}
        >
          Bundles
        </button>
      </div>
      
      {/* Category content */}
      <div className="shop-category-content">
        {activeCategory === SHOP_CATEGORIES.FEATURED && (
          <div className="category-grid">
            {featuredItems.concat(dailyItems).map(item => (
              <ShopItem 
                key={item.id}
                item={item}
                onPurchase={handlePurchase}
                ownedItems={unlockedCharacters}
              />
            ))}
          </div>
        )}
        
        {activeCategory === SHOP_CATEGORIES.CHARACTERS && (
          <div className="category-grid">