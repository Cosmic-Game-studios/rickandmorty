<div align="center">

# 🚀 Rick and Morty Adventure Game

### *An Interactive Journey Through the Multiverse!*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.1.1-0081CB.svg)](https://mui.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Stars](https://img.shields.io/github/stars/Cosmic-Game-studios/rickandmorty?style=social)](https://github.com/Cosmic-Game-studios/rickandmorty/stargazers)

**[🎮 Play Now](https://rickandmorty-khaki-nine.vercel.app)** | **[📖 Documentation](#features)** | **[🤝 Contributing](#contributing)** | **[⭐ Star this repo](#)**

An interactive web-based game built with React that allows you to explore the Rick and Morty universe, unlock characters, complete missions, and participate in quizzes!

</div>

---

## 📋 Table of Contents

- [Why This Project?](#-why-this-project)
- [Screenshots & Demo](#-screenshots--demo)
- [Features](#-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Performance Optimizations](#performance-optimizations)
- [Deployment](#deployment)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [Show Your Support](#-show-your-support)
- [License](#license)

## 🎯 Why This Project?

This isn't just another Rick and Morty fan project - it's a fully-featured **idle/incremental game** that combines:

- 🎨 **Beautiful Material-UI Design** - Modern, responsive interface
- 🎮 **Engaging Gameplay** - Multiple game mechanics (idle farming, missions, quizzes, fusion)
- 🌍 **Multilingual** - English and German support
- 📱 **Mobile-First** - Perfect experience on all devices
- 🚀 **Production-Ready** - Deployed and playable right now!

**Perfect for**: Learning React, exploring game mechanics, or just having fun in the Rick and Morty multiverse!

## 📸 Screenshots & Demo

**🎮 [PLAY THE LIVE DEMO](https://rickandmorty-khaki-nine.vercel.app)**

> 💡 **Tip**: Add screenshots here to showcase your game! Screenshots significantly increase GitHub engagement.

<details>
<summary>📷 Click to see planned screenshots</summary>

- Home page with character collection
- Mission system interface
- Quiz game in action
- Character shop and upgrades
- Daily bonus rewards
- Character fusion mechanic

*Screenshots coming soon! Feel free to contribute by playing the game and adding screenshots!*

</details>

## ✨ Features

- **Character Collection**: Unlock and manage characters from the Rick and Morty universe
- **Coin Farming System**: Earn coins passively and through missions
- **Mission System**: Complete daily missions to unlock rare characters
- **Quiz Game**: Test your Rick and Morty knowledge in multiple languages (EN/DE)
- **Character Shop**: Purchase exclusive characters with earned coins
- **Character Upgrades**: Improve character stats and coin generation
- **Character Fusion**: Combine characters to create more powerful versions
- **Level Progression**: Advance through levels by earning reward points
- **Daily Bonuses**: Claim daily rewards with streak tracking

## 🛠️ Tech Stack

- **React 18.2.0** - UI library
- **Material-UI 7.1.1** - Modern component library
- **React Router DOM 6.14.1** - Client-side routing
- **Emotion** - CSS-in-JS styling
- **Rick and Morty API** - Character and episode data

## 🚀 Getting Started

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

## 📁 Project Structure

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

## 🎮 Key Features Explained

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

## ⚡ Performance Optimizations

- Lazy loading for all route components
- Component memoization (CharacterCard)
- Error boundaries for graceful error handling
- Infinite scroll with pull-to-refresh
- Offline coin calculation

## 🌐 Deployment

The app is deployed on Vercel:
- Production: [https://rickandmorty-khaki-nine.vercel.app](https://rickandmorty-khaki-nine.vercel.app)

To deploy your own version:

```bash
npm run build
# Deploy the build folder to your hosting service
```

## 🌍 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Latest |
| Firefox | ✅ Latest |
| Safari  | ✅ Latest |
| Edge    | ✅ Latest |

## 🗺️ Roadmap

We're constantly improving! Here's what's coming:

- [ ] 🎮 **Multiplayer Features** - Compete with friends
- [ ] 🏆 **Achievements System** - Unlock special badges
- [ ] 🎨 **Custom Character Skins** - Personalize your collection
- [ ] 🌐 **More Languages** - Expanding beyond EN/DE
- [ ] 📊 **Global Leaderboards** - See how you rank
- [ ] 🔊 **Sound Effects & Music** - Immersive audio experience
- [ ] 💾 **Cloud Save** - Play across devices
- [ ] 🎁 **Special Events** - Limited-time challenges

Have ideas? [Open an issue](https://github.com/Cosmic-Game-studios/rickandmorty/issues/new) or contribute!

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **⭐ Star this repo** - Show your support!
2. **🐛 Report bugs** - [Open an issue](https://github.com/Cosmic-Game-studios/rickandmorty/issues/new)
3. **💡 Suggest features** - We're all ears!
4. **🔧 Submit PRs** - Fix bugs or add features
5. **📸 Add screenshots** - Help showcase the game
6. **📖 Improve docs** - Documentation is always welcome

### How to Contribute Code

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our code style guidelines and ensure all tests pass before submitting.

## 💖 Show Your Support

If you like this project, please consider:

- ⭐ **Starring this repository** - It helps others discover the project!
- 🐦 **Sharing on social media** - Spread the word!
- 💬 **Telling your friends** - Especially Rick and Morty fans!
- 🍕 **Contributing** - Every bit helps!

[![GitHub stars](https://img.shields.io/github/stars/Cosmic-Game-studios/rickandmorty?style=social)](https://github.com/Cosmic-Game-studios/rickandmorty/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Cosmic-Game-studios/rickandmorty?style=social)](https://github.com/Cosmic-Game-studios/rickandmorty/network/members)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License - feel free to use this project for learning, personal, or commercial purposes!
```

## 🙏 Credits & Acknowledgments

This project was made possible thanks to:

- 🎨 **[Rick and Morty API](https://rickandmortyapi.com/)** - Amazing free API for character and episode data
- ⚛️ **[React](https://reactjs.org/)** - The library that powers this app
- 🎨 **[Material-UI](https://mui.com/)** - Beautiful React components
- 🚀 **[Vercel](https://vercel.com/)** - Lightning-fast hosting
- 📦 **[Create React App](https://create-react-app.dev/)** - Bootstrap tooling

**Special Thanks** to Justin Roiland and Dan Harmon for creating the incredible Rick and Morty universe!

---

<div align="center">

**Made with ❤️ by the Rick and Morty fan community**

*Wubba Lubba Dub Dub!* 🚀

[⬆ Back to Top](#-rick-and-morty-adventure-game)

</div>
