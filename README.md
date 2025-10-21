# Rick and Morty Adventure Game

An interactive web-based game built with React that allows users to explore the Rick and Morty universe, unlock characters, complete missions, and participate in quizzes.

## Features

- **Character Collection**: Unlock and manage characters from the Rick and Morty universe
- **Coin Farming System**: Earn coins passively and through missions
- **Mission System**: Complete daily missions to unlock rare characters
- **Quiz Game**: Test your Rick and Morty knowledge in multiple languages (EN/DE)
- **Character Shop**: Purchase exclusive characters with earned coins
- **Character Upgrades**: Improve character stats and coin generation
- **Character Fusion**: Combine characters to create more powerful versions
- **Level Progression**: Advance through levels by earning reward points
- **Daily Bonuses**: Claim daily rewards with streak tracking

## Tech Stack

- **React 18.2.0** - UI library
- **Material-UI 7.1.1** - Modern component library
- **React Router DOM 6.14.1** - Client-side routing
- **Emotion** - CSS-in-JS styling
- **Rick and Morty API** - Character and episode data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rickandmorty
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Run development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CharacterCard.js
│   ├── DailyBonus.js
│   ├── ErrorBoundary.js
│   ├── Footer.js
│   ├── Header.js
│   └── ...
├── context/            # React Context for state management
│   └── UserContext.js
├── hooks/              # Custom React hooks
│   └── useIsMobile.js
├── pages/              # Page components
│   ├── Home.js
│   ├── Characters.js
│   ├── Episodes.js
│   ├── Locations.js
│   ├── Missions.js
│   ├── Quiz.js
│   ├── Profile.js
│   └── Shop.js
├── App.js             # Main app component
├── index.js           # App entry point
└── theme.js           # MUI theme configuration
```

## Key Features Explained

### Character System

Characters are automatically unlocked when you reach the required level. Each character has:
- **Rarity** (1-5 stars) affecting coin generation
- **Level** that can be upgraded for better performance
- **Speed** determining coin generation rate

### Coin Economy

- Base rate: 1 coin per minute
- Offline earnings: 50% efficiency (max 24 hours)
- Character bonuses: Based on level and rarity
- Upgrade costs: Scale with character level

### Mission System

Complete missions to earn:
- Character unlocks (including rare/epic/legendary)
- Bonus coins
- Reward points for leveling up

Daily missions reset every 24 hours.

### Quiz System

- Bilingual support (English/German)
- Multiple difficulty levels
- Dynamic point system based on difficulty
- Statistics tracking

## Performance Optimizations

- Lazy loading for all route components
- Component memoization (CharacterCard)
- Error boundaries for graceful error handling
- Infinite scroll with pull-to-refresh
- Offline coin calculation

## Deployment

The app is deployed on Vercel:
- Production: [https://rickandmorty-khaki-nine.vercel.app](https://rickandmorty-khaki-nine.vercel.app)

To deploy your own version:

```bash
npm run build
# Deploy the build folder to your hosting service
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Credits

- Character data from [Rick and Morty API](https://rickandmortyapi.com/)
- Built with [Create React App](https://create-react-app.dev/)
- UI components from [Material-UI](https://mui.com/)

## Acknowledgments

Rick and Morty is created by Justin Roiland and Dan Harmon for Adult Swim.
