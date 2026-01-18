import { StyleSheet, Platform } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";

/**
 * Shared styles for Pomodoro Timer components
 * Uses RTL-compatible properties (start/end instead of left/right)
 */
export const pomodoroStyles = StyleSheet.create({
  // Main container
  container: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },

  // Header
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Phase indicator
  phaseContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  phaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.text.muted,
  },
  phaseIndicatorWork: {
    backgroundColor: colors.accent.primary,
  },
  phaseIndicatorBreak: {
    backgroundColor: colors.accent.success,
  },
  phaseName: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Timer display
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  timerText: {
    color: colors.text.primary,
    fontSize: 56,
    fontWeight: typography.weight.bold,
    fontVariant: ["tabular-nums"],
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    textAlign: "right",
    writingDirection: "rtl",
  },
  progressRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.bg.tertiary,
  },
  progressFill: {
    position: "absolute",
    top: -4,
    start: -4,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.accent.primary,
    borderEndColor: "transparent",
    borderBottomColor: "transparent",
  },

  // Controls
  controls: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.lg,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    backgroundColor: colors.accent.primary,
  },

  // Stats
  stats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    width: "100%",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.subtle,
  },

  // Sessions row
  sessionsRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  sessionDotCompleted: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },

  // Compact styles
  compactContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.full,
  },
  compactIndicator: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.text.muted,
  },
  compactIndicatorWork: {
    backgroundColor: colors.accent.primary,
  },
  compactIndicatorBreak: {
    backgroundColor: colors.accent.success,
  },
  compactTime: {
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontVariant: ["tabular-nums"],
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    textAlign: "right",
    writingDirection: "rtl",
  },
});

// Export colors for use in components
export { colors };
