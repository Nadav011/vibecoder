import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAnalyticsStore } from "../../../stores/analyticsStore";
import { useKanbanStore } from "../../../stores/kanbanStore";
import { usePomodoroStore } from "../../../stores/pomodoroStore";
import type { AnalyticsData, DailyStat, WeeklyDataPoint } from "./types";

export function useAnalyticsData(): AnalyticsData {
  // Get state values (not getters) from stores using shallow comparison
  const analyticsState = useAnalyticsStore(
    useShallow((state) => ({
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      totalTasksCompleted: state.totalTasksCompleted,
      totalFocusMinutes: state.totalFocusMinutes,
      dailyStats: state.dailyStats,
    })),
  );

  // Use shallow selectors to prevent unnecessary re-renders
  const tasks = useKanbanStore(useShallow((state) => state.tasks));
  const pomodoroSessions = usePomodoroStore(
    useShallow((state) => state.sessions),
  );

  const {
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalFocusMinutes,
    dailyStats,
  } = analyticsState;

  // Memoize computed values to prevent infinite re-renders
  const todayStats = useMemo((): DailyStat => {
    const todayKey = new Date().toISOString().split("T")[0];
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
  }, [dailyStats]);

  const weeklyData = useMemo((): WeeklyDataPoint[] => {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const result: WeeklyDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dayStat = dailyStats.find((s) => s.date === dateKey);
      result.push({
        day: days[date.getDay()],
        completed: dayStat
          ? dayStat.tasksCompleted + dayStat.todosCompleted
          : 0,
        created: 0,
      });
    }
    return result;
  }, [dailyStats]);

  const productivityScore = useMemo(() => {
    let score = 0;
    score += Math.min(todayStats.tasksCompleted * 10, 40);
    score += Math.min(todayStats.todosCompleted * 5, 20);
    score += Math.min(todayStats.pomodoroSessions * 10, 30);
    score += Math.min(currentStreak * 2, 10);
    return Math.min(score, 100);
  }, [todayStats, currentStreak]);

  const { completionRate, totalTasks, completedTasks } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "complete").length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      completionRate: rate,
      totalTasks: total,
      completedTasks: completed,
    };
  }, [tasks]);

  const pomodoroStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todaySessions = pomodoroSessions.filter(
      (s) =>
        s.completedAt && s.completedAt >= todayTimestamp && s.phase === "work",
    );

    return {
      sessions: todaySessions.length,
      minutes: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    };
  }, [pomodoroSessions]);

  // Calculate priority distribution (memoized)
  const { priorityDistribution, totalPriorityTasks } = useMemo(() => {
    const distribution = {
      p0: tasks.filter((t) => t.priority === "p0").length,
      p1: tasks.filter((t) => t.priority === "p1").length,
      p2: tasks.filter((t) => t.priority === "p2").length,
      p3: tasks.filter((t) => t.priority === "p3").length,
    };
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return { priorityDistribution: distribution, totalPriorityTasks: total };
  }, [tasks]);

  return {
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalFocusMinutes,
    todayStats,
    weeklyData,
    productivityScore,
    completionRate,
    pomodoroStats,
    priorityDistribution,
    totalPriorityTasks,
    totalTasks,
    completedTasks,
  };
}
