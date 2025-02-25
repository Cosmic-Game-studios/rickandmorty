import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Konstanten für Mission-Typen
const MISSION_TYPES = {
  CHARACTER: 'character',
  COIN: 'coin'
};

// Erweiterte Missions-Daten mit mehr Details und Bildern
const MISSIONS_DATA = [
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

function Missions() {
  const isMobile = useIsMobile();
  const { completeMission, unlockCharacter, addCoins, level, coins } = useContext(UserContext);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
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

  // Filtere Missionen basierend auf der aktuellen Filterauswahl
  const filteredMissions = useMemo(() => {
    return MISSIONS_DATA.filter(mission => {
      // Prüfe, ob die Mission dem ausgewählten Filter entspricht
      if (filter === 'character' && mission.type !== MISSION_TYPES.CHARACTER) {
        return false;
      }
      if (filter === 'coin' && mission.type !== MISSION_TYPES.COIN) {
        return false;
      }
      if (filter === 'completed' && !isMissionCompleted(mission.id)) {
        return false;
      }
      if (filter === 'available' && (isMissionCompleted(mission.id) || !isMissionAvailable(mission))) {
        return false;
      }
      
      return true;
    });
  }, [filter, level, completedMissions, dailyMissionsData]);

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
  };

  // Rendert einen Belohnungsindikator basierend auf dem Missionstyp
  const renderReward = (mission) => {
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