import { StyleSheet, Platform } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";

export const styles = StyleSheet.create({
  // Container
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

  // Stats Grid
  statsGrid: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  statsGridSmall: {
    gap: spacing.xs,
  },
  statCard: {
    flex: 1,
    minWidth: 70,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statCardSmall: {
    minWidth: 60,
    padding: spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconSmall: {
    width: 32,
    height: 32,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
    writingDirection: "rtl",
  },
  statValueSmall: {
    fontSize: typography.size.lg,
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statLabelSmall: {
    fontSize: 10,
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
