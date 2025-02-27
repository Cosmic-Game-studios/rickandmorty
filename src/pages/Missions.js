import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Konstanten für Mission-Typen
const MISSION_TYPES = {
  CHARACTER: 'character',
  COIN: 'coin',
  SPECIAL: 'special', // Für Missionen mit mehreren Belohnungen
  RARE: 'rare' // Neuer Typ für seltene Charaktere
};

// Konstanten für Seltenheitsstufen
const RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHIC: 'mythic'
};

// Erweiterte Missions-Daten mit mehr Details, Bildern und täglichen Charakterfreischaltungen
const MISSIONS_DATA = [
  // Bestehende Standard-Missionen (gekürzt für Übersichtlichkeit)
  {
    id: 1,
    description: 'Solve the interdimensional puzzle and free Rick!',
    detailedDescription: 'Rick is trapped in an interdimensional prison. Solve the complex puzzle to get him back!',
    reward: 150,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '15 min',
    unlock: {
      id: 1,
      name: 'Rick Sanchez',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      rarity: RARITY.COMMON
    }
  },
  {
    id: 2,
    description: 'Escape from an enemy alien planet with Morty!',
    detailedDescription: 'Morty is stranded on an alien planet filled with dangerous creatures. Help him find his way back to Earth!',
    reward: 200,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '20 min',
    unlock: {
      id: 2,
      name: 'Morty Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      rarity: RARITY.COMMON
    }
  },
  
  // Neue tägliche Charaktermissionen
  {
    id: 101,
    description: 'DAILY: Rescue Pickle Rick from the sewer rats!',
    detailedDescription: 'Rick turned himself into a pickle to avoid family therapy, but now he\'s in danger. Help him fight off the sewer rats and get him back home!',
    reward: 120,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '20 min',
    daily: true,
    unlock: {
      id: 265,
      name: 'Pickle Rick',
      image: 'https://rickandmortyapi.com/api/character/avatar/265.jpeg',
      rarity: RARITY.RARE
    }
  },
  {
    id: 102,
    description: 'DAILY: Help Jessica escape alien kidnappers!',
    detailedDescription: 'Jessica has been kidnapped by aliens who believe she\'s the key to solving an ancient prophecy. Rescue her before it\'s too late!',
    reward: 100,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Easy',
    estimatedTime: '15 min',
    daily: true,
    unlock: {
      id: 180,
      name: 'Jessica',
      image: 'https://rickandmortyapi.com/api/character/avatar/180.jpeg',
      rarity: RARITY.UNCOMMON
    }
  },
  {
    id: 103,
    description: 'DAILY RARE: Break Scary Terry out of dream prison!',
    detailedDescription: 'Scary Terry, bitch! He\'s been imprisoned in a dream realm by the Dream Police. Navigate the nightmare landscape and help him escape!',
    reward: 180,
    type: MISSION_TYPES.RARE,
    difficulty: 'Hard',
    estimatedTime: '25 min',
    daily: true,
    requiredQuizzes: 3, // Muss mindestens 3 Quiz-Spiele absolviert haben
    unlock: {
      id: 333,
      name: 'Scary Terry',
      image: 'https://rickandmortyapi.com/api/character/avatar/333.jpeg',
      rarity: RARITY.RARE
    }
  },
  {
    id: 104,
    description: 'DAILY EPIC: Free Abradolf Lincler from the Purge Planet!',
    detailedDescription: 'Abradolf Lincler, the genetic combination of Abraham Lincoln and Adolf Hitler, has survived and is trapped on the Purge Planet. Save him before the next purge begins!',
    reward: 250,
    type: MISSION_TYPES.RARE,
    difficulty: 'Very Hard',
    estimatedTime: '35 min',
    daily: true,
    requiredScore: 500, // Muss mindestens 500 Punkte im Quiz erreichen
    unlock: {
      id: 7,
      name: 'Abradolf Lincler',
      image: 'https://rickandmortyapi.com/api/character/avatar/7.jpeg',
      rarity: RARITY.EPIC
    }
  },
  {
    id: 105,
    description: 'DAILY LEGENDARY: Assist Unity in escaping the hivemind!',
    detailedDescription: 'Unity, Rick\'s ex-lover, wants to break free from her hivemind existence. Help her regain her individuality in this challenging and emotional mission.',
    reward: 350,
    type: MISSION_TYPES.RARE,
    difficulty: 'Extreme',
    estimatedTime: '45 min',
    daily: true,
    requiredQuizzes: 5,
    requiredScore: 800,
    unlock: {
      id: 411,
      name: 'Unity',
      image: 'https://rickandmortyapi.com/api/character/avatar/411.jpeg',
      rarity: RARITY.LEGENDARY
    }
  },
  {
    id: 106,
    description: 'DAILY: Save Snuffles/Snowball from the dog uprising!',
    detailedDescription: 'Snuffles (now calling himself Snowball) has become too intelligent and is leading a dog uprising. Help him find peace before it\'s too late!',
    reward: 150,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '20 min',
    daily: true,
    unlock: {
      id: 346,
      name: 'Snuffles/Snowball',
      image: 'https://rickandmortyapi.com/api/character/avatar/346.jpeg',
      rarity: RARITY.UNCOMMON
    }
  },
  {
    id: 107,
    description: 'DAILY RARE: Rescue Krombopulos Michael from Federation agents!',
    detailedDescription: 'The assassin Krombopulos Michael is surrounded by Galactic Federation agents. Help this professional hitman escape so he can get back to what he loves - killing!',
    reward: 200,
    type: MISSION_TYPES.RARE,
    difficulty: 'Hard',
    estimatedTime: '30 min',
    daily: true,
    requiredQuizzes: 4,
    unlock: {
      id: 196,
      name: 'Krombopulos Michael',
      image: 'https://rickandmortyapi.com/api/character/avatar/196.jpeg',
      rarity: RARITY.RARE
    }
  },
  {
    id: 108,
    description: 'DAILY EPIC: Free Birdperson from the Federation\'s mind control!',
    detailedDescription: 'Birdperson has been captured and brainwashed by the Galactic Federation. Infiltrate their headquarters and restore his memories before he becomes Phoenixperson permanently!',
    reward: 280,
    type: MISSION_TYPES.RARE,
    difficulty: 'Very Hard',
    estimatedTime: '40 min',
    daily: true,
    streak: 3, // Erfordert 3 Tage Anmeldung in Folge
    unlock: {
      id: 47,
      name: 'Birdperson',
      image: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg',
      rarity: RARITY.EPIC
    }
  },
  {
    id: 109,
    description: 'DAILY: Help Arthricia escape the Purge Festival!',
    detailedDescription: 'Arthricia is trapped in a recurring purge on her home planet. Help her break the cycle and establish a more peaceful society.',
    reward: 130,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '20 min',
    daily: true,
    unlock: {
      id: 26,
      name: 'Arthricia',
      image: 'https://rickandmortyapi.com/api/character/avatar/26.jpeg',
      rarity: RARITY.UNCOMMON
    }
  },
  {
    id: 110,
    description: 'DAILY MYTHIC: Save The One True Morty!',
    detailedDescription: 'The prophesied One True Morty needs your help to fulfill his destiny and bring balance to the Central Finite Curve. This is an extremely rare opportunity!',
    reward: 500,
    type: MISSION_TYPES.RARE,
    difficulty: 'Legendary',
    estimatedTime: '60 min',
    daily: true,
    probability: 0.05, // Nur 5% Chance, dass diese Mission erscheint
    streak: 7, // 7 Tage Anmeldung in Folge erforderlich
    requiredScore: 1000,
    unlock: {
      id: 118,
      name: 'The One True Morty',
      image: 'https://rickandmortyapi.com/api/character/avatar/118.jpeg',
      rarity: RARITY.MYTHIC
    }
  },
  // Restliche ursprüngliche Missionen würden hier folgen...
];

// Toast Benachrichtigungskomponente
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`mission-toast ${type}`}>
      <div className="mission-toast-content">{message}</div>
      <button className="mission-toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// Missions-Karte Komponente mit Animation
const MissionCard = ({ mission, isCompleted, isAvailable, progress, handleComplete, showCompleted, rewardTooltip, animationDelay = 0 }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [animationClass, setAnimationClass] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Animation beim Abschließen einer Mission
  useEffect(() => {
    if (isCompleted && !showCompleted) {
      // Verzögerung vor dem Start der Ausblend-Animation
      const timeout = setTimeout(() => {
        setAnimationClass('fade-out');
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, showCompleted]);

  // Höre auf das Ende der Animation und verstecke die Karte
  const handleAnimationEnd = (e) => {
    if (e.animationName.includes('fadeOut') && isCompleted && !showCompleted) {
      setIsVisible(false);
    }
  };

  // Wenn die Mission nicht sichtbar sein soll, rendere nichts
  if (!isVisible) {
    return null;
  }

  // Rendert den Seltenheitsbadge für Charaktere
  const getRarityBadge = () => {
    let character;
    if (mission.type === MISSION_TYPES.CHARACTER || mission.type === MISSION_TYPES.RARE) {
      character = mission.unlock;
    } else if (mission.type === MISSION_TYPES.SPECIAL && mission.rewards?.character) {
      character = mission.rewards.character;
    } else {
      return null;
    }

    if (!character?.rarity) return null;

    const rarityColors = {
      [RARITY.COMMON]: 'gray',
      [RARITY.UNCOMMON]: 'green',
      [RARITY.RARE]: 'blue',
      [RARITY.EPIC]: 'purple',
      [RARITY.LEGENDARY]: 'orange',
      [RARITY.MYTHIC]: 'red'
    };

    return (
      <div className={`rarity-badge ${character.rarity}`} style={{ backgroundColor: rarityColors[character.rarity] }}>
        {character.rarity.toUpperCase()}
      </div>
    );
  };

  // Rendert einen Belohnungsindikator basierend auf dem Missionstyp
  const renderReward = () => {
    if (mission.type === MISSION_TYPES.CHARACTER || mission.type === MISSION_TYPES.RARE) {
      return (
        <div 
          className={`mission-reward character-reward ${mission.type === MISSION_TYPES.RARE ? 'rare-reward' : ''}`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="reward-amount">{mission.reward} Punkte</div>
          <div className="character-unlock">
            <div className="character-image-container">
              <img 
                src={mission.unlock.image} 
                alt={mission.unlock.name} 
                className="character-thumbnail" 
                loading="lazy" 
              />
              {getRarityBadge()}
            </div>
            <span className="character-name">{mission.unlock.name}</span>
          </div>
          
          {showTooltip && rewardTooltip && (
            <div className="reward-tooltip">
              {rewardTooltip(mission)}
            </div>
          )}
        </div>
      );
    } else if (mission.type === MISSION_TYPES.COIN) {
      return (
        <div className="mission-reward coin-reward">
          <div className="reward-amount">{mission.reward} Münzen</div>
          <div className="coin-icon">💰</div>
        </div>
      );
    } else if (mission.type === MISSION_TYPES.SPECIAL) {
      return (
        <div 
          className="mission-reward special-reward"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {mission.rewards.coins && (
            <div className="coin-reward">
              <div className="reward-amount">{mission.rewards.coins} Münzen</div>
              <div className="coin-icon">💰</div>
            </div>
          )}
          {mission.rewards.character && (
            <div className="character-unlock">
              <div className="character-image-container">
                <img 
                  src={mission.rewards.character.image} 
                  alt={mission.rewards.character.name} 
                  className="character-thumbnail" 
                  loading="lazy" 
                />
                {getRarityBadge()}
              </div>
              <span className="character-name">{mission.rewards.character.name}</span>
            </div>
          )}
          
          {showTooltip && rewardTooltip && (
            <div className="reward-tooltip">
              {rewardTooltip(mission)}
            </div>
          )}
        </div>
      );
    }
  };
  
  // Rendert einen Badge für spezielle Missionen
  const renderSpecialBadge = () => {
    if (mission.type === MISSION_TYPES.SPECIAL) {
      return <div className="special-badge">⭐ SPECIAL MISSION ⭐</div>;
    } else if (mission.type === MISSION_TYPES.RARE) {
      // Unterschiedliche Badges basierend auf der Seltenheit
      if (mission.unlock && mission.unlock.rarity === RARITY.LEGENDARY) {
        return <div className="special-badge legendary-badge">🔥 LEGENDARY CHARACTER 🔥</div>;
      } else if (mission.unlock && mission.unlock.rarity === RARITY.EPIC) {
        return <div className="special-badge epic-badge">💫 EPIC CHARACTER 💫</div>;
      } else if (mission.unlock && mission.unlock.rarity === RARITY.MYTHIC) {
        return <div className="special-badge mythic-badge">🌌 MYTHIC CHARACTER 🌌</div>;
      } else {
        return <div className="special-badge rare-badge">✨ RARE CHARACTER ✨</div>;
      }
    }
    return null;
  };

  // Rendere Informationen zu Voraussetzungen
  const renderRequirements = () => {
    const requirements = [];
    
    if (mission.requiredQuizzes) {
      requirements.push(
        <span key="quizzes" className="mission-requirement">
          🎮 {mission.requiredQuizzes} Quizze benötigt
        </span>
      );
    }
    
    if (mission.requiredScore) {
      requirements.push(
        <span key="score" className="mission-requirement">
          🏆 {mission.requiredScore} Punkte benötigt
        </span>
      );
    }
    
    if (mission.streak) {
      requirements.push(
        <span key="streak" className="mission-requirement">
          📅 {mission.streak} Tage-Streak benötigt
        </span>
      );
    }
    
    if (requirements.length === 0) return null;
    
    return (
      <div className="mission-requirements">
        {requirements}
      </div>
    );
  };

  return (
    <div 
      ref={cardRef}
      className={`mission-card 
        ${isCompleted ? 'completed' : ''} 
        ${!isAvailable ? 'unavailable' : ''} 
        ${mission.type === MISSION_TYPES.SPECIAL ? 'special-mission' : ''}
        ${mission.type === MISSION_TYPES.RARE ? 'rare-mission' : ''}
        ${mission.unlock?.rarity === RARITY.LEGENDARY ? 'legendary-mission' : ''}
        ${mission.unlock?.rarity === RARITY.EPIC ? 'epic-mission' : ''}
        ${mission.unlock?.rarity === RARITY.MYTHIC ? 'mythic-mission' : ''}
        ${animationClass}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onAnimationEnd={handleAnimationEnd}
    >
      {renderSpecialBadge()}
      
      <div className="mission-header">
        {mission.daily && <span className="mission-tag daily">Täglich</span>}
        <span className={`mission-difficulty ${mission.difficulty.toLowerCase()}`}>
          {mission.difficulty}
        </span>
      </div>
      
      <h3 className="mission-description">{mission.description}</h3>
      
      <p className="mission-detail">{mission.detailedDescription}</p>
      
      <div className="mission-meta">
        <span className="mission-time">⏱️ {mission.estimatedTime}</span>
        {mission.requiredLevel && (
          <span className={`mission-level ${level < mission.requiredLevel ? 'required' : ''}`}>
            Level {mission.requiredLevel}+ benötigt
          </span>
        )}
      </div>
      
      {renderRequirements()}
      
      {renderReward()}
      
      {progress && (
        <div className="mission-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(100, (progress.current / progress.required) * 100)}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {progress.current}/{progress.required} Quizze
          </span>
        </div>
      )}
      
      <button 
        className={`mission-button 
          ${isCompleted ? 'completed' : ''} 
          ${mission.type === MISSION_TYPES.SPECIAL ? 'special-button' : ''}
          ${mission.type === MISSION_TYPES.RARE ? 'rare-button' : ''}
          ${mission.unlock?.rarity === RARITY.LEGENDARY ? 'legendary-button' : ''}
          ${mission.unlock?.rarity === RARITY.MYTHIC ? 'mythic-button' : ''}`}
        onClick={() => handleComplete(mission)}
        disabled={isCompleted || !isAvailable}
      >
        {isCompleted ? 'Abgeschlossen' : 'Abschließen'}
      </button>
    </div>
  );
};

function Missions() {
  const isMobile = useIsMobile();
  const { completeMission, unlockCharacter, addCoins, level, coins } = useContext(UserContext);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [showLastCompleted, setShowLastCompleted] = useState({});
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'level', 'rewards', 'rarity'
  const [activeDailyMissions, setActiveDailyMissions] = useState([]);
  
  // Lade abgeschlossene Missionen aus dem lokalen Speicher
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem('completedMissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Lade tägliche Missionsdaten aus dem lokalen Speicher
  const [dailyMissionsData, setDailyMissionsData] = useState(() => {
    const saved = localStorage.getItem('dailyMissionsData');
    if (saved) {
      return JSON.parse(saved);
    }
    return { date: new Date().toISOString().slice(0, 10), completed: [], active: [] };
  });

  // Lade Login-Streak aus dem lokalen Speicher
  const [loginStreak, setLoginStreak] = useState(() => {
    const saved = localStorage.getItem('loginStreak');
    if (saved) {
      return JSON.parse(saved);
    }
    return { count: 1, lastLogin: new Date().toISOString().slice(0, 10) };
  });

  // Speichere abgeschlossene Missionen im lokalen Speicher
  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Speichere tägliche Missionsdaten im lokalen Speicher
  useEffect(() => {
    localStorage.setItem('dailyMissionsData', JSON.stringify(dailyMissionsData));
  }, [dailyMissionsData]);

  // Speichere Login-Streak im lokalen Speicher
  useEffect(() => {
    localStorage.setItem('loginStreak', JSON.stringify(loginStreak));
  }, [loginStreak]);

  // Generiere neue tägliche Missionen und überprüfe Login-Streak
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    let updatedStreak = { ...loginStreak };
    
    // Überprüfe Login-Streak
    if (loginStreak.lastLogin !== today) {
      const lastLoginDate = new Date(loginStreak.lastLogin);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastLoginDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Aufeinanderfolgende Tage - erhöhe Streak
        updatedStreak = { 
          count: loginStreak.count + 1, 
          lastLogin: today 
        };
      } else if (diffDays > 1) {
        // Streak unterbrochen - setze zurück
        updatedStreak = { 
          count: 1, 
          lastLogin: today 
        };
      }
      
      setLoginStreak(updatedStreak);
    }
    
    // Überprüfe, ob tägliche Missionen zurückgesetzt werden müssen
    if (dailyMissionsData.date !== today) {
      // Generiere neue aktive tägliche Missionen
      const dailyMissions = MISSIONS_DATA.filter(mission => mission.daily);
      const activeMissions = [];

      // Füge immer einige Standard-Missionen hinzu
      const standardDailyMissions = dailyMissions.filter(
        mission => mission.type !== MISSION_TYPES.RARE || 
        (mission.type === MISSION_TYPES.RARE && mission.unlock?.rarity === RARITY.UNCOMMON)
      );
      
      // Wähle 2-3 Standard-Missionen zufällig aus
      const numStandardMissions = Math.floor(Math.random() * 2) + 2; // 2-3
      const shuffledStandard = [...standardDailyMissions].sort(() => 0.5 - Math.random());
      activeMissions.push(...shuffledStandard.slice(0, numStandardMissions));
      
      // Wähle seltene Missionen basierend auf Login-Streak und Wahrscheinlichkeit
      const rareMissions = dailyMissions.filter(
        mission => mission.type === MISSION_TYPES.RARE && mission.unlock?.rarity !== RARITY.UNCOMMON
      );
      
      for (const mission of rareMissions) {
        // Überprüfe, ob die Mission aufgrund des Streaks verfügbar ist
        if (mission.streak && updatedStreak.count < mission.streak) {
          continue;
        }
        
        // Überprüfe Wahrscheinlichkeit für sehr seltene Missionen
        if (mission.probability) {
          if (Math.random() > mission.probability) {
            continue;
          }
        }
        
        // Bei LEGENDARY und MYTHIC nur eine pro Tag zulassen
        if (mission.unlock?.rarity === RARITY.LEGENDARY || mission.unlock?.rarity === RARITY.MYTHIC) {
          const alreadyHasHighRarity = activeMissions.some(
            m => m.unlock?.rarity === RARITY.LEGENDARY || m.unlock?.rarity === RARITY.MYTHIC
          );
          if (alreadyHasHighRarity) {
            continue;
          }
        }
        
        // Füge seltene Mission zur aktiven Liste hinzu
        // Epic und höher haben eine geringere Chance
        if (mission.unlock?.rarity === RARITY.EPIC) {
          if (Math.random() < 0.3) { // 30% Chance
            activeMissions.push(mission);
          }
        } else if (mission.unlock?.rarity === RARITY.LEGENDARY) {
          if (Math.random() < 0.15) { // 15% Chance
            activeMissions.push(mission);
          }
        } else if (mission.unlock?.rarity === RARITY.MYTHIC) {
          if (Math.random() < 0.05) { // 5% Chance
            activeMissions.push(mission);
          }
        } else {
          // RARE hat eine höhere Chance
          if (Math.random() < 0.5) { // 50% Chance
            activeMissions.push(mission);
          }
        }
      }
      
      // Maximiere die Anzahl der täglichen Missionen auf 5
      if (activeMissions.length > 5) {
        activeMissions.length = 5;
      }
      
      // Speichere die aktiven Missions-IDs
      const activeMissionIds = activeMissions.map(mission => mission.id);
      
      // Zurücksetzen der täglichen Daten
      setDailyMissionsData({ 
        date: today, 
        completed: [], 
        active: activeMissionIds 
      });
      
      // Entferne tägliche Missionen aus der Liste der abgeschlossenen Missionen
      const permanentMissions = completedMissions.filter(missionId => {
        const mission = MISSIONS_DATA.find(m => m.id === missionId);
        return mission && !mission.daily;
      });
      
      setCompletedMissions(permanentMissions);
      setActiveDailyMissions(activeMissions);
    } else {
      // Lade die aktiven Missionen aus den gespeicherten IDs
      const activeMissions = MISSIONS_DATA.filter(
        mission => dailyMissionsData.active.includes(mission.id)
      );
      setActiveDailyMissions(activeMissions);
    }
  }, [dailyMissionsData.date, loginStreak]);

  // Hilfsfunktion: Liest den heutigen Quiz-Zähler aus dem lokalen Speicher
  const getDailyQuizCount = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('dailyQuizData');
    if (stored) {
      const data = JSON.parse(stored);
      return data.date === today ? data.count : 0;
    }
    return 0;
  }, []);

  // Hilfsfunktion: Liest den Gesamt-Quiz-Score aus dem lokalen Speicher
  const getTotalQuizScore = useCallback(() => {
    const stored = localStorage.getItem('quizTotalScore');
    return stored ? parseInt(stored) : 0;
  }, []);

  // Sortiere und filtere Missionen
  const processedMissions = useMemo(() => {
    // Beginne mit den Standard-Missionen
    let missions = [...MISSIONS_DATA.filter(m => !m.daily)];
    
    // Füge aktive tägliche Missionen hinzu