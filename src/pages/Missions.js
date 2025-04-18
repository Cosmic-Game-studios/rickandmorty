import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Konstanten für Mission-Typen
const MISSION_TYPES = {
  CHARACTER: 'character',
  COIN: 'coin',
  SPECIAL: 'special' // Für Missionen mit mehreren Belohnungen
};

// Konstanten für Seltenheitsstufen
const RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

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

// Definiere die MISSIONS_DATA Variable - Du musst sie durch deine eigene ersetzen!
// Dies ist nur ein Platzhalter, um den ESLint-Fehler zu beheben
const MISSIONS_DATA = [];

// Füge diese täglichen Missionen zu deiner bestehenden MISSIONS_DATA hinzu
const DAILY_CHARACTER_MISSIONS = [
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
    description: 'DAILY: Free Mr. Meeseeks from the box!',
    detailedDescription: 'Mr. Meeseeks has been trapped in his box for too long. Free him and complete his task quickly before he goes insane!',
    reward: 200,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Medium',
    estimatedTime: '20 min',
    daily: true,
    unlock: {
      id: 242,
      name: 'Mr. Meeseeks',
      image: 'https://rickandmortyapi.com/api/character/avatar/242.jpeg',
      rarity: RARITY.UNCOMMON
    }
  },
  {
    id: 103,
    description: 'DAILY RARE: Break Scary Terry out of dream prison!',
    detailedDescription: 'Scary Terry, bitch! He\'s been imprisoned in a dream realm by the Dream Police. Navigate the nightmare landscape and help him escape!',
    reward: 180,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Hard',
    estimatedTime: '25 min',
    daily: true,
    requiredQuizzes: 3,
    unlock: {
      id: 333,
      name: 'Scary Terry',
      image: 'https://rickandmortyapi.com/api/character/avatar/333.jpeg',
      rarity: RARITY.RARE
    }
  },
  {
    id: 104,
    description: 'DAILY EPIC: Free Birdperson from the Federation\'s mind control!',
    detailedDescription: 'Birdperson has been captured and brainwashed by the Galactic Federation. Infiltrate their headquarters and restore his memories!',
    reward: 280,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Very Hard',
    estimatedTime: '40 min',
    daily: true,
    requiredQuizzes: 5,
    unlock: {
      id: 47,
      name: 'Birdperson',
      image: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg',
      rarity: RARITY.EPIC
    }
  },
  {
    id: 105,
    description: 'DAILY LEGENDARY: Assist Unity in escaping the hivemind!',
    detailedDescription: 'Unity, Rick\'s ex-lover, wants to break free from her hivemind existence. Help her regain her individuality in this challenging mission.',
    reward: 350,
    type: MISSION_TYPES.CHARACTER,
    difficulty: 'Extreme',
    estimatedTime: '45 min',
    daily: true,
    requiredQuizzes: 7,
    unlock: {
      id: 411,
      name: 'Unity',
      image: 'https://rickandmortyapi.com/api/character/avatar/411.jpeg',
      rarity: RARITY.LEGENDARY
    }
  }
];

function Missions() {
  const isMobile = useIsMobile();
  const { completeMission, unlockCharacter, addCoins, level, coins } = useContext(UserContext);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [autoHideCompleted, setAutoHideCompleted] = useState(true);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);
  
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

  // Setze Timer für kürzlich abgeschlossene Missionen
  useEffect(() => {
    // Nach 5 Sekunden, entferne die Mission aus der "kürzlich abgeschlossen" Liste
    if (recentlyCompleted.length > 0) {
      const timers = recentlyCompleted.map(id => {
        return setTimeout(() => {
          setRecentlyCompleted(prev => prev.filter(missionId => missionId !== id));
        }, 5000);
      });
      
      // Cleanup-Funktion um Timer zu löschen
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [recentlyCompleted]);

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

  // Filtere Missionen basierend auf der aktuellen Filterauswahl
  const filteredMissions = useMemo(() => {
    // Kombiniere die Standard- und täglichen Missionen
    const allMissions = [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS];
    
    return allMissions.filter(mission => {
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
      
      // Wenn "auto-hide" aktiviert ist, verstecke abgeschlossene Missionen,
      // außer sie sind kürzlich abgeschlossen oder "Abgeschlossen"-Filter ist aktiv
      if (autoHideCompleted && 
          isMissionCompleted(mission.id) && 
          filter !== 'completed' && 
          !recentlyCompleted.includes(mission.id)) {
        return false;
      }
      
      return true;
    });
  }, [filter, level, completedMissions, dailyMissionsData, autoHideCompleted, recentlyCompleted]);

  // Überprüft, ob eine Mission abgeschlossen ist
  function isMissionCompleted(missionId) {
    // Kombiniere die Arrays für die Suche
    const allMissions = [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS];
    const mission = allMissions.find(m => m.id === missionId);
    
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
      // Rarität-spezifische Nachricht
      let rarityText = "";
      if (mission.unlock.rarity === RARITY.RARE) {
        rarityText = " RARE";
      } else if (mission.unlock.rarity === RARITY.EPIC) {
        rarityText = " EPIC";
      } else if (mission.unlock.rarity === RARITY.LEGENDARY) {
        rarityText = " LEGENDARY";
      }
      showToast(`${rarityText} ${mission.unlock.name} freigeschaltet und ${mission.reward} Punkte erhalten!`, 'success');
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
    
    // Markiere diese Mission als kürzlich abgeschlossen
    setRecentlyCompleted(prev => [...prev, mission.id]);
  };

  // Rendert einen Belohnungsindikator basierend auf dem Missionstyp
  const renderReward = (mission) => {
    if (mission.type === MISSION_TYPES.CHARACTER) {
      // Bestimme Stil basierend auf der Seltenheit
      const rarityClass = mission.unlock.rarity ? `rarity-${mission.unlock.rarity}` : '';
      
      return (
        <div className={`mission-reward character-reward ${rarityClass}`}>
          <div className="reward-amount">{mission.reward} Punkte</div>
          <div className="character-unlock">
            <div className="character-image-container">
              <img 
                src={mission.unlock.image} 
                alt={mission.unlock.name} 
                className="character-thumbnail" 
                loading="lazy" 
              />
              {mission.unlock.rarity && mission.unlock.rarity !== RARITY.COMMON && (
                <div className={`rarity-badge ${mission.unlock.rarity}`}>
                  {mission.unlock.rarity.toUpperCase()}
                </div>
              )}
            </div>
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
  const renderSpecialBadge = (mission) => {
    if (mission.type === MISSION_TYPES.SPECIAL) {
      return <div className="special-badge">⭐ SPECIAL MISSION ⭐</div>;
    } else if (mission.unlock && mission.unlock.rarity === RARITY.LEGENDARY) {
      return <div className="special-badge legendary-badge">🔥 LEGENDARY CHARACTER 🔥</div>;
    } else if (mission.unlock && mission.unlock.rarity === RARITY.EPIC) {
      return <div className="special-badge epic-badge">💫 EPIC CHARACTER 💫</div>;
    } else if (mission.unlock && mission.unlock.rarity === RARITY.RARE) {
      return <div className="special-badge rare-badge">✨ RARE CHARACTER ✨</div>;
    }
    return null;
  };

  return (
    <div className={`missions-page ${isMobile ? 'mobile' : ''}`}>
      <h1 className="missions-title">Missionen</h1>
      
      {/* Filter-Leiste */}
      <div className="mission-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle
        </button>
        <button 
          className={`filter-button ${filter === 'character' ? 'active' : ''}`}
          onClick={() => setFilter('character')}
        >
          Charaktere
        </button>
        <button 
          className={`filter-button ${filter === 'coin' ? 'active' : ''}`}
          onClick={() => setFilter('coin')}
        >
          Münzen
        </button>
        <button 
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Abgeschlossen
        </button>
        <button 
          className={`filter-button ${filter === 'available' ? 'active' : ''}`}
          onClick={() => setFilter('available')}
        >
          Verfügbar
        </button>
      </div>
      
      {/* Auto-Hide Schalter */}
      <div className="auto-hide-toggle">
        <label>
          <input 
            type="checkbox" 
            checked={autoHideCompleted} 
            onChange={() => setAutoHideCompleted(!autoHideCompleted)} 
          />
          Abgeschlossene Missionen automatisch ausblenden
        </label>
      </div>
      
      {/* Missions-Grid */}
      <div className="missions-grid">
        {filteredMissions.map((mission, index) => {
          const isCompleted = isMissionCompleted(mission.id);
          const isAvailable = isMissionAvailable(mission);
          const progress = getDailyMissionProgress(mission);
          const isRecentlyCompleted = recentlyCompleted.includes(mission.id);
          
          // CSS-Klassen für Animation
          const fadeClasses = isCompleted && autoHideCompleted && !isRecentlyCompleted && filter !== 'completed' 
            ? 'mission-card-fading' 
            : '';
            
          // Spezielle Klassen für Seltenheit
          const rarityClass = mission.unlock?.rarity 
            ? `rarity-${mission.unlock.rarity}` 
            : '';
          
          return (
            <div 
              key={mission.id} 
              className={`mission-card 
                ${isCompleted ? 'completed' : ''} 
                ${!isAvailable ? 'unavailable' : ''} 
                ${mission.type === MISSION_TYPES.SPECIAL ? 'special-mission' : ''}
                ${rarityClass}
                ${fadeClasses}
                ${mission.daily ? 'daily-mission' : ''}`}
              style={{
                animationName: isCompleted && autoHideCompleted && !isRecentlyCompleted && filter !== 'completed' 
                  ? 'fadeOut' 
                  : 'none',
                animationDuration: '5s',
                animationFillMode: 'forwards'
              }}
            >
              {renderSpecialBadge(mission)}
              
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
              
              {renderReward(mission)}
              
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
        })}
      </div>
      
      {/* Leere Mitteilung, wenn keine Missionen dem Filter entsprechen */}
      {filteredMissions.length === 0 && (
        <div className="no-missions-message">
          Keine Missionen gefunden, die deinen Filterkriterien entsprechen.
        </div>
      )}
      
      {/* Toast-Benachrichtigung */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}

export default Missions;
