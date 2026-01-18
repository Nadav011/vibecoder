import React, { useEffect, useRef } from "react";
import { View, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePomodoroStore, formatTime } from "../../stores/pomodoroStore";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";
import {
  TimerDisplay,
  TimerControls,
  PhaseIndicator,
  CompactTimer,
  pomodoroStyles,
  colors,
} from "./pomodoro";

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
      <CompactTimer
        phase={phase}
        timeRemaining={timeRemaining}
        isRunning={isRunning}
        onPress={handlePlayPause}
      />
    );
  }

  // Full timer view
  return (
    <FadeIn delay={0} direction="up">
      <View style={pomodoroStyles.container}>
        {/* Header */}
        <View style={pomodoroStyles.header}>
          <Text style={pomodoroStyles.title}>פומודורו</Text>
          {onClose && (
            <ScalePress
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              scale={0.9}
              accessibilityRole="button"
              accessibilityLabel="סגור טיימר"
            >
              <Ionicons name="close" size={24} color={colors.text.muted} />
            </ScalePress>
          )}
        </View>

        {/* Phase indicator */}
        <PhaseIndicator phase={phase} />

        {/* Timer display */}
        <TimerDisplay timeRemaining={timeRemaining} />

        {/* Controls */}
        <TimerControls
          phase={phase}
          isRunning={isRunning}
          onPlayPause={handlePlayPause}
          onSkip={handleSkip}
          onReset={handleReset}
        />

        {/* Stats */}
        <View style={pomodoroStyles.stats}>
          <View style={pomodoroStyles.statItem}>
            <Text style={pomodoroStyles.statValue}>{sessionsCompleted}</Text>
            <Text style={pomodoroStyles.statLabel}>סשנים היום</Text>
          </View>
          <View style={pomodoroStyles.statDivider} />
          <View style={pomodoroStyles.statItem}>
            <Text style={pomodoroStyles.statValue}>{todayStats.minutes}</Text>
            <Text style={pomodoroStyles.statLabel}>דקות עבודה</Text>
          </View>
        </View>

        {/* Sessions indicator */}
        <View style={pomodoroStyles.sessionsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                pomodoroStyles.sessionDot,
                i < sessionsCompleted % 4 && pomodoroStyles.sessionDotCompleted,
              ]}
            />
          ))}
        </View>
      </View>
    </FadeIn>
  );
}
