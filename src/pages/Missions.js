import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from "react";
import { UserContext } from "../context/UserContext";
import useIsMobile from "../hooks/useIsMobile";

/*****************************************
 * CONSTANTS
 *****************************************/
const MISSION_TYPES = {
  CHARACTER: "character",
  COIN: "coin",
  SPECIAL: "special"
};

const RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary"
};

/*****************************************
 * SMALL, SELF‑CONTAINED UI HELPERS       *
 *****************************************/

/** Persist any value in localStorage with minimal boilerplate */
function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* Ignore */
    }
  }, [key, state]);
  return [state, setState];
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

function RarityBadge({ rarity }) {
  if (!rarity || rarity === RARITY.COMMON) return null;
  return <span className={`rarity-badge ${rarity}`}>{rarity}</span>;
}

/*****************************************
 * PLACEHOLDER DATA (replace with real)   *
 *****************************************/

export const MISSIONS_DATA = [];

export const DAILY_CHARACTER_MISSIONS = [
  // … belasse deine bestehenden Missions‑Objekte unverändert …
];

/*****************************************
 * MAIN COMPONENT                         *
 *****************************************/

function Missions() {
  const isMobile = useIsMobile();
  const {
    completeMission,
    unlockCharacter,
    addCoins,
    level
  } = useContext(UserContext);

  /* ───────── UI STATE ───────── */
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [autoHideCompleted, setAutoHideCompleted] = useState(true);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);

  /* ───────── LOCAL STORAGE ───────── */
  const [completedMissions, setCompletedMissions] = usePersistentState(
    "completedMissions",
    []
  );
  const [dailyMissionsData, setDailyMissionsData] = usePersistentState(
    "dailyMissionsData",
    {
      date: new Date().toISOString().slice(0, 10),
      completed: []
    }
  );

  /* ───────── RESET DAILY ───────── */
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (dailyMissionsData.date !== today) {
      setDailyMissionsData({ date: today, completed: [] });
      // keep only non‑daily completions
      setCompletedMissions((prev) =>
        prev.filter((id) => {
          const mission = [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS].find(
            (m) => m.id === id
          );
          return mission && !mission.daily;
        })
      );
    }
  }, [dailyMissionsData.date, setDailyMissionsData, setCompletedMissions]);

  /* ───────── PURGE RECENT BADGES ───────── */
  useEffect(() => {
    if (!recentlyCompleted.length) return;
    const timers = recentlyCompleted.map((id) =>
      setTimeout(() =>
        setRecentlyCompleted((prev) => prev.filter((mid) => mid !== id)),
      5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [recentlyCompleted]);

  /* ───────── HELPERS ───────── */
  const getDailyQuizCount = useCallback(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const raw = localStorage.getItem("dailyQuizData");
      if (!raw) return 0;
      const { date, count } = JSON.parse(raw);
      return date === today ? count : 0;
    } catch {
      return 0;
    }
  }, []);

  const isMissionCompleted = (id, isDaily) =>
    isDaily
      ? dailyMissionsData.completed.includes(id)
      : completedMissions.includes(id);

  /* ───────── FILTERED LIST ───────── */
  const allMissions = useMemo(
    () => [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS],
    []
  );

  const filteredMissions = useMemo(() => {
    return allMissions.filter((mission) => {
      const completed = isMissionCompleted(mission.id, mission.daily);
      const available = !mission.requiredLevel || level >= mission.requiredLevel;

      if (
        (filter === "character" &&
          ![MISSION_TYPES.CHARACTER, MISSION_TYPES.SPECIAL].includes(
            mission.type
          )) ||
        (filter === "coin" &&
          ![MISSION_TYPES.COIN, MISSION_TYPES.SPECIAL].includes(mission.type)) ||
        (filter === "completed" && !completed) ||
        (filter === "available" && (completed || !available))
      )
        return false;

      if (
        autoHideCompleted &&
        completed &&
        filter !== "completed" &&
        !recentlyCompleted.includes(mission.id)
      )
        return false;

      return true;
    });
  }, [filter, level, completedMissions, dailyMissionsData, autoHideCompleted, recentlyCompleted]);

  /* ───────── NOTIFICATION ───────── */
  const notify = (msg, type = "success") => setToast({ msg, type });

  /* ───────── COMPLETE HANDLER ───────── */
  const handleComplete = (mission) => {
    if (isMissionCompleted(mission.id, mission.daily)) return;

    if (mission.requiredLevel && level < mission.requiredLevel) {
      notify(`Du musst Level ${mission.requiredLevel} erreichen!`, "error");
      return;
    }

    if (mission.daily && mission.requiredQuizzes) {
      const q = getDailyQuizCount();
      if (q < mission.requiredQuizzes) {
        notify(
          `Du musst heute mindestens ${mission.requiredQuizzes} Quizze abschließen (aktuell ${q}).`,
          "warning"
        );
        return;
      }
    }

    switch (mission.type) {
      case MISSION_TYPES.CHARACTER:
        completeMission(mission.reward);
        unlockCharacter(mission.unlock);
        notify(
          `${mission.unlock.rarity !== RARITY.COMMON ? mission.unlock.rarity.toUpperCase() + " " : ""}${mission.unlock.name} freigeschaltet und ${mission.reward} Punkte erhalten!`
        );
        break;
      case MISSION_TYPES.COIN:
        addCoins(mission.reward);
        notify(`Mission abgeschlossen! ${mission.reward} Münzen erhalten!`);
        break;
      case MISSION_TYPES.SPECIAL: {
        const { coins, character } = mission.rewards || {};
        if (coins) addCoins(coins);
        if (character) unlockCharacter(character);
        notify(
          `SPECIAL COMPLETE! ${character ? character.name + " " : ""}${coins ? "+ " + coins + " Münzen" : ""}`
        );
        break;
      }
      default:
        break;
    }

    if (mission.daily) {
      setDailyMissionsData((prev) => ({
        ...prev,
        completed: [...prev.completed, mission.id]
      }));
    } else {
      setCompletedMissions((prev) => [...prev, mission.id]);
    }

    setRecentlyCompleted((prev) => [...prev, mission.id]);
  };

  /* ───────── RENDER HELPERS ───────── */
  const renderReward = (mission) => {
    if (mission.type === MISSION_TYPES.CHARACTER)
      return (
        <div className="reward-character">
          <img
            src={mission.unlock.image}
            alt={mission.unlock.name}
            className="reward-thumb"
            loading="lazy"
          />
          <span>
            {mission.reward} Punkte · {mission.unlock.name}
          </span>
        </div>
      );
    if (mission.type === MISSION_TYPES.COIN)
      return (
        <div className="reward-coin">
          💰 {mission.reward} Münzen
        </div>
      );
    if (mission.type === MISSION_TYPES.SPECIAL)
      return (
        <div className="reward-special">
          {mission.rewards?.coins && <span>💰 {mission.rewards.coins} Münzen</span>}
          {mission.rewards?.character && (
            <span>
              <img
                src={mission.rewards.character.image}
                alt={mission.rewards.character.name}
                className="reward-thumb"
                loading="lazy"
              />
              {mission.rewards.character.name}
            </span>
          )}
        </div>
      );
  };

  /* ───────── JSX ───────── */
  return (
    <div className={`missions-page ${isMobile ? "mobile" : ""}`}>
      <h1 className="title">Missionen</h1>

      {/* FILTERBAR */}
      <div className="filter-bar">
        {[
          { key: "all", label: "Alle" },
          { key: "character", label: "Charaktere" },
          { key: "coin", label: "Münzen" },
          { key: "completed", label: "Abgeschlossen" },
          { key: "available", label: "Verfügbar" }
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
        <label className="auto-hide-checkbox">
          <input
            type="checkbox"
            checked={autoHideCompleted}
            onChange={() => setAutoHideCompleted((v) => !v)}
          />
          Auto‑Hide
        </label>
      </div>

      {/* GRID */}
      <div className="missions-grid">
        {filteredMissions.length === 0 && (
          <p className="empty-text">Keine Missionen gefunden.</p>
        )}

        {filteredMissions.map((mission) => {
          const completed = isMissionCompleted(mission.id, mission.daily);
          const available = !mission.requiredLevel || level >= mission.requiredLevel;
          const progress =
            mission.daily && mission.requiredQuizzes
              ? { current: getDailyQuizCount(), required: mission.requiredQuizzes }
              : null;

          return (
            <div
              key={mission.id}
              className={`mission-card ${completed ? "completed" : ""} ${!available ? "unavailable" : ""}`}
            >
              {/* HEADER */}
              <div className="mission-header">
                <div className="mission-tags">
                  {mission.daily && <span className="tag daily">Täglich</span>}
                  <span className="tag difficulty">{mission.difficulty}</span>
                  {mission.unlock && <RarityBadge rarity={mission.unlock.rarity} />}
                </div>
                <h3 className="mission-desc">{mission.description}</h3>
                <p className="mission-detail">{mission.detailedDescription}</p>
              </div>

              {/* META */}
              <div className="mission-meta">
                <span>⏱️ {mission.estimatedTime}</span>
                {mission.requiredLevel && (
                  <span className="level">
                    Level {mission.requiredLevel}+
                  </span>
                )}
              </div>

              {/* REWARD */}
              {renderReward(mission)}

              {/* PROGRESS */}
              {progress && (
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${(progress.current / progress.required) * 100}%` }} />
                  <span className="progress-text">
                    {progress.current}/{progress.required} Quizze
                  </span>
                </div>
              )}

              {/* BUTTON */}
              <button
                className="mission-btn"
                disabled={completed || !available}
                onClick={() => handleComplete(mission)}
              >
                {completed ? "Abgeschlossen" : "Abschließen"}
              </button>
            </div>
          );
        })}
      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Missions;
