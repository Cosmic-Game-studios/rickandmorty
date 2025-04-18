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
/*                                 CONSTANTS                                  */
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

const todayString = () => new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------------------------- */
/*                       LOCAL‑STORAGE STATE HELPER HOOK                       */
/* -------------------------------------------------------------------------- */

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

/* -------------------------------------------------------------------------- */
/*                        PLACEHOLDER MISSION DATASETS                         */
/* -------------------------------------------------------------------------- */

// ⚠️  REPLACE WITH REAL DATA / API FETCH
export const MISSIONS_DATA = [];
export const DAILY_CHARACTER_MISSIONS = [
  // … keep your original daily missions here …
];

/* -------------------------------------------------------------------------- */
/*                                    TOAST                                   */
/* -------------------------------------------------------------------------- */

const Toast = memo(({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);

  const border = {
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500'
  }[type];

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-gray-800/80 px-4 py-3 backdrop-blur-md shadow-lg border ${border}`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-lg leading-none hover:text-red-400">&times;</button>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                            INTERNAL HELPER FUNCS                           */
/* -------------------------------------------------------------------------- */

const mergeMissions = () => [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function Missions() {
  const isMobile = useIsMobile();
  const { completeMission, unlockCharacter, addCoins, level } = useContext(UserContext);

  /* --------------------------------- UI STATE ----------------------------- */
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [autoHideCompleted, setAutoHideCompleted] = useState(true);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);

  /* ------------------------------ PERSISTED STATE ------------------------- */
  const [completedMissions, setCompletedMissions] = useLocalStorage('completedMissions', []);
  const [dailyMissionsData, setDailyMissionsData] = useLocalStorage('dailyMissionsData', {
    date: todayString(),
    completed: []
  });

  /* ----------------------------- DAILY RESET LOGIC ------------------------ */
  useEffect(() => {
    const today = todayString();
    if (dailyMissionsData.date !== today) {
      setDailyMissionsData({ date: today, completed: [] });
      setCompletedMissions(prev => prev.filter(id => {
        const m = MISSIONS_DATA.find(x => x.id === id);
        return m && !m.daily;
      }));
    }
  }, [dailyMissionsData.date, setDailyMissionsData, setCompletedMissions]);

  /* ---------------------------- QUIZ COUNT HELPER ------------------------- */
  const getDailyQuizCount = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('dailyQuizData'));
      return data?.date === todayString() ? data.count : 0;
    } catch {
      return 0;
    }
  }, []);

  /* ------------------------------ PREDICATES ------------------------------ */
  const isMissionCompleted = useCallback(id => {
    const mission = mergeMissions().find(m => m.id === id);
    return mission?.daily ? dailyMissionsData.completed.includes(id) : completedMissions.includes(id);
  }, [dailyMissionsData.completed, completedMissions]);

  const isMissionAvailable = useCallback(m => !m.requiredLevel || level >= m.requiredLevel, [level]);

  /* ------------------------------ TOAST HELPER ---------------------------- */
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  /* --------------------------- COMPLETE HANDLER --------------------------- */
  const handleComplete = useCallback(mission => {
    if (isMissionCompleted(mission.id)) return;

    if (!isMissionAvailable(mission)) {
      showToast(`Level ${mission.requiredLevel}+ benötigt!`, 'error');
      return;
    }

    if (mission.daily && mission.requiredQuizzes && getDailyQuizCount() < mission.requiredQuizzes) {
      showToast(`Benötigte Quizze: ${getDailyQuizCount()}/${mission.requiredQuizzes}`, 'warning');
      return;
    }

    switch (mission.type) {
      case MISSION_TYPES.CHARACTER:
        completeMission(mission.reward);
        unlockCharacter(mission.unlock);
        showToast(`${mission.unlock.name} +${mission.reward} Punkte`, 'success');
        break;
      case MISSION_TYPES.COIN:
        addCoins(mission.reward);
        showToast(`+${mission.reward} Münzen`, 'success');
        break;
      case MISSION_TYPES.SPECIAL:
        mission.rewards.coins && addCoins(mission.rewards.coins);
        mission.rewards.character && unlockCharacter(mission.rewards.character);
        showToast('⭐ Spezialmission abgeschlossen!', 'success');
        break;
      default:
        break;
    }

    mission.daily
      ? setDailyMissionsData(prev => ({ ...prev, completed: [...prev.completed, mission.id] }))
      : setCompletedMissions(prev => [...prev, mission.id]);

    setRecentlyCompleted(prev => [...prev, mission.id]);
  }, [isMissionCompleted, isMissionAvailable, completeMission, unlockCharacter, addCoins, getDailyQuizCount, setDailyMissionsData, setCompletedMissions]);

  /* --------------------------- CLEANUP RECENTLY --------------------------- */
  useEffect(() => {
    if (!recentlyCompleted.length) return;
    const tids = recentlyCompleted.map(id => setTimeout(() => setRecentlyCompleted(p => p.filter(x => x !== id)), 5000));
    return () => tids.forEach(clearTimeout);
  }, [recentlyCompleted]);

  /* ------------------------------ FILTER LOGIC ---------------------------- */
  const filteredMissions = useMemo(() => {
    return mergeMissions().filter(m => {
      if (filter === 'character' && ![MISSION_TYPES.CHARACTER, MISSION_TYPES.SPECIAL].includes(m.type)) return false;
      if (filter === 'coin' && ![MISSION_TYPES.COIN, MISSION_TYPES.SPECIAL].includes(m.type)) return false;
      if (filter === 'completed' && !isMissionCompleted(m.id)) return false;
      if (filter === 'available' && (isMissionCompleted(m.id) || !isMissionAvailable(m))) return false;
      if (autoHideCompleted && isMissionCompleted(m.id) && filter !== 'completed' && !recentlyCompleted.includes(m.id)) return false;
      return true;
    });
  }, [filter, autoHideCompleted, recentlyCompleted, isMissionCompleted, isMissionAvailable]);

  /* ------------------------------------------------------------------------ */
  /*                                  RENDER                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className={`min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 ${isMobile ? 'px-2' : 'px-6'} pb-20`}>
      <header className="py-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-widest text-purple-400 drop-shadow">Missionen</h1>
      </header>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 select-none">
        {['all', 'character', 'coin', 'completed', 'available'].map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-1.5 rounded-full uppercase text-xs font-semibold tracking-wider transition-colors ${filter === k ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-purple-700'}`}
          >
            {k[0].toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      {/* AUTO‑HIDE */}
      <label className="flex items-center justify-center gap-2 mb-8 text-sm">
        <input type="checkbox" className="accent-purple-600 w-4 h-4" checked={autoHideCompleted} onChange={() => setAutoHideCompleted(!autoHideCompleted)} />
        Abgeschlossene Missionen automatisch ausblenden
      </label>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMissions.map(m => (
          <MissionCard
            key={m.id}
            mission={m}
            level={level}
            isCompleted={isMissionCompleted(m.id)}
            isAvailable={isMissionAvailable(m)}
            recentlyCompleted={recentlyCompleted.includes(m.id)}
            onComplete={handleComplete}
            getDailyQuizCount={getDailyQuizCount}
          />
        ))}
      </div>

      {!filteredMissions.length && <p className="mt-20 text-center text-gray-400">Keine Missionen gefunden.</p>}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MISSION CARD                                  */
/* -------------------------------------------------------------------------- */

const MissionCard = memo(({ mission, level, isCompleted, isAvailable, recentlyCompleted, onComplete, getDailyQuizCount }) => {
  const borderColor = {
    [RARITY.RARE]: 'border-yellow-500',
    [RARITY.EPIC]: 'border-pink-500',
    [RARITY.LEGENDARY]: 'border-red-600'
  }[mission.unlock?.rarity] || 'border-gray-700';

  const progress = mission.daily && mission.requiredQuizzes ? { current: getDailyQuizCount(), required: mission.requiredQuizzes } : null;

  return (
    <div
      className={`relative flex flex-col bg-gray-800 rounded-2xl p-4 shadow-lg border-2 ${borderColor} transition-transform ${isCompleted ? 'opacity-60 hover:opacity-90' : 'hover:-translate-y-1'}`}>
      {/* BADGES */}
      {mission.type === MISSION_TYPES.SPECIAL && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-0.5 rounded-full shadow">SPECIAL</span>
      )}
      {mission.unlock?.rarity && mission.unlock.rarity !== RARITY.COMMON && (
        <span className="absolute -top-3 right-3 bg-gray-900 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow border border-current">
          {mission.unlock.rarity}
        </span>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
        {mission.daily && <span className="text-purple-400 font-semibold uppercase">Täglich</span>}
        <span className="font-semibold capitalize">{mission.difficulty}</span>
      </div>

      {/* DESCRIPTION */}
      <h3 className="text-center font-extrabold text-yellow-400 text-sm leading-tight mb-1 uppercase tracking-tight">{mission.description}</h3>
      <p className="text-center text-sm text-gray-300 mb-4 leading-snug">{mission.detailedDescription}</p>

      {/* META */}
      <div className="flex items-center justify-center gap-3 mb-4 text-xs text-gray-400">
        <span>⏱ {mission.estimatedTime}</span>
        {mission.requiredLevel && (
          <span className={`${level < mission.requiredLevel ? 'text-red-500' : 'text-green-400'}`}>Lvl {mission.requiredLevel}+</span>
        )}
      </div>

      {/* REWARD */}
      <Reward mission={mission} />

      {/* PROGRESS */}
      {progress && (
        <>
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden my-3">
            <div className="absolute top-0 left-0 h-full bg-purple-600" style={{ width: `${(progress.current / progress.required) * 100}%` }} />
          </div>
          <p className="text-center text-xs text-gray-400 mb-1">
            {progress.current}/{progress.required} Quizze
          </p>
        </>
      )}

      {/* CTA */}
      <button
        className={`mt-auto py-2 rounded-xl font-semibold text-sm tracking-wider transition-colors ${isCompleted ? 'bg-gray-600' : !isAvailable ? 'bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
        onClick={() => onComplete(mission)}
        disabled={isCompleted || !isAvailable}
      >
        {isCompleted ? 'Abgeschlossen' : 'Abschließen'}
      </button>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                               REWARD COMPONENT                             */
/* -------------------------------------------------------------------------- */

const Reward = memo(({ mission }) => {
  if (mission.type === MISSION_TYPES.CHARACTER) {
    const rarity = mission.unlock.rarity;
    return (
      <div className="flex flex-col items-center gap-1 mb-4">
        <img
          src={mission.unlock.image}
          alt={mission.unlock.name}
          className="w-24 h-24 rounded-lg object-cover border border-gray-700"
          loading="lazy"
        />
        <span className="text-sm font-bold tracking-wide text-gray-200 uppercase drop-shadow">
          {mission.unlock.name}
        </span>
        <span className="text-xs text-gray-400">+{mission.reward} Punkte</span>
        {rarity !== RARITY.COMMON && (
          <span className="text-xs font-semibold uppercase tracking-widest mt-1">
            {rarity}
          </span>
        )}
      </div>
    );
  }

  if (mission.type === MISSION_TYPES.COIN) {
    return (
      <div className="flex flex-col items-center gap-1 mb-4 text-yellow-400">
        <span className="text-4xl" role="img" aria-label="coins">💰</span>
        <span className="text-sm font-bold">+{mission.reward} Münzen</span>
      </div>
    );
  }

  if (mission.type === MISSION_TYPES.SPECIAL) {
    return (
      <div className="flex flex-col items-center gap-2 mb-4">
        {mission.rewards.character && (
          <div className="flex flex-col items-center gap-1">
            <img
              src={mission.rewards.character.image}
              alt={mission.rewards.character.name}
              className="w-20 h-20 rounded-lg object-cover border border-gray-700"
              loading="lazy"
            />
            <span className="text-sm font-bold tracking-wide text-gray-200">
              {mission.rewards.character.name}
            </span>
          </div>
        )}
        {mission.rewards.coins && (
          <div className="flex flex-col items-center text-yellow-400">
            <span className="text-3xl" role="img" aria-label="coins">💰</span>
            <span className="text-sm font-bold">+{mission.rewards.coins} Münzen</span>
          </div>
        )}
      </div>
    );
  }

  return null;
});
