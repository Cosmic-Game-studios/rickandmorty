import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Konstanten für Mission-Typen
const MISSION_TYPES = {
  CHARACTER: 'character',
  COIN: 'coin',
  SPECIAL: 'special' // Neuer Typ für spezielle Missionen mit mehreren Belohnungen
};

// Erweiterte Missions-Daten mit mehr Details und Bildern für alle Level
const MISSIONS_DATA = [
  // Bestehende Missionen
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
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
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
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
    }
  },
  {
    id: 3,
    description: 'Reach level 15 and get 100 coins!',
    detailedDescription: 'Keep playing and leveling up to earn this reward. You need to be at least level 15.',
    reward: 100,
    type: MISSION_TYPES.COIN,
    difficulty: 'Easy',
    estimatedTime: 'Varies',
    requiredLevel: 15
  },
  {
    id: 4,
    description: 'Play 10 quizzes today and receive 50 coins!',
    detailedDescription: 'Complete 10 quizzes within a single day to earn extra coins. Progress resets at midnight!',
    reward: 50,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: '30 min',
    daily: true,
    requiredQuizzes: 10
  },
  {
    id: 5,
    description: 'Help Summer escape from the Citadel!',
    detailedDescription: 'Summer is trapped in the Citadel of Ricks. Navigate through complex security systems to rescue her!',
    reward: 180,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '25 min',
    unlock: {
      id: 3,
      name: 'Summer Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg'
    }
  },
  {
    id: 6,
    description: 'Daily login reward! Get 20 coins for just showing up!',
    detailedDescription: 'The easiest mission ever! Simply log in and claim your daily reward.',
    reward: 20,
    type: MISSION_TYPES.COIN,
    difficulty: 'Very Easy',
    estimatedTime: '1 min',
    daily: true
  },
  
  // Neue Missionen für verschiedene Level
  {
    id: 7,
    description: 'Rescue Beth from the Froopyland dimension!',
    detailedDescription: 'Beth is trapped in Froopyland, a dangerous fantasy world. Help her escape before she gets consumed by the creatures!',
    reward: 220,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '25 min',
    requiredLevel: 3,
    unlock: {
      id: 4,
      name: 'Beth Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg'
    }
  },
  {
    id: 8,
    description: 'Help Jerry survive in the Jerryboree!',
    detailedDescription: 'Jerry is having a hard time at the Jerryboree daycare. Help him navigate the social dynamics and become the alpha Jerry!',
    reward: 180,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '18 min',
    requiredLevel: 5,
    unlock: {
      id: 5,
      name: 'Jerry Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg'
    }
  },
  {
    id: 9,
    description: 'Unlock Birdperson by repairing his cybernetic parts!',
    detailedDescription: 'Birdperson has been severely damaged. Collect the necessary parts and repair him to bring back this loyal friend!',
    reward: 250,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '30 min',
    requiredLevel: 8,
    unlock: {
      id: 47,
      name: 'Birdperson',
      image: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg'
    }
  },
  {
    id: 10,
    description: 'Complete 20 consecutive daily logins!',
    detailedDescription: 'Log in for 20 days in a row to prove your dedication and earn this special reward!',
    reward: 150,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: '20 days',
    streak: 20
  },
  {
    id: 11,
    description: 'Reach level 5 and earn some extra coins!',
    detailedDescription: 'A small reward to celebrate your progress in the game. Keep going!',
    reward: 50,
    type: MISSION_TYPES.COIN,
    difficulty: 'Easy',
    estimatedTime: 'Varies',
    requiredLevel: 5
  },
  {
    id: 12,
    description: 'Reach level 8 and earn more coins!',
    detailedDescription: 'You\'re getting better at this! Here\'s a reward for your continued progress.',
    reward: 80,
    type: MISSION_TYPES.COIN,
    difficulty: 'Easy',
    estimatedTime: 'Varies',
    requiredLevel: 8
  },
  {
    id: 13,
    description: 'Complete 5 hard quizzes and earn a reward!',
    detailedDescription: 'Show your knowledge by completing 5 quizzes of hard difficulty. This is not for beginners!',
    reward: 120,
    type: MISSION_TYPES.COIN,
    difficulty: 'Hard',
    estimatedTime: '45 min',
    requiredHardQuizzes: 5
  },
  {
    id: 14,
    description: 'Save Squanchy from the Galactic Federation!',
    detailedDescription: 'Squanchy has been captured by the Galactic Federation. Infiltrate their headquarters and help him escape!',
    reward: 230,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Very Hard',
    estimatedTime: '35 min',
    requiredLevel: 10,
    unlock: {
      id: 41,
      name: 'Squanchy',
      image: 'https://rickandmortyapi.com/api/character/avatar/41.jpeg'
    }
  },
  {
    id: 15,
    description: 'Help Mr. Poopybutthole find his family!',
    detailedDescription: 'Mr. Poopybutthole has lost his family after the parasite incident. Help him track them down and reunite!',
    reward: 210,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '25 min',
    requiredLevel: 12,
    unlock: {
      id: 244,
      name: 'Mr. Poopybutthole',
      image: 'https://rickandmortyapi.com/api/character/avatar/244.jpeg'
    }
  },
  {
    id: 16,
    description: 'Reach level 10 and claim your reward!',
    detailedDescription: 'You\'ve reached double digits! Here\'s a substantial reward for your dedication.',
    reward: 100,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: 'Varies',
    requiredLevel: 10
  },
  {
    id: 17,
    description: 'Win 15 consecutive quiz games!',
    detailedDescription: 'Show your mastery by winning 15 quiz games in a row without a single loss.',
    reward: 300,
    type: MISSION_TYPES.COIN,
    difficulty: 'Very Hard',
    estimatedTime: 'Varies',
    winStreak: 15
  },
  {
    id: 18,
    description: 'Rescue Evil Morty from the central finite curve!',
    detailedDescription: 'Evil Morty is attempting to break free from the central finite curve. Help him in this complex mission that will test all your skills!',
    reward: 350,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Extreme',
    estimatedTime: '45 min',
    requiredLevel: 14,
    unlock: {
      id: 118,
      name: 'Evil Morty',
      image: 'https://rickandmortyapi.com/api/character/avatar/118.jpeg'
    }
  },
  {
    id: 19,
    description: 'Answer 100 quiz questions correctly to earn coins!',
    detailedDescription: 'Knowledge is power, and power gets you coins! Answer 100 quiz questions correctly (lifetime count).',
    reward: 200,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: 'Varies',
    requiredCorrectAnswers: 100
  },
  {
    id: 20,
    description: 'Complete daily missions for 7 consecutive days!',
    detailedDescription: 'Complete at least one daily mission every day for a week straight to show your commitment.',
    reward: 150,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: '7 days',
    dailyStreak: 7
  },
  {
    id: 21,
    description: 'Reach level 12 and earn your bonus!',
    detailedDescription: 'You\'re getting closer to mastery! Here\'s a reward to keep you motivated.',
    reward: 120,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: 'Varies',
    requiredLevel: 12
  },
  {
    id: 22,
    description: 'Free Mr. Meeseeks from the box!',
    detailedDescription: 'Mr. Meeseeks has been trapped in his box for too long. Free him and complete his task quickly before he goes insane!',
    reward: 200,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '20 min',
    requiredLevel: 6,
    unlock: {
      id: 242,
      name: 'Mr. Meeseeks',
      image: 'https://rickandmortyapi.com/api/character/avatar/242.jpeg'
    }
  },
  {
    id: 23,
    description: 'Help Noob Noob clean up the mess from the Vindicators!',
    detailedDescription: 'After the Vindicators\' "party," poor Noob Noob has to clean everything up. Help him and earn his friendship!',
    reward: 190,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Easy',
    estimatedTime: '15 min',
    requiredLevel: 7,
    unlock: {
      id: 265,
      name: 'Noob Noob',
      image: 'https://rickandmortyapi.com/api/character/avatar/265.jpeg'
    }
  },
  {
    id: 24,
    description: 'Complete all available missions for level 1-10!',
    detailedDescription: 'You\'ve come a long way! Complete all missions available for players level 1-10 to earn this meta-reward.',
    reward: 250,
    type: MISSION_TYPES.COIN,
    difficulty: 'Hard',
    estimatedTime: 'Varies',
    requiredMissionCompletion: { min: 1, max: 10 }
  },
  {
    id: 25,
    description: 'Beat your high score in the portal gun mini-game!',
    detailedDescription: 'Play the portal gun mini-game and beat your previous high score to earn this reward!',
    reward: 80,
    type: MISSION_TYPES.COIN,
    difficulty: 'Medium',
    estimatedTime: 'Varies',
    daily: true,
    miniGame: 'portalGun'
  },
  {
    id: 26,
    description: 'Reach the final level 15 and claim your reward!',
    detailedDescription: 'You\'ve reached the maximum level! Congratulations on your dedication and skill.',
    reward: 300,
    type: MISSION_TYPES.COIN,
    difficulty: 'Hard',
    estimatedTime: 'Varies',
    requiredLevel: 15
  },
  
  // Spezielle Level 66 Mission mit doppelter Belohnung
  {
    id: 27,
    description: 'SPECIAL: Reach Level 66 and unlock the Council of Ricks!',
    detailedDescription: 'You\'ve achieved something truly extraordinary by reaching Level 66! As a special reward, you\'ll unlock the entire Council of Ricks AND receive a massive coin bonus!',
    type: MISSION_TYPES.SPECIAL,
    difficulty: 'Legendary',
    estimatedTime: 'Epic Journey',
    requiredLevel: 66,
    rewards: {
      coins: 400,
      character: {
        id: 200,
        name: 'Council of Ricks',
        image: 'https://rickandmortyapi.com/api/character/avatar/119.jpeg'
      }
    }
  }
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

// Mission Card Komponente mit Animation
const MissionCard = ({ mission, isCompleted, isAvailable, progress, handleComplete, showCompleted, animationDelay = 0 }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [animationClass, setAnimationClass] = useState('');

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

  // Rendert einen Belohnungsindikator basierend auf dem Missionstyp
  const renderReward = () => {
    if (mission.type === MISSION_TYPES.CHARACTER) {
      return (
        <div className="mission-reward character-reward">
          <div className="reward-amount">{mission.reward} Punkte</div>
          <div className="character-unlock">
            <img 
              src={mission.unlock.image} 
              alt={mission.unlock.name} 
              className="character-thumbnail" 
              loading="lazy" 
            />
            <span className="character-name">{mission.unlock.name}</span>
          </div>
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
        <div className="mission-reward special-reward">
          {mission.rewards.coins && (
            <div className="coin-reward">
              <div className="reward-amount">{mission.rewards.coins} Münzen</div>
              <div className="coin-icon">💰</div>
            </div>
          )}
          {mission.rewards.character && (
            <div className="character-unlock">
              <img 
                src={mission.rewards.character.image} 
                alt={mission.rewards.character.name} 
                className="character-thumbnail" 
                loading="lazy" 
              />
              <span className="character-name">{mission.rewards.character.name}</span>
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
    }
    return null;
  };

  return (
    <div 
      ref={cardRef}
      className={`mission-card 
        ${isCompleted ? 'completed' : ''} 
        ${!isAvailable ? 'unavailable' : ''} 
        ${mission.type === MISSION_TYPES.SPECIAL ? 'special-mission' : ''}
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
        className={`mission-button ${isCompleted ? 'completed' : ''} ${mission.type === MISSION_TYPES.SPECIAL ? 'special-button' : ''}`}
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
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'level', 'rewards'
  
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
    return { date: new Date().toISOString().slice(0, 10), completed: [] };
  });

  // Speichere abgeschlossene Missionen im lokalen Speicher
  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Speichere tägliche Missionsdaten im lokalen Speicher
  useEffect(() => {
    localStorage.setItem('dailyMissionsData', JSON.stringify(dailyMissionsData));
  }, [dailyMissionsData]);

  // Überprüfe, ob ein neuer Tag begonnen hat, um tägliche Missionen zurückzusetzen
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (dailyMissionsData.date !== today) {
      // Reset tägliche Missionen, wenn ein neuer Tag beginnt
      setDailyMissionsData({ date: today, completed: [] });
      
      // Entferne tägliche Missionen aus der Liste der abgeschlossenen Missionen
      const permanentMissions = completedMissions.filter(missionId => {
        const mission = MISSIONS_DATA.find(m => m.id === missionId);
        return mission && !mission.daily;
      });
      
      setCompletedMissions(permanentMissions);
    }
  }, [dailyMissionsData.date, completedMissions]);

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

  // Sortiere und filtere Missionen
  const processedMissions = useMemo(() => {
    let missions = [...MISSIONS_DATA];
    
    // Sortierung anwenden
    if (sortOrder === 'level') {
      missions = missions.sort((a, b) => {
        const levelA = a.requiredLevel || 0;
        const levelB = b.requiredLevel || 0;
        return levelA - levelB;
      });
    } else if (sortOrder === 'rewards') {
      missions = missions.sort((a, b) => {
        const rewardA = a.type === MISSION_TYPES.SPECIAL ? (a.rewards.coins || 0) : (a.reward || 0);
        const rewardB = b.type === MISSION_TYPES.SPECIAL ? (b.rewards.coins || 0) : (b.reward || 0);
        return rewardB - rewardA; // absteigend
      });
    } else if (sortOrder === 'difficulty') {
      const difficultyOrder = {
        'Very Easy': 1,
        'Easy': 2,
        'Medium': 3,
        'Hard': 4,
        'Very Hard': 5,
        'Extreme': 6,
        'Legendary': 7
      };
      missions = missions.sort((a, b) => {
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
    }
    
    // Filtere Missionen basierend auf der aktuellen Filterauswahl
    return missions.filter(mission => {
      // Prüfe, ob die Mission dem ausgewählten Filter entspricht
      if (filter === 'character' && mission.type !== MISSION_TYPES.CHARACTER && mission.type !== MISSION_TYPES.SPECIAL) {
        return false;
      }
      if (filter === 'coin' && mission.type !== MISSION_TYPES.COIN && mission.type !== MISSION_TYPES.SPECIAL) {
        return false;
      }
      if (filter === 'completed' && !isMissionCompleted(mission.id)) {
        return false;
      }
      if (filter === 'available' && (isMissionCompleted(mission.id) || !isMissionAvailable(mission))) {
        return false;
      }
      
      // Verstecke abgeschlossene Missionen, außer im "completed" Filter
      if (isMissionCompleted(mission.id) && filter !== 'completed' && filter !== 'all' && !showLastCompleted[mission.id]) {
        return false;
      }
      
      return true;
    });
  }, [filter, level, completedMissions, dailyMissionsData, sortOrder, showLastCompleted]);

  // Überprüft, ob eine Mission abgeschlossen ist
  function isMissionCompleted(missionId) {
    const mission = MISSIONS_DATA.find(m => m.id === missionId);
    
    if (mission && mission.daily) {
      return dailyMissionsData.completed.includes(missionId);
    }
    
    return completedMissions.includes(missionId);
  }

  // Überprüft, ob eine Mission verfügbar ist (Level-Anforderungen erfüllt)
  function isMissionAvailable(mission) {
    if (mission.requiredLevel && level < mission.requiredLevel) {
      return false;
    }
    
    return true;
  }

  // Überprüft den Fortschritt einer Daily-Mission mit Quiz-Anforderungen
  function getDailyMissionProgress(mission) {
    if (mission.daily && mission.requiredQuizzes) {
      const quizCount = getDailyQuizCount();
      return { current: quizCount, required: mission.requiredQuizzes };
    }
    
    return null;
  }

  // Zeigt eine Toast-Benachrichtigung an
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  // Schließt die Toast-Benachrichtigung
  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Behandelt das Abschließen einer Mission
  const handleComplete = (mission) => {
    // Überprüfe, ob die Mission bereits abgeschlossen ist
    if (isMissionCompleted(mission.id)) return;
    
    // Überprüfe Level-Anforderungen
    if (mission.requiredLevel && level < mission.requiredLevel) {
      showToast(`Du musst Level ${mission.requiredLevel} erreichen, um diese Mission zu erfüllen!`, 'error');
      return;
    }
    
    // Für tägliche Missionen mit Quiz-Anforderungen
    if (mission.daily && mission.requiredQuizzes) {
      const quizCount = getDailyQuizCount();
      if (quizCount < mission.requiredQuizzes) {
        showToast(`Du musst heute mindestens ${mission.requiredQuizzes} Quizze abschließen. Bisher: ${quizCount}`, 'warning');
        return;
      }
    }
    
    // Belohnungen basierend auf dem Missionstyp vergeben
    if (mission.type === MISSION_TYPES.CHARACTER) {
      completeMission(mission.reward);
      unlockCharacter(mission.unlock);
      showToast(`${mission.unlock.name} freigeschaltet und ${mission.reward} Punkte erhalten!`, 'success');
    } else if (mission.type === MISSION_TYPES.COIN) {
      addCoins(mission.reward);
      showToast(`Mission abgeschlossen! ${mission.reward} Münzen erhalten!`, 'success');
    } else if (mission.type === MISSION_TYPES.SPECIAL) {
      // Spezielle Missionen mit mehreren Belohnungen
      if (mission.rewards.coins) {
        addCoins(mission.rewards.coins);
      }
      if (mission.rewards.character) {
        unlockCharacter(mission.rewards.character);
      }
      showToast(`SPECIAL MISSION COMPLETED! ${mission.rewards.character ? mission.rewards.character.name + ' freigeschaltet' : ''} ${mission.rewards.coins ? 'und ' + mission.rewards.coins + ' Münzen' : ''} erhalten!`, 'success');
    }
    
    // Markiere die Mission als abgeschlossen
    if (mission.daily) {
      setDailyMissionsData(prev => ({
        ...prev,
        completed: [...prev.completed, mission.id]
      }));
    } else {
      setCompletedMissions(prev => [...prev, mission.id]);
    }
    
    // Zeige die gerade abgeschlossene Mission für einige Sekunden