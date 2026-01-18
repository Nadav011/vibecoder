import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettingsStore } from "./settingsStore";
import { handleStorageError } from "../utils/storage";
import { generateId } from "../utils/generateId";

export type PomodoroPhase = "work" | "shortBreak" | "longBreak" | "idle";

export interface PomodoroSession {
  id: string;
  startedAt: number;
  completedAt?: number;
  phase: PomodoroPhase;
  duration: number; // in minutes
  linkedTaskId?: string;
}

interface PomodoroStore {
  // State
  phase: PomodoroPhase;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionsCompleted: number;
  currentSessionStart: number | null;
  linkedTaskId: string | null;

  // History
  sessions: PomodoroSession[];
  todaySessions: number;
  totalSessions: number;

  // Actions
  start: (taskId?: string) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
  tick: () => void;
  completePhase: () => void;

  // Stats
  getTodayStats: () => { sessions: number; minutes: number };
  getWeekStats: () => { sessions: number; minutes: number };
}

const STORAGE_KEY = "@vibecoder/pomodoro";

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  phase: "idle",
  timeRemaining: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  sessionsCompleted: 0,
  currentSessionStart: null,
  linkedTaskId: null,
  sessions: [],
  todaySessions: 0,
  totalSessions: 0,

  start: (taskId) => {
    const settings = useSettingsStore.getState().settings.pomodoro;
    set({
      phase: "work",
      timeRemaining: settings.workDuration * 60,
      isRunning: true,
      currentSessionStart: Date.now(),
      linkedTaskId: taskId || null,
    });
  },

  pause: () => {
    set({ isRunning: false });
  },

  resume: () => {
    set({ isRunning: true });
  },

  skip: () => {
    const { phase, sessionsCompleted } = get();
    const settings = useSettingsStore.getState().settings.pomodoro;

    if (phase === "work") {
      // Skipping work - go to break
      const isLongBreak =
        (sessionsCompleted + 1) % settings.sessionsBeforeLongBreak === 0;
      set({
        phase: isLongBreak ? "longBreak" : "shortBreak",
        timeRemaining: isLongBreak
          ? settings.longBreakDuration * 60
          : settings.shortBreakDuration * 60,
        isRunning: settings.autoStartBreaks,
      });
    } else {
      // Skipping break - go to work
      set({
        phase: "work",
        timeRemaining: settings.workDuration * 60,
        isRunning: settings.autoStartWork,
        currentSessionStart: Date.now(),
      });
    }
  },

  reset: () => {
    const settings = useSettingsStore.getState().settings.pomodoro;
    set({
      phase: "idle",
      timeRemaining: settings.workDuration * 60,
      isRunning: false,
      currentSessionStart: null,
      linkedTaskId: null,
    });
  },

  tick: () => {
    // Use functional update to prevent race conditions
    set((state) => {
      if (!state.isRunning || state.timeRemaining <= 0) return state;

      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        // Schedule completePhase after state update to avoid race
        setTimeout(() => get().completePhase(), 0);
        return { ...state, timeRemaining: 0 };
      }
      return { ...state, timeRemaining: newTime };
    });
  },

  completePhase: () => {
    const {
      phase,
      sessionsCompleted,
      linkedTaskId,
      currentSessionStart,
      sessions,
    } = get();
    const settings = useSettingsStore.getState().settings.pomodoro;

    if (phase === "work") {
      // Complete work session
      const newSession: PomodoroSession = {
        id: generateId(),
        startedAt: currentSessionStart || Date.now(),
        completedAt: Date.now(),
        phase: "work",
        duration: settings.workDuration,
        linkedTaskId: linkedTaskId || undefined,
      };

      const newSessionsCompleted = sessionsCompleted + 1;
      const isLongBreak =
        newSessionsCompleted % settings.sessionsBeforeLongBreak === 0;

      const newSessions = [...sessions, newSession];
      saveSessions(newSessions);

      set({
        sessions: newSessions,
        sessionsCompleted: newSessionsCompleted,
        totalSessions: get().totalSessions + 1,
        phase: isLongBreak ? "longBreak" : "shortBreak",
        timeRemaining: isLongBreak
          ? settings.longBreakDuration * 60
          : settings.shortBreakDuration * 60,
        isRunning: settings.autoStartBreaks,
        currentSessionStart: null,
      });

      // Play notification sound if enabled
      if (settings.soundEnabled) {
        playNotificationSound();
      }
    } else {
      // Complete break
      set({
        phase: "work",
        timeRemaining: settings.workDuration * 60,
        isRunning: settings.autoStartWork,
        currentSessionStart: settings.autoStartWork ? Date.now() : null,
      });

      if (settings.soundEnabled) {
        playNotificationSound();
      }
    }
  },

  getTodayStats: () => {
    const { sessions } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todaySessions = sessions.filter(
      (s) =>
        s.completedAt && s.completedAt >= todayTimestamp && s.phase === "work",
    );

    return {
      sessions: todaySessions.length,
      minutes: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    };
  },

  getWeekStats: () => {
    const { sessions } = get();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const weekSessions = sessions.filter(
      (s) => s.completedAt && s.completedAt >= weekAgo && s.phase === "work",
    );

    return {
      sessions: weekSessions.length,
      minutes: weekSessions.reduce((acc, s) => acc + s.duration, 0),
    };
  },
}));

// Helpers
async function saveSessions(sessions: PomodoroSession[]): Promise<void> {
  try {
    // Only keep last 100 sessions
    const toSave = sessions.slice(-100);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    handleStorageError(error, "savePomodoroSessions");
  }
}

function playNotificationSound(): void {
  // Web Audio API notification
  if (typeof window !== "undefined" && window.AudioContext) {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio notification not available - this is expected on some platforms
    }
  }
}

export async function initPomodoroStore(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const sessions = JSON.parse(stored) as PomodoroSession[];
      usePomodoroStore.setState({
        sessions,
        totalSessions: sessions.filter((s) => s.phase === "work").length,
      });
    }
  } catch (error) {
    handleStorageError(error, "initPomodoroStore");
  }
}

// Format time for display (MM:SS)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Get phase display name
export function getPhaseDisplayName(phase: PomodoroPhase): string {
  switch (phase) {
    case "work":
      return "זמן עבודה";
    case "shortBreak":
      return "הפסקה קצרה";
    case "longBreak":
      return "הפסקה ארוכה";
    case "idle":
      return "מוכן להתחיל";
  }
}
