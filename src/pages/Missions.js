import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const missions = [
  {
    id: 1,
    description: 'Solve the interdimensional puzzle and free Rick!',
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
    description: 'Escape from an enemy alien planet with Morty!',
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
    description: 'Reach level 15 and get 100 coins!',
    reward: 100,
    type: 'coin',
    requiredLevel: 15
  },
  {
    id: 4,
    description: 'Play 10 quizzes today and receive 50 coins!',
    reward: 50,
    type: 'coin',
    daily: true,         // daily mission
    requiredQuizzes: 10  // must complete 10 quizzes
  }
  // Additional missions can be added here.
];

function Missions() {
  const { completeMission, unlockCharacter, addCoins, level } = useContext(UserContext);
  
  // Load completedMissions from localStorage initially (if available)
  const [completedMissions, setCompletedMissions] = useState(() => {
    const saved = localStorage.getItem('completedMissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save completedMissions to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  // Helper: Reads today's quiz counter from localStorage
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
      alert(`${mission.description} – Character unlocked and ${mission.reward} points received!`);
    } else if (mission.type === 'coin') {
      if (mission.requiredLevel && level < mission.requiredLevel) {
        alert("Your level is too low to complete this mission!");
        return;
      }
      // For daily missions: Check if today's quiz counter meets the requirement
      if (mission.daily && mission.requiredQuizzes) {
        const quizCount = getDailyQuizCount();
        if (quizCount < mission.requiredQuizzes) {
          alert(`You must complete at least ${mission.requiredQuizzes} quizzes today. So far: ${quizCount}`);
          return;
        }
      }
      addCoins(mission.reward);
      alert(`${mission.description} – ${mission.reward} coins received!`);
    }
    
    setCompletedMissions(prev => [...prev, mission.id]);
  };

  return (
    <div className="missions-page">
      <h2>Missions</h2>
      <div className="missions-grid">
        {missions.map(mission => (
          <div key={mission.id} className="mission-card">
            <p className="mission-description">{mission.description}</p>
            <p className="mission-reward">
              Reward: {mission.reward} {mission.type === 'coin' ? "coins" : "points"}
            </p>
            {mission.requiredLevel && <p>Required level: {mission.requiredLevel}</p>}
            {mission.daily && <p>Daily mission</p>}
            <button
              onClick={() => handleComplete(mission)}
              className={`mission-button ${completedMissions.includes(mission.id) ? 'completed' : ''}`}
              disabled={completedMissions.includes(mission.id)}
            >
              {completedMissions.includes(mission.id) ? 'Completed' : 'Complete mission'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Missions;
