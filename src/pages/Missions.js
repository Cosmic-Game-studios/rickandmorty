import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { X, Coins } from "lucide-react";
import { UserContext } from "../context/UserContext";
import useIsMobile from "../hooks/useIsMobile";

/***************************************
 *  CONSTANTS & HELPERS                *
 **************************************/

export const MISSION_TYPES = {
  CHARACTER: "character",
  COIN: "coin",
  SPECIAL: "special"
};

export const RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary"
};

/**
 * Generic helper to persist state in localStorage
 */
function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

/**
 * Fancy toast with auto‑dismiss & framer‑motion slide‑in
 */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className={clsx(
        "fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded-2xl p-4 shadow-xl backdrop-blur",
        {
          "bg-green-600/80 text-white": type === "success",
          "bg-red-600/80 text-white": type === "error",
          "bg-yellow-600/80 text-white": type === "warning"
        }
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex-1 text-sm leading-tight">{message}</span>
        <button
          className="rounded-full bg-white/10 p-1 hover:bg-white/20"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

/***************************************
 *       MAIN MISSIONS COMPONENT       *
 **************************************/

/**
 * IMPORTANT: Replace this with your real missions array
 * coming from your API / JSON file
 */
export const MISSIONS_DATA = [];

export const DAILY_CHARACTER_MISSIONS = [
  {
    id: 101,
    description: "DAILY: Rescue Pickle Rick from the sewer rats!",
    detailedDescription:
      "Rick turned himself into a pickle to avoid family therapy, but now he's in danger. Help him fight off the sewer rats and get him back home!",
    reward: 120,
    type: MISSION_TYPES.CHARACTER,
    difficulty: "Medium",
    estimatedTime: "20 min",
    daily: true,
    unlock: {
      id: 265,
      name: "Pickle Rick",
      image: "https://rickandmortyapi.com/api/character/avatar/265.jpeg",
      rarity: RARITY.RARE
    }
  },
  // … (rest identical)
];

function Missions() {
  /* ---------- Hooks & context ---------- */
  const isMobile = useIsMobile();
  const {
    completeMission,
    unlockCharacter,
    addCoins,
    level
  } = useContext(UserContext);

  /* ---------- UI state ---------- */
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [autoHideCompleted, setAutoHideCompleted] = useState(true);
  const [recentlyCompleted, setRecentlyCompleted] = useState([]);

  /* ---------- Persistent state ---------- */
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

  /* ---------- Derived data ---------- */
  const allMissions = useMemo(
    () => [...MISSIONS_DATA, ...DAILY_CHARACTER_MISSIONS],
    []
  );

  const filteredMissions = useMemo(() => {
    return allMissions.filter((mission) => {
      const isCompleted = checkCompleted(mission.id, mission.daily);
      const isAvailable = !mission.requiredLevel || level >= mission.requiredLevel;

      // 1. by filter
      if (
        (filter === "character" &&
          ![MISSION_TYPES.CHARACTER, MISSION_TYPES.SPECIAL].includes(
            mission.type
          )) ||
        (filter === "coin" &&
          ![MISSION_TYPES.COIN, MISSION_TYPES.SPECIAL].includes(mission.type)) ||
        (filter === "completed" && !isCompleted) ||
        (filter === "available" && (isCompleted || !isAvailable))
      )
        return false;

      // 2. auto‑hide behaviour
      if (
        autoHideCompleted &&
        isCompleted &&
        filter !== "completed" &&
        !recentlyCompleted.includes(mission.id)
      )
        return false;

      return true;
    });
  }, [filter, level, completedMissions, dailyMissionsData, autoHideCompleted, recentlyCompleted]);

  /* ---------- Effects ---------- */
  // Reset dailies at midnight
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (dailyMissionsData.date !== today) {
      setDailyMissionsData({ date: today, completed: [] });
      setCompletedMissions((prev) =>
        prev.filter((id) => !allMissions.find((m) => m.id === id)?.daily)
      );
    }
  }, [dailyMissionsData, setDailyMissionsData, setCompletedMissions, allMissions]);

  // purge recentlyCompleted markers after 5s
  useEffect(() => {
    if (!recentlyCompleted.length) return;
    const timers = recentlyCompleted.map((id) =>
      setTimeout(() =>
        setRecentlyCompleted((prev) => prev.filter((mid) => mid !== id)),
      5_000)
    );
    return () => timers.forEach(clearTimeout);
  }, [recentlyCompleted]);

  /* ---------- Helper fns ---------- */
  const checkCompleted = (id, isDaily) =>
    isDaily
      ? dailyMissionsData.completed.includes(id)
      : completedMissions.includes(id);

  const getDailyQuizCount = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem("dailyQuizData");
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === today ? count : 0;
  }, []);

  const toastify = (message, type = "success") => setToast({ message, type });

  const handleComplete = (mission) => {
    if (checkCompleted(mission.id, mission.daily)) return;

    // Guard: level requirement
    if (mission.requiredLevel && level < mission.requiredLevel) {
      toastify(
        `Du musst Level ${mission.requiredLevel} erreichen, um diese Mission zu erfüllen!`,
        "error"
      );
      return;
    }

    // Guard: quiz requirement for dailies
    if (mission.daily && mission.requiredQuizzes) {
      const quizzes = getDailyQuizCount();
      if (quizzes < mission.requiredQuizzes) {
        toastify(
          `Du musst heute mindestens ${mission.requiredQuizzes} Quizze abschließen. Bisher: ${quizzes}`,
          "warning"
        );
        return;
      }
    }

    // Grant rewards
    switch (mission.type) {
      case MISSION_TYPES.CHARACTER: {
        completeMission(mission.reward);
        unlockCharacter(mission.unlock);
        toastify(
          `${mission.unlock.rarity !== RARITY.COMMON ? mission.unlock.rarity.toUpperCase() + " " : ""}${mission.unlock.name} freigeschaltet und ${mission.reward} Punkte erhalten!`
        );
        break;
      }
      case MISSION_TYPES.COIN: {
        addCoins(mission.reward);
        toastify(`Mission abgeschlossen! ${mission.reward} Münzen erhalten!`);
        break;
      }
      case MISSION_TYPES.SPECIAL: {
        const { coins, character } = mission.rewards;
        if (coins) addCoins(coins);
        if (character) unlockCharacter(character);
        toastify(
          `SPECIAL MISSION COMPLETED! ${
            character ? character.name + " freigeschaltet " : ""
          }${coins ? "und " + coins + " Münzen" : ""}`
        );
        break;
      }
      default:
        break;
    }

    // Track completion
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

  /* ---------- Render helpers ---------- */
  const Reward = ({ mission }) => {
    if (mission.type === MISSION_TYPES.CHARACTER)
      return (
        <div className="flex items-center gap-2">
          <img
            src={mission.unlock.image}
            alt={mission.unlock.name}
            className="h-10 w-10 rounded-full object-cover shadow"
            loading="lazy"
          />
          <span className="text-sm font-medium">
            {mission.reward} Punkte · {mission.unlock.name}
          </span>
        </div>
      );

    if (mission.type === MISSION_TYPES.COIN)
      return (
        <div className="flex items-center gap-1 text-sm font-medium">
          <Coins size={16} /> {mission.reward} Münzen
        </div>
      );

    if (mission.type === MISSION_TYPES.SPECIAL)
      return (
        <div className="flex flex-col gap-1 text-sm font-medium">
          {mission.rewards.coins && (
            <span className="flex items-center gap-1">
              <Coins size={16} /> {mission.rewards.coins} Münzen
            </span>
          )}
          {mission.rewards.character && (
            <span className="flex items-center gap-1">
              <img
                src={mission.rewards.character.image}
                alt={mission.rewards.character.name}
                className="h-6 w-6 rounded-full object-cover"
              />
              {mission.rewards.character.name}
            </span>
          )}
        </div>
      );

    return null;
  };

  const RarityBadge = ({ rarity }) => {
    if (!rarity || rarity === RARITY.COMMON) return null;
    const colors = {
      [RARITY.UNCOMMON]: "bg-lime-600",
      [RARITY.RARE]: "bg-sky-600",
      [RARITY.EPIC]: "bg-violet-600",
      [RARITY.LEGENDARY]: "bg-orange-600"
    };
    return (
      <Badge className={clsx("capitalize text-white", colors[rarity])}>{
        rarity
      }</Badge>
    );
  };

  /* ---------- JSX ---------- */
  return (
    <section className={clsx("container py-8", { "px-2": isMobile })}>
      <h1 className="mb-6 text-center text-3xl font-bold tracking-tight">
        Missionen
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {[
          { key: "all", label: "Alle" },
          { key: "character", label: "Charaktere" },
          { key: "coin", label: "Münzen" },
          { key: "completed", label: "Abgeschlossen" },
          { key: "available", label: "Verfügbar" }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}

        <Toggle
          pressed={autoHideCompleted}
          onPressedChange={setAutoHideCompleted}
          aria-label="Abgeschlossene automatisch ausblenden"
        >
          Auto‑Hide
        </Toggle>
      </div>

      {/* Missions grid */}
      <div
        className={clsx(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {filteredMissions.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Keine Missionen gefunden.
          </p>
        )}

        {filteredMissions.map((mission) => {
          const isCompleted = checkCompleted(mission.id, mission.daily);
          const isAvailable = !mission.requiredLevel || level >= mission.requiredLevel;
          const progress =
            mission.daily && mission.requiredQuizzes
              ? {
                  current: getDailyQuizCount(),
                  required: mission.requiredQuizzes
                }
              : null;

          return (
            <motion.div
              key={mission.id}
              layout
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={clsx({
                "opacity-50": isCompleted && autoHideCompleted && filter !== "completed"
              })}
            >
              <Card
                className={clsx(
                  "flex h-full flex-col border-2",
                  {
                    "border-gray-200": !isCompleted,
                    "border-green-500": isCompleted,
                    "ring-2 ring-purple-500": mission.type === MISSION_TYPES.SPECIAL
                  }
                )}
              >
                <CardHeader className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold leading-tight">
                      {mission.description}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mission.detailedDescription}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {mission.daily && <Badge variant="outline">Täglich</Badge>}
                    <Badge variant="secondary" className="capitalize">
                      {mission.difficulty}
                    </Badge>
                    <RarityBadge rarity={mission.unlock?.rarity} />
                  </div>
                </CardHeader>

                <CardContent className="mt-2 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>⏱️ {mission.estimatedTime}</span>
                    {mission.requiredLevel && (
                      <span
                        className={clsx({
                          "text-red-600": level < mission.requiredLevel
                        })}
                      >
                        Level {mission.requiredLevel}+
                      </span>
                    )}
                  </div>

                  <Reward mission={mission} />

                  {progress && (
                    <div className="w-full">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{progress.current}/{progress.required} Quizze</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
                        <div
                          className="h-full bg-indigo-600"
                          style={{
                            width: `${Math.min(
                              100,
                              (progress.current / progress.required) * 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    disabled={isCompleted || !isAvailable}
                    className={clsx({
                      "w-full": true,
                      "opacity-75": isCompleted
                    })}
                    onClick={() => handleComplete(mission)}
                  >
                    {isCompleted ? "Abgeschlossen" : "Abschließen"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}

export default Missions;
