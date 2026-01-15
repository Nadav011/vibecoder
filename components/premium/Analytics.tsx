import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useShallow } from "zustand/react/shallow";
import { colors, spacing, radius, typography } from "../../theme";
import { useAnalyticsStore } from "../../stores/analyticsStore";
import { useKanbanStore } from "../../stores/kanbanStore";
import { usePomodoroStore, PomodoroSession } from "../../stores/pomodoroStore";
import { FadeIn } from "../animated";
import { Modal } from "../ui/Modal";

interface AnalyticsProps {
  compact?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export function Analytics({
  compact = false,
  visible,
  onClose,
}: AnalyticsProps) {
  // If used as modal, wrap in Modal component
  if (visible !== undefined && onClose) {
    return (
      <Modal visible={visible} onClose={onClose} title="סטטיסטיקות">
        <AnalyticsContent compact={compact} />
      </Modal>
    );
  }

  return <AnalyticsContent compact={compact} />;
}

function AnalyticsContent({ compact = false }: { compact?: boolean }) {
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

  const tasks = useKanbanStore((state) => state.tasks);
  const pomodoroSessions = usePomodoroStore((state) => state.sessions);

  const {
    currentStreak,
    longestStreak,
    totalTasksCompleted,
    totalFocusMinutes,
    dailyStats,
  } = analyticsState;

  // Memoize computed values to prevent infinite re-renders
  const todayStats = useMemo(() => {
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

  const weeklyData = useMemo(() => {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const result = [];
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

  const completionRate = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "complete").length;
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
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

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactStat}>
          <Ionicons
            name="flame"
            size={16}
            color={currentStreak > 0 ? colors.accent.error : colors.text.muted}
          />
          <Text style={styles.compactValue}>{currentStreak}</Text>
        </View>
        <View style={styles.compactDivider} />
        <View style={styles.compactStat}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.accent.success}
          />
          <Text style={styles.compactValue}>{todayStats.tasksCompleted}</Text>
        </View>
      </View>
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
      <FadeIn delay={50} direction="up">
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>ציון פרודוקטיביות</Text>
            <View style={styles.streakBadge}>
              <Ionicons
                name="flame"
                size={14}
                color={
                  currentStreak > 0 ? colors.accent.error : colors.text.muted
                }
              />
              <Text
                style={[
                  styles.streakText,
                  currentStreak > 0 && styles.streakTextActive,
                ]}
              >
                {currentStreak} ימים רצופים
              </Text>
            </View>
          </View>

          <View style={styles.scoreCircle}>
            <View style={styles.scoreCircleInner}>
              <Text style={styles.scoreValue}>{productivityScore}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View
              style={[
                styles.scoreProgress,
                {
                  transform: [
                    { rotate: `${(productivityScore / 100) * 360}deg` },
                  ],
                },
              ]}
            />
          </View>

          <Text style={styles.scoreHint}>
            {productivityScore >= 80
              ? "מדהים! אתה על גלגל!"
              : productivityScore >= 50
                ? "עבודה טובה, המשך כך!"
                : "קדימה, אתה יכול!"}
          </Text>
        </View>
      </FadeIn>

      {/* Today's Stats */}
      <FadeIn delay={100} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>היום</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="checkmark-done"
              value={todayStats.tasksCompleted}
              label="משימות"
              color={colors.accent.success}
            />
            <StatCard
              icon="checkbox"
              value={todayStats.todosCompleted}
              label="מהירות"
              color={colors.accent.primary}
            />
            <StatCard
              icon="timer"
              value={pomodoroStats.sessions}
              label="פומודורו"
              color={colors.accent.warning}
            />
            <StatCard
              icon="time"
              value={todayStats.focusMinutes}
              label="דקות מיקוד"
              color={colors.accent.info}
              suffix="'"
            />
          </View>
        </View>
      </FadeIn>

      {/* Weekly Chart */}
      <FadeIn delay={150} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>השבוע</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {weeklyData.map((day, index) => {
                const maxValue = Math.max(
                  ...weeklyData.map((d) => d.completed),
                  1,
                );
                const height = (day.completed / maxValue) * 100;
                const isToday = index === weeklyData.length - 1;

                return (
                  <View key={day.day} style={styles.chartBar}>
                    <View style={styles.chartBarWrapper}>
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${Math.max(height, 5)}%`,
                            backgroundColor: isToday
                              ? colors.accent.primary
                              : colors.bg.tertiary,
                          },
                        ]}
                      >
                        {day.completed > 0 && (
                          <Text style={styles.chartBarValue}>
                            {day.completed}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.chartBarLabel,
                        isToday && styles.chartBarLabelActive,
                      ]}
                    >
                      {day.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </FadeIn>

      {/* Task Distribution */}
      <FadeIn delay={200} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>התפלגות לפי עדיפות</Text>
          <View style={styles.distributionCard}>
            <View style={styles.distributionBar}>
              {totalPriorityTasks > 0 ? (
                <>
                  <View
                    style={[
                      styles.distributionSegment,
                      {
                        flex: priorityDistribution.p0,
                        backgroundColor: colors.status.p0,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.distributionSegment,
                      {
                        flex: priorityDistribution.p1,
                        backgroundColor: colors.status.p1,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.distributionSegment,
                      {
                        flex: priorityDistribution.p2,
                        backgroundColor: colors.status.p2,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.distributionSegment,
                      {
                        flex: priorityDistribution.p3,
                        backgroundColor: colors.status.p3,
                      },
                    ]}
                  />
                </>
              ) : (
                <View
                  style={[
                    styles.distributionSegment,
                    { flex: 1, backgroundColor: colors.bg.tertiary },
                  ]}
                />
              )}
            </View>

            <View style={styles.distributionLegend}>
              <LegendItem
                color={colors.status.p0}
                label="קריטי"
                value={priorityDistribution.p0}
              />
              <LegendItem
                color={colors.status.p1}
                label="גבוה"
                value={priorityDistribution.p1}
              />
              <LegendItem
                color={colors.status.p2}
                label="בינוני"
                value={priorityDistribution.p2}
              />
              <LegendItem
                color={colors.status.p3}
                label="נמוך"
                value={priorityDistribution.p3}
              />
            </View>
          </View>
        </View>
      </FadeIn>

      {/* Completion Rate */}
      <FadeIn delay={250} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>אחוז השלמה</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressValue}>{completionRate}%</Text>
              <Text style={styles.progressLabel}>
                {tasks.filter((t) => t.status === "complete").length} מתוך{" "}
                {tasks.length} משימות
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${completionRate}%` }]}
              />
            </View>
          </View>
        </View>
      </FadeIn>

      {/* All-Time Stats */}
      <FadeIn delay={300} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>כל הזמנים</Text>
          <View style={styles.allTimeCard}>
            <View style={styles.allTimeStat}>
              <Ionicons name="trophy" size={24} color={colors.accent.warning} />
              <View style={styles.allTimeStatText}>
                <Text style={styles.allTimeValue}>{longestStreak}</Text>
                <Text style={styles.allTimeLabel}>רצף שיא</Text>
              </View>
            </View>
            <View style={styles.allTimeDivider} />
            <View style={styles.allTimeStat}>
              <Ionicons
                name="checkmark-done-circle"
                size={24}
                color={colors.accent.success}
              />
              <View style={styles.allTimeStatText}>
                <Text style={styles.allTimeValue}>{totalTasksCompleted}</Text>
                <Text style={styles.allTimeLabel}>משימות הושלמו</Text>
              </View>
            </View>
            <View style={styles.allTimeDivider} />
            <View style={styles.allTimeStat}>
              <Ionicons name="time" size={24} color={colors.accent.info} />
              <View style={styles.allTimeStatText}>
                <Text style={styles.allTimeValue}>
                  {Math.round(totalFocusMinutes / 60)}
                </Text>
                <Text style={styles.allTimeLabel}>שעות מיקוד</Text>
              </View>
            </View>
          </View>
        </View>
      </FadeIn>

      {/* Quick Tips */}
      <FadeIn delay={350} direction="up">
        <View style={styles.tipsCard}>
          <Ionicons
            name="bulb-outline"
            size={20}
            color={colors.accent.warning}
          />
          <Text style={styles.tipsText}>
            טיפ: השתמש בפומודורו לשמירה על מיקוד וקבלת ציון פרודוקטיביות גבוה
            יותר!
          </Text>
        </View>
      </FadeIn>
    </ScrollView>
  );
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color: string;
  suffix?: string;
}

function StatCard({ icon, value, label, color, suffix = "" }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>
        {value}
        {suffix}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  value: number;
}

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Score Card
  scoreCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  scoreHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  scoreTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  streakBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  streakText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  streakTextActive: {
    color: colors.accent.error,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.bg.tertiary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scoreCircleInner: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
  },
  scoreValue: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: typography.weight.bold,
    fontVariant: ["tabular-nums"],
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    textAlign: "right",
    writingDirection: "rtl",
  },
  scoreMax: {
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  scoreProgress: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.accent.primary,
    borderEndColor: "transparent",
    borderBottomColor: "transparent",
  },
  scoreHint: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Section
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
    writingDirection: "rtl",
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Chart
  chartContainer: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  chart: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    height: 150,
    gap: spacing.sm,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  chartBarWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: radius.sm,
    minHeight: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: spacing.xs,
  },
  chartBarValue: {
    color: colors.text.inverse,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  chartBarLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  chartBarLabelActive: {
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },

  // Distribution
  distributionCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  distributionBar: {
    flexDirection: "row-reverse",
    height: 12,
    borderRadius: radius.full,
    overflow: "hidden",
    backgroundColor: colors.bg.tertiary,
  },
  distributionSegment: {
    height: "100%",
  },
  distributionLegend: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  legendLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  legendValue: {
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Progress
  progressCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  progressHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  progressValue: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  progressLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  progressBar: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },

  // All Time
  allTimeCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  allTimeStat: {
    alignItems: "center",
    gap: spacing.sm,
  },
  allTimeStatText: {
    alignItems: "center",
    gap: spacing.xs,
  },
  allTimeValue: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  allTimeLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  allTimeDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border.subtle,
  },

  // Tips
  tipsCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent.warningGlow,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  tipsText: {
    flex: 1,
    color: colors.accent.warning,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Compact
  compactContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compactStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  compactValue: {
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  compactDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.default,
  },
});
