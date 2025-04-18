import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  memo
} from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

export const MISSION_TYPES = Object.freeze({
  CHARACTER: 'character',
  COIN: 'coin',
  SPECIAL: 'special'
});

export const RARITY = Object.freeze({
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
});

/**
 * Small helper – today in YYYY‑MM‑DD.
 */
const todayString = () => new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------------------------- */
/*                              LOCAL‑STORAGE HOOK                             */
/* -------------------------------------------------------------------------- */

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

/* -------------------------------------------------------------------------- */
/*                               DATA (EXAMPLE)                               */
/* -------------------------------------------------------------------------- */

// TODO: Replace with real data source / API
export const MISSIONS_DATA = [];

export const DAILY_CHARACTER_MISSIONS = [
  // … (identical to your original daily mission objects)
];

/* -------------------------------------------------------------------------- */
/*                                  TOAST UI                                  */
/* -------------------------------------------------------------------------- */

const Toast = memo(function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className={`mission-toast ${type}`}> 
      <div className="mission-toast-content">{message}</div>
      <button className="mission-toast-close" onClick={onClose}>&times;</button>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                              MISSION HELPERS                               */
/* -------------------------------------------------------------------------- */

const mergeMissions = () => [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS];

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function Missions() {
  const isMobile = useIsMobile();
  const {
    completeMission,
    unlockCharacter,
    addCoins,
    level
  } = useContext(UserContext);

  /* ----------------------------------- UI ---------------------------------- */

  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [autoHideCompleted, setAutoHideCompleted] = useState(true);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);

  /* ---------------------------- persisted state ---------------------------- */

  const [completedMissions, setCompletedMissions] = useLocalStorage(
    'completedMissions',
    []
  );

  const [dailyMissionsData, setDailyMissionsData] = useLocalStorage(
    'dailyMissionsData',
    { date: todayString(), completed: [] }
  );

  /* ---------------------------- daily rollover ---------------------------- */

  useEffect(() => {
    const today = todayString();
    if (dailyMissionsData.date !== today) {
      setDailyMissionsData({ date: today, completed: [] });
      setCompletedMissions(prev =>
        prev.filter(id => {
          const mission = MISSIONS_DATA.find(m => m.id === id);
          return mission && !mission.daily;
        })
      );
    }
  }, [dailyMissionsData.date, setDailyMissionsData, setCompletedMissions]);

  /* --------------------------- quiz‑progress api --------------------------- */

  const getDailyQuizCount = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dailyQuizData'));
      return stored?.date === todayString() ? stored.count : 0;
    } catch {
      return 0;
    }
  }, []);

  /* ------------------------------ predicates ------------------------------ */

  const isMissionCompleted = useCallback(
    id => {
      const mission = mergeMissions().find(m => m.id === id);
      if (mission?.daily) return dailyMissionsData.completed.includes(id);
      return completedMissions.includes(id);
    },
    [completedMissions, dailyMissionsData.completed]
  );

  const isMissionAvailable = useCallback(
    mission => !mission.requiredLevel || level >= mission.requiredLevel,
    [level]
  );

  /* ----------------------------- toast helper ----------------------------- */

  const showToast = useCallback(
    (message, type = 'success') => setToast({ message, type }),
    []
  );

  /* ------------------------------ completion ------------------------------ */

  const handleComplete = useCallback(
    mission => {
      if (isMissionCompleted(mission.id)) return;
      if (!isMissionAvailable(mission)) {
        showToast(`Level ${mission.requiredLevel}+ benötigt!`, 'error');
        return;
      }
      if (mission.daily && mission.requiredQuizzes) {
        const count = getDailyQuizCount();
        if (count < mission.requiredQuizzes) {
          showToast(`Benötigte Quizze: ${count}/${mission.requiredQuizzes}`, 'warning');
          return;
        }
      }

      // reward handling
      if (mission.type === MISSION_TYPES.CHARACTER) {
        completeMission(mission.reward);
        unlockCharacter(mission.unlock);
        showToast(`${mission.unlock.name} +${mission.reward} Punkte`, 'success');
      } else if (mission.type === MISSION_TYPES.COIN) {
        addCoins(mission.reward);
        showToast(`+${mission.reward} Münzen`, 'success');
      } else if (mission.type === MISSION_TYPES.SPECIAL) {
        mission.rewards.coins && addCoins(mission.rewards.coins);
        mission.rewards.character && unlockCharacter(mission.rewards.character);
        showToast('⭐ Spezialmission abgeschlossen!', 'success');
      }

      // mark completion
      if (mission.daily) {
        setDailyMissionsData(prev => ({
          ...prev,
          completed: [...prev.completed, mission.id]
        }));
      } else {
        setCompletedMissions(prev => [...prev, mission.id]);
      }
      setRecentlyCompleted(prev => [...prev, mission.id]);
    },
    [
      isMissionCompleted,
      isMissionAvailable,
      completeMission,
      unlockCharacter,
      addCoins,
      getDailyQuizCount,
      showToast,
      setDailyMissionsData,
      setCompletedMissions
    ]
  );

  /* ---------------------------- recently cleanup --------------------------- */

  useEffect(() => {
    if (!recentlyCompleted.length) return;
    const ids = recentlyCompleted.map(id =>
      setTimeout(() =>
        setRecentlyCompleted(prev => prev.filter(x => x !== id)),
      5000)
    );
    return () => ids.forEach(clearTimeout);
  }, [recentlyCompleted]);

  /* ------------------------------ filtering ------------------------------- */

  const filteredMissions = useMemo(() => {
    const all = mergeMissions();

    return all.filter(m => {
      // type filter
      if (
        (filter === 'character' && ![MISSION_TYPES.CHARACTER, MISSION_TYPES.SPECIAL].includes(m.type)) ||
        (filter === 'coin' && ![MISSION_TYPES.COIN, MISSION_TYPES.SPECIAL].includes(m.type))
      )
        return false;

      // completion filter
      if (filter === 'completed' && !isMissionCompleted(m.id)) return false;
      if (filter === 'available' && (isMissionCompleted(m.id) || !isMissionAvailable(m))) return false;

      // autohide
      if (
        autoHideCompleted &&
        isMissionCompleted(m.id) &&
        filter !== 'completed' &&
        !recentlyCompleted.includes(m.id)
      )
        return false;

      return true;
    });
  }, [filter, autoHideCompleted, isMissionCompleted, isMissionAvailable, recentlyCompleted]);

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className={`missions-page ${isMobile ? 'mobile' : ''}`}>
      <h1 className="missions-title">Missionen</h1>

      {/* Filters */}
      <div className="mission-filters">
        {['all', 'character', 'coin', 'completed', 'available'].map(key => (
          <button
            key={key}
            className={`filter-button ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Auto‑hide */}
      <label className="auto-hide-toggle">
        <input
          type="checkbox"
          checked={autoHideCompleted}
          onChange={() => setAutoHideCompleted(!autoHideCompleted)}
        />
        Abgeschlossene Missionen automatisch ausblenden
      </label>

      {/* Grid */}
      <div className="missions-grid">
        {filteredMissions.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            level={level}
            onComplete={handleComplete}
            isCompleted={isMissionCompleted(mission.id)}
            isAvailable={isMissionAvailable(mission)}
            recentlyCompleted={recentlyCompleted.includes(mission.id)}
            getDailyQuizCount={getDailyQuizCount}
          />
        ))}
      </div>

      {!filteredMissions.length && (
        <p className="no-missions-message">Keine Missionen gefunden.</p>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MissionCard                                 */
/* -------------------------------------------------------------------------- */

const MissionCard = memo(function MissionCard({
  mission,
  level,
  onComplete,
  isCompleted,
  isAvailable,
  recentlyCompleted,
  getDailyQuizCount
}) {
  const progress = mission.daily && mission.requiredQuizzes
    ? { current: getDailyQuizCount(), required: mission.requiredQuizzes }
    : null;

  const rarityClass = mission.unlock?.rarity
    ? `rarity-${mission.unlock.rarity}`
    : '';

  return (
    <div
      className={`mission-card ${mission.daily ? 'daily-mission' : ''} ${
        mission.type === MISSION_TYPES.SPECIAL ? 'special-mission' : ''
      } ${rarityClass} ${isCompleted ? 'completed' : ''} ${
        !isAvailable ? 'unavailable' : ''
      } ${
        isCompleted && !recentlyCompleted ? 'mission-card-fading' : ''
      }`}
      style={
        isCompleted && !recentlyCompleted
          ? { animation: 'fadeOut 5s forwards' }
          : undefined
      }
    >
      {/* Header */}
      <div className="mission-header">
        {mission.daily && <span className="mission-tag daily">Täglich</span>}
        <span className={`mission-difficulty ${mission.difficulty.toLowerCase()}`}>
          {mission.difficulty}
        </span>
      </div>

      {/* Description */}
      <h3 className="mission-description">{mission.description}</h3>
      <p className="mission-detail">{mission.detailedDescription}</p>

      {/* Meta */}
      <div className="mission-meta">
        <span className="mission-time">⏱️ {mission.estimatedTime}</span>
        {mission.requiredLevel && (
          <span className={`mission-level ${level < mission.requiredLevel ? 'required' : ''}`}>
            Level {mission.requiredLevel}+
          </span>
        )}
      </div>

      {/* Reward */}
      <Reward mission={mission} />

      {/* Progress */}
      {progress && (
        <div className="mission-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(progress.current / progress.required) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {progress.current}/{progress.required} Quizze
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        className={`mission-button ${isCompleted ? 'completed' : ''}`}
        onClick={() => onComplete(mission)}
        disabled={isCompleted || !isAvailable}
      >
        {isCompleted ? 'Abgeschlossen' : 'Abschließen'}
      </button>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Reward                                   */
/* -------------------------------------------------------------------------- */

const Reward = memo(function Reward({ mission }) {
  if (mission.type === MISSION_TYPES.CHARACTER) {
    const rarity = mission.unlock.rarity;
    return (
      <div className={`mission-reward character-reward rarity-${rarity}`}> 
        <div className="reward-amount">{mission.reward} Punkte</div>
        <div className="character-unlock">
          <img
            src={mission.unlock.image}
            alt={mission.unlock.name}
            className="character-thumbnail"
            loading="lazy"
          />
          {rarity !== RARITY.COMMON && (
            <span className={`rarity-badge ${rarity}`}>{rarity.toUpperCase()}</span>
          )}
          <span className="character-name">{mission.unlock.name}</span>
        </div>
      </div>
    );
  }

  if (mission.type === MISSION_TYPES.COIN) {
    return (
      <div className="mission-reward coin-reward">
        <div className="reward-amount">{mission.reward} Münzen</div>
        <span role="img" aria-label="coins">
          💰
        </span>
      </div>
    );
  }

  if (mission.type === MISSION_TYPES.SPECIAL) {
    return (
      <div className="mission-reward special-reward">
        {mission.rewards.coins && (
          <div className="coin-reward">
            <div className="reward-amount">{mission.rewards.coins} Münzen</div>
            <span role="img" aria-label="coins">
              💰
            </span>
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

  return null;
});
