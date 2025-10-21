import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Box,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import { ShoppingCart, Star, Lock } from '@mui/icons-material';

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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isOwned ? 0.7 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: isOwned ? 'none' : 'translateY(-4px)',
          boxShadow: isOwned ? 2 : 6
        }
      }}
    >
      {item.featured && (
        <Chip
          label="⭐ Empfohlen"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: 'bold'
          }}
        />
      )}

      {hasDiscount && (
        <Chip
          label={`-${item.discount}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontWeight: 'bold'
          }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt={item.name}
          onError={handleImageError}
          sx={{ objectFit: 'cover' }}
        />
        {isOwned && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            Im Besitz
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>

        {rarityInfo && (
          <Chip
            icon={<Star />}
            label={rarityInfo.name}
            size="small"
            sx={{
              bgcolor: rarityInfo.color,
              color: 'white',
              mb: 1,
              alignSelf: 'flex-start'
            }}
          />
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {item.description}
        </Typography>

        {item.requiredLevel && (
          <Chip
            icon={<Lock />}
            label={`Level ${item.requiredLevel}+`}
            size="small"
            variant="outlined"
            sx={{ mb: 1, alignSelf: 'flex-start' }}
          />
        )}

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ mb: 2 }}>
            {hasDiscount && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  display: 'inline',
                  mr: 1
                }}
              >
                {item.coinPrice}
              </Typography>
            )}
            <Typography
              variant="h6"
              component="span"
              color="primary"
            >
              {finalPrice} Münzen
            </Typography>
          </Box>

          <Button
            variant={isOwned ? 'outlined' : 'contained'}
            fullWidth
            startIcon={isOwned ? null : <ShoppingCart />}
            onClick={() => !isOwned && onPurchase(item)}
            disabled={isOwned}
          >
            {isOwned ? 'Im Besitz' : 'Kaufen'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

ShopItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    coinPrice: PropTypes.number.isRequired,
    requiredLevel: PropTypes.number,
    rarity: PropTypes.number,
    discount: PropTypes.number,
    featured: PropTypes.bool
  }).isRequired,
  onPurchase: PropTypes.func.isRequired,
  ownedItems: PropTypes.array
};

function Shop() {
  const { coins, level, unlockedCharacters, unlockCharacter, addCoins } = useContext(UserContext);
  const [dailyItems, setDailyItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [showToast, setShowToast] = useState({ visible: false, message: '', severity: 'info' });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const showToastMessage = (message, severity = 'info') => {
    setShowToast({ visible: true, message, severity });
  };

  // Close toast
  const closeToast = () => {
    setShowToast({ ...showToast, visible: false });
  };

  // Purchase handler
  const purchaseCharacter = (item) => {
    // Check if the character is already unlocked
    if (unlockedCharacters.find(c => c.id === item.id)) {
      showToastMessage("Charakter bereits freigeschaltet!", "warning");
      return;
    }

    // Calculate price with discount
    const finalPrice = item.discount > 0
      ? Math.floor(item.coinPrice * (1 - item.discount / 100))
      : item.coinPrice;

    // Check if the player has enough coins
    if (coins < finalPrice) {
      showToastMessage("Nicht genug Münzen!", "error");
      return;
    }

    // Check if the player has reached the required level
    if (level < item.requiredLevel) {
      showToastMessage(`Level ${item.requiredLevel} erforderlich!`, "error");
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

    showToastMessage(`${item.name} wurde freigeschaltet!`, "success");
  };

  // The shop is available only from level 5
  if (level < 5) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Lock sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h3" component="h2" gutterBottom>
            Charaktershop
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Der Shop wird ab Level 5 freigeschaltet. Erreiche Level 5, um einzigartige Charaktere zu kaufen.
          </Typography>
          <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Fortschritt</Typography>
              <Typography variant="body2">Level {level} / 5</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(level / 5) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2">
          Character Shop
        </Typography>
        <Chip
          icon={<span>💰</span>}
          label={`${formatCoins(coins)} Münzen`}
          color="primary"
          sx={{ fontSize: '1.1rem', py: 3 }}
        />
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        Kaufe einzigartige Charaktere mit deinen Münzen. Neue Angebote sind jeden Tag verfügbar!
      </Typography>

      {/* Featured Items Section */}
      {featuredItems.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 3 }}>
            Empfohlene Angebote
          </Typography>
          <Grid container spacing={3}>
            {featuredItems.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ShopItem
                  item={item}
                  onPurchase={purchaseCharacter}
                  ownedItems={unlockedCharacters}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Daily Items Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Tagesangebote
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Diese Angebote ändern sich täglich!
        </Typography>
        <Grid container spacing={3}>
          {dailyItems.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <ShopItem
                item={item}
                onPurchase={purchaseCharacter}
                ownedItems={unlockedCharacters}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* All Items Section */}
      <Box>
        <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 3 }}>
          Alle verfügbaren Charaktere
        </Typography>
        <Grid container spacing={3}>
          {extendedShopItems
            .filter(item => level >= item.requiredLevel)
            .map(item => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <ShopItem
                  item={item}
                  onPurchase={purchaseCharacter}
                  ownedItems={unlockedCharacters}
                />
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* Toast Notification */}
      <Snackbar
        open={showToast.visible}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeToast}
          severity={showToast.severity}
          sx={{ width: '100%' }}
        >
          {showToast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Shop;