import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const missions = [
  {
    id: 1,
    description: 'Löse das interdimensionale Rätsel und befreie Rick!',
    reward: 150,
    type: 'character',
    unlock: {
      id: 1,
      name: 'Rick Sanchez',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    }
  },
  {
    id: 2,
    description: 'Entkomme von einem feindlichen Alien-Planeten mit Morty!',
    reward: 200,
    type: 'character',
    unlock: {
      id: 2,
      name: 'Morty Smith',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
    }
  },
  {
    id: 3,
    description: 'Erreiche Level 15 und erhalte 100 Coins!',
    reward: 100,
    type: 'coin',
    requiredLevel: 15
  },
  {
    id: 4,
    description: 'Spiele heute 10 Quiz und erhalte 50 Coins!',
    reward: 50,
    type: 'coin',
    daily: true,         // tagesbezogene Mission
    requiredQuizzes: 10  // muss 10 Quiz abgeschlossen haben
  }
  // Weitere Missionen können hier hinzugefügt werden.
];

function Missions() {
  const { completeMission, unlockCharacter, addCoins, level } = useContext(UserContext);
  
  // completedMissions wird initial aus localStorage geladen (falls vorhanden)
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem('completedMissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Speichere completedMissions in localStorage, sobald sich der State ändert
  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Helper: Liest den heutigen Quiz-Zähler aus localStorage
  const getDailyQuizCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('dailyQuizData');
    if (stored) {
      const data = JSON.parse(stored);
      return data.date === today ? data.count : 0;
    }
    return 0;
  };

  const handleComplete = (mission) => {
    if (completedMissions.includes(mission.id)) return;
    
    if (mission.type === 'character') {
      completeMission(mission.reward);
      unlockCharacter(mission.unlock);
      alert(`${mission.description} – Charakter freigeschaltet und ${mission.reward} Punkte erhalten!`);
    } else if (mission.type === 'coin') {
      if (mission.requiredLevel && level < mission.requiredLevel) {
        alert("Dein Level ist zu niedrig, um diese Mission abzuschließen!");
        return;
      }
      // Für tagesbezogene Missionen: Prüfe, ob der tägliche Quiz-Zähler erfüllt ist
      if (mission.daily && mission.requiredQuizzes) {
        const quizCount = getDailyQuizCount();
        if (quizCount < mission.requiredQuizzes) {
          alert(`Du musst heute mindestens ${mission.requiredQuizzes} Quiz absolvieren. Bisher: ${quizCount}`);
          return;
        }
      }
      addCoins(mission.reward);
      alert(`${mission.description} – ${mission.reward} Coins erhalten!`);
    }
    
    setCompletedMissions(prev => [...prev, mission.id]);
  };

  return (
    <div className="missions-page">
      <h2>Missionen</h2>
      <div className="missions-grid">
        {missions.map(mission => (
          <div key={mission.id} className="mission-card">
            <p className="mission-description">{mission.description}</p>
            <p className="mission-reward">
              Belohnung: {mission.reward} {mission.type === 'coin' ? "Coins" : "Punkte"}
            </p>
            {mission.requiredLevel && <p>Erforderliches Level: {mission.requiredLevel}</p>}
            {mission.daily && <p>Täglich einmalig</p>}
            <button
              onClick={() => handleComplete(mission)}
              className={`mission-button ${completedMissions.includes(mission.id) ? 'completed' : ''}`}
              disabled={completedMissions.includes(mission.id)}
            >
              {completedMissions.includes(mission.id) ? 'Abgeschlossen' : 'Mission abschließen'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Missions;