import type { Ionicons } from "@expo/vector-icons";

export interface DailyStat {
  date: string;
  tasksCompleted: number;
  todosCompleted: number;
  pomodoroSessions: number;
  focusMinutes: number;
}

export interface WeeklyDataPoint {
  day: string;
  completed: number;
  created: number;
}

export interface PriorityDistribution {
  p0: number;
  p1: number;
  p2: number;
  p3: number;
}

export interface PomodoroStatsData {
  sessions: number;
  minutes: number;
}

export interface AnalyticsData {
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  todayStats: DailyStat;
  weeklyData: WeeklyDataPoint[];
  productivityScore: number;
  completionRate: number;
  pomodoroStats: PomodoroStatsData;
  priorityDistribution: PriorityDistribution;
  totalPriorityTasks: number;
  totalTasks: number;
  completedTasks: number;
}

export interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color: string;
  suffix?: string;
  small?: boolean;
}

export interface LegendItemProps {
  color: string;
  label: string;
  value: number;
}
