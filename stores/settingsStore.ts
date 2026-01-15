import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskPriority } from "../types";

export type ThemeMode = "dark" | "light" | "system";

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

export interface AppSettings {
  // Theme
  theme: ThemeMode;

  // Language
  language: "he" | "en";

  // Feedback
  hapticFeedback: boolean;
  soundEffects: boolean;

  // Defaults
  defaultPriority: TaskPriority;
  showCompletedTasks: boolean;

  // Pomodoro
  pomodoro: PomodoroSettings;

  // Analytics
  dailyGoal: number; // tasks per day
  trackProductivity: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  language: "he",
  hapticFeedback: true,
  soundEffects: true,
  defaultPriority: "p2",
  showCompletedTasks: true,
  pomodoro: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
  },
  dailyGoal: 5,
  trackProductivity: true,
};

const STORAGE_KEY = "@vibecoder/settings";

interface SettingsStore {
  settings: AppSettings;
  isLoaded: boolean;

  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  updatePomodoroSettings: (updates: Partial<PomodoroSettings>) => void;
  toggleTheme: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  updateSettings: (updates) => {
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      saveSettings(newSettings);
      return { settings: newSettings };
    });
  },

  updatePomodoroSettings: (updates) => {
    set((state) => {
      const newSettings = {
        ...state.settings,
        pomodoro: { ...state.settings.pomodoro, ...updates },
      };
      saveSettings(newSettings);
      return { settings: newSettings };
    });
  },

  toggleTheme: () => {
    set((state) => {
      const themes: ThemeMode[] = ["dark", "light", "system"];
      const currentIndex = themes.indexOf(state.settings.theme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      const newSettings = { ...state.settings, theme: nextTheme };
      saveSettings(newSettings);
      return { settings: newSettings };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    saveSettings(DEFAULT_SETTINGS);
  },
}));

// Storage helpers
async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

export async function initSettingsStore(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>;
      // Merge with defaults to handle new settings
      const merged = {
        ...DEFAULT_SETTINGS,
        ...parsed,
        pomodoro: { ...DEFAULT_SETTINGS.pomodoro, ...parsed.pomodoro },
      };
      useSettingsStore.setState({ settings: merged, isLoaded: true });
    } else {
      useSettingsStore.setState({ isLoaded: true });
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
    useSettingsStore.setState({ isLoaded: true });
  }
}

// Selectors
export const selectTheme = (state: SettingsStore) => state.settings.theme;
export const selectLanguage = (state: SettingsStore) => state.settings.language;
export const selectPomodoroSettings = (state: SettingsStore) =>
  state.settings.pomodoro;
