import React from "react";
import { Text, ScrollView, useWindowDimensions } from "react-native";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";
import { useAnalyticsData } from "./useAnalyticsData";
import { CompactAnalytics } from "./CompactAnalytics";
import { ProductivityScore } from "./ProductivityScore";
import { TodayStats } from "./TodayStats";
import { WeeklyChart } from "./WeeklyChart";
import { PriorityDistribution } from "./PriorityDistribution";
import { CompletionRate } from "./CompletionRate";
import { AllTimeStats } from "./AllTimeStats";
import { TipsCard } from "./TipsCard";

interface AnalyticsContentProps {
  compact?: boolean;
}

export function AnalyticsContent({ compact = false }: AnalyticsContentProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const {
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
  } = useAnalyticsData();

  if (compact) {
    return (
      <CompactAnalytics
        currentStreak={currentStreak}
        tasksCompletedToday={todayStats.tasksCompleted}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <FadeIn delay={0} direction="up">
        <Text style={styles.title}>סטטיסטיקות</Text>
      </FadeIn>

      {/* Productivity Score */}
      <ProductivityScore
        productivityScore={productivityScore}
        currentStreak={currentStreak}
      />

      {/* Today's Stats */}
      <TodayStats
        todayStats={todayStats}
        pomodoroStats={pomodoroStats}
        isSmallScreen={isSmallScreen}
      />

      {/* Weekly Chart */}
      <WeeklyChart weeklyData={weeklyData} />

      {/* Task Distribution */}
      <PriorityDistribution
        priorityDistribution={priorityDistribution}
        totalPriorityTasks={totalPriorityTasks}
      />

      {/* Completion Rate */}
      <CompletionRate
        completionRate={completionRate}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />

      {/* All-Time Stats */}
      <AllTimeStats
        longestStreak={longestStreak}
        totalTasksCompleted={totalTasksCompleted}
        totalFocusMinutes={totalFocusMinutes}
      />

      {/* Quick Tips */}
      <TipsCard />
    </ScrollView>
  );
}
