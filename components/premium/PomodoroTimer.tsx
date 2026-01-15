import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import {
  usePomodoroStore,
  formatTime,
  getPhaseDisplayName,
} from "../../stores/pomodoroStore";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";

interface PomodoroTimerProps {
  compact?: boolean;
  onClose?: () => void;
}

export function PomodoroTimer({
  compact = false,
  onClose,
}: PomodoroTimerProps) {
  const {
    phase,
    timeRemaining,
    isRunning,
    sessionsCompleted,
    start,
    pause,
    resume,
    skip,
    reset,
    tick,
    getTodayStats,
  } = usePomodoroStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // Update document title on web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      if (isRunning) {
        document.title = `${formatTime(timeRemaining)} - VibeCoder`;
      } else {
        document.title = "VibeCoder";
      }
    }
  }, [timeRemaining, isRunning]);

  const todayStats = getTodayStats();

  const handlePlayPause = () => {
    haptics.light();
    if (phase === "idle") {
      start();
    } else if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  const handleSkip = () => {
    haptics.medium();
    skip();
  };

  const handleReset = () => {
    haptics.medium();
    reset();
  };

  // Compact version for header/sidebar
  if (compact) {
    return (
      <ScalePress
        onPress={handlePlayPause}
        style={styles.compactContainer}
        haptic="light"
      >
        <View
          style={[
            styles.compactIndicator,
            phase === "work" && styles.compactIndicatorWork,
            (phase === "shortBreak" || phase === "longBreak") &&
              styles.compactIndicatorBreak,
          ]}
        />
        <Text style={styles.compactTime}>{formatTime(timeRemaining)}</Text>
        <Ionicons
          name={isRunning ? "pause" : "play"}
          size={14}
          color={colors.text.secondary}
        />
      </ScalePress>
    );
  }

  // Full timer view
  return (
    <FadeIn delay={0} direction="up">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>פומודורו</Text>
          {onClose && (
            <ScalePress
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              scale={0.9}
            >
              <Ionicons name="close" size={24} color={colors.text.muted} />
            </ScalePress>
          )}
        </View>

        {/* Phase indicator */}
        <View style={styles.phaseContainer}>
          <View
            style={[
              styles.phaseIndicator,
              phase === "work" && styles.phaseIndicatorWork,
              (phase === "shortBreak" || phase === "longBreak") &&
                styles.phaseIndicatorBreak,
            ]}
          />
          <Text style={styles.phaseName}>{getPhaseDisplayName(phase)}</Text>
        </View>

        {/* Timer display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>

          {/* Progress ring */}
          <View style={styles.progressRing}>
            <View
              style={[
                styles.progressFill,
                {
                  transform: [
                    {
                      rotate: `${(1 - timeRemaining / (25 * 60)) * 360}deg`,
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <ScalePress
            onPress={handleReset}
            style={styles.controlButton}
            haptic="medium"
          >
            <Ionicons
              name="refresh-outline"
              size={24}
              color={colors.text.secondary}
            />
          </ScalePress>

          <ScalePress
            onPress={handlePlayPause}
            style={[styles.controlButton, styles.playButton]}
            haptic="medium"
          >
            <Ionicons
              name={phase === "idle" ? "play" : isRunning ? "pause" : "play"}
              size={32}
              color={colors.text.inverse}
            />
          </ScalePress>

          <ScalePress
            onPress={handleSkip}
            style={styles.controlButton}
            haptic="light"
          >
            <Ionicons
              name="play-skip-forward-outline"
              size={24}
              color={colors.text.secondary}
            />
          </ScalePress>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessionsCompleted}</Text>
            <Text style={styles.statLabel}>סשנים היום</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.minutes}</Text>
            <Text style={styles.statLabel}>דקות עבודה</Text>
          </View>
        </View>

        {/* Sessions indicator */}
        <View style={styles.sessionsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.sessionDot,
                i < sessionsCompleted % 4 && styles.sessionDotCompleted,
              ]}
            />
          ))}
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
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
