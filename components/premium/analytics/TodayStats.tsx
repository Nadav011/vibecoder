import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";
import { StatCard } from "./StatCard";
import type { DailyStat, PomodoroStatsData } from "./types";

interface TodayStatsProps {
  todayStats: DailyStat;
  pomodoroStats: PomodoroStatsData;
  isSmallScreen: boolean;
}

export function TodayStats({
  todayStats,
  pomodoroStats,
  isSmallScreen,
}: TodayStatsProps) {
  return (
    <FadeIn delay={100} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>היום</Text>
        <View
          style={[styles.statsGrid, isSmallScreen && styles.statsGridSmall]}
        >
          <StatCard
            icon="checkmark-done"
            value={todayStats.tasksCompleted}
            label="משימות"
            color={colors.accent.success}
            small={isSmallScreen}
          />
          <StatCard
            icon="checkbox"
            value={todayStats.todosCompleted}
            label="מהירות"
            color={colors.accent.primary}
            small={isSmallScreen}
          />
          <StatCard
            icon="timer"
            value={pomodoroStats.sessions}
            label="פומודורו"
            color={colors.accent.warning}
            small={isSmallScreen}
          />
          <StatCard
            icon="time"
            value={todayStats.focusMinutes}
            label="דקות"
            color={colors.accent.info}
            suffix="'"
            small={isSmallScreen}
          />
        </View>
      </View>
    </FadeIn>
  );
}
