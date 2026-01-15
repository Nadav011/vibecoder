import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKanbanStore } from "./kanbanStore";
import { useTodoStore } from "./todoStore";
import { usePomodoroStore } from "./pomodoroStore";

export interface DailyStats {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  todosCompleted: number;
  pomodoroSessions: number;
  focusMinutes: number;
}

export interface HourlyActivity {
  hour: number; // 0-23
  count: number;
}

export interface WeeklyData {
  day: string;
  completed: number;
  created: number;
}

interface AnalyticsStore {
  // Historical data
  dailyStats: DailyStats[];
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;

  // Actions
  recordTaskCompletion: () => void;
  recordTodoCompletion: () => void;
  recordPomodoroSession: (minutes: number) => void;
  updateStreak: () => void;

  // Computed getters
  getTodayStats: () => DailyStats;
  getWeeklyData: () => WeeklyData[];
  getHourlyActivity: () => HourlyActivity[];
  getProductivityScore: () => number;
  getCompletionRate: () => number;
}

const STORAGE_KEY = "@vibecoder/analytics";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getDayName(dateStr: string): string {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  dailyStats: [],
  currentStreak: 0,
  longestStreak: 0,
  totalTasksCompleted: 0,
  totalFocusMinutes: 0,

  recordTaskCompletion: () => {
    const todayKey = getTodayKey();
    const { dailyStats } = get();

    const existingIndex = dailyStats.findIndex((s) => s.date === todayKey);

    let newStats: DailyStats[];
    if (existingIndex >= 0) {
      newStats = [...dailyStats];
      newStats[existingIndex] = {
        ...newStats[existingIndex],
        tasksCompleted: newStats[existingIndex].tasksCompleted + 1,
      };
    } else {
      newStats = [
        ...dailyStats,
        {
          date: todayKey,
          tasksCompleted: 1,
          todosCompleted: 0,
          pomodoroSessions: 0,
          focusMinutes: 0,
        },
      ];
    }

    set({
      dailyStats: newStats,
      totalTasksCompleted: get().totalTasksCompleted + 1,
    });
    get().updateStreak();
    saveAnalytics(get());
  },

  recordTodoCompletion: () => {
    const todayKey = getTodayKey();
    const { dailyStats } = get();

    const existingIndex = dailyStats.findIndex((s) => s.date === todayKey);

    let newStats: DailyStats[];
    if (existingIndex >= 0) {
      newStats = [...dailyStats];
      newStats[existingIndex] = {
        ...newStats[existingIndex],
        todosCompleted: newStats[existingIndex].todosCompleted + 1,
      };
    } else {
      newStats = [
        ...dailyStats,
        {
          date: todayKey,
          tasksCompleted: 0,
          todosCompleted: 1,
          pomodoroSessions: 0,
          focusMinutes: 0,
        },
      ];
    }

    set({ dailyStats: newStats });
    get().updateStreak();
    saveAnalytics(get());
  },

  recordPomodoroSession: (minutes: number) => {
    const todayKey = getTodayKey();
    const { dailyStats } = get();

    const existingIndex = dailyStats.findIndex((s) => s.date === todayKey);

    let newStats: DailyStats[];
    if (existingIndex >= 0) {
      newStats = [...dailyStats];
      newStats[existingIndex] = {
        ...newStats[existingIndex],
        pomodoroSessions: newStats[existingIndex].pomodoroSessions + 1,
        focusMinutes: newStats[existingIndex].focusMinutes + minutes,
      };
    } else {
      newStats = [
        ...dailyStats,
        {
          date: todayKey,
          tasksCompleted: 0,
          todosCompleted: 0,
          pomodoroSessions: 1,
          focusMinutes: minutes,
        },
      ];
    }

    set({
      dailyStats: newStats,
      totalFocusMinutes: get().totalFocusMinutes + minutes,
    });
    saveAnalytics(get());
  },

  updateStreak: () => {
    const { dailyStats } = get();
    if (dailyStats.length === 0) {
      set({ currentStreak: 0 });
      return;
    }

    // Sort by date descending
    const sorted = [...dailyStats].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const statDate = new Date(sorted[i].date);
      statDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      // Check if this day had any productive activity
      const hadActivity =
        sorted[i].tasksCompleted > 0 ||
        sorted[i].todosCompleted > 0 ||
        sorted[i].pomodoroSessions > 0;

      if (statDate.getTime() === expectedDate.getTime() && hadActivity) {
        streak++;
      } else {
        break;
      }
    }

    set({
      currentStreak: streak,
      longestStreak: Math.max(streak, get().longestStreak),
    });
  },

  getTodayStats: () => {
    const todayKey = getTodayKey();
    const { dailyStats } = get();

    const todayStat = dailyStats.find((s) => s.date === todayKey);
    return (
      todayStat || {
        date: todayKey,
        tasksCompleted: 0,
        todosCompleted: 0,
        pomodoroSessions: 0,
        focusMinutes: 0,
      }
    );
  },

  getWeeklyData: () => {
    const { dailyStats } = get();
    const result: WeeklyData[] = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      const dayStat = dailyStats.find((s) => s.date === dateKey);

      result.push({
        day: getDayName(dateKey),
        completed: dayStat
          ? dayStat.tasksCompleted + dayStat.todosCompleted
          : 0,
        created: 0, // Would need to track this separately
      });
    }

    return result;
  },

  getHourlyActivity: () => {
    // This would ideally track when tasks are completed
    // For now, return mock data based on typical patterns
    const hours: HourlyActivity[] = [];
    for (let i = 0; i < 24; i++) {
      let count = 0;
      // Simulate typical work patterns
      if (i >= 9 && i <= 12) count = Math.floor(Math.random() * 5) + 3;
      else if (i >= 14 && i <= 18) count = Math.floor(Math.random() * 4) + 2;
      else if (i >= 20 && i <= 22) count = Math.floor(Math.random() * 3) + 1;

      hours.push({ hour: i, count });
    }
    return hours;
  },

  getProductivityScore: () => {
    const todayStats = get().getTodayStats();
    const { currentStreak } = get();

    // Calculate score based on various factors
    let score = 0;

    // Tasks completed (up to 40 points)
    score += Math.min(todayStats.tasksCompleted * 10, 40);

    // Todos completed (up to 20 points)
    score += Math.min(todayStats.todosCompleted * 5, 20);

    // Pomodoro sessions (up to 30 points)
    score += Math.min(todayStats.pomodoroSessions * 10, 30);

    // Streak bonus (up to 10 points)
    score += Math.min(currentStreak * 2, 10);

    return Math.min(score, 100);
  },

  getCompletionRate: () => {
    const kanban = useKanbanStore.getState();
    const totalTasks = kanban.tasks.length;
    const completedTasks = kanban.tasks.filter(
      (t) => t.status === "complete",
    ).length;

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  },
}));

// Persistence
async function saveAnalytics(state: Partial<AnalyticsStore>): Promise<void> {
  try {
    const toSave = {
      dailyStats: state.dailyStats?.slice(-30), // Keep last 30 days
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalTasksCompleted: state.totalTasksCompleted,
      totalFocusMinutes: state.totalFocusMinutes,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("Failed to save analytics:", error);
  }
}

export async function initAnalyticsStore(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      useAnalyticsStore.setState({
        dailyStats: data.dailyStats || [],
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        totalTasksCompleted: data.totalTasksCompleted || 0,
        totalFocusMinutes: data.totalFocusMinutes || 0,
      });
      // Update streak on load
      useAnalyticsStore.getState().updateStreak();
    }
  } catch (error) {
    console.error("Failed to load analytics:", error);
  }
}

// Helper to format minutes into hours:minutes
export function formatFocusTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")} שעות`;
  }
  return `${mins} דקות`;
}
