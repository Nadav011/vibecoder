import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PomodoroPhase, formatTime } from "../../../stores/pomodoroStore";
import { ScalePress } from "../../animated";
import { pomodoroStyles, colors } from "./pomodoroStyles";

interface CompactTimerProps {
  phase: PomodoroPhase;
  timeRemaining: number;
  isRunning: boolean;
  onPress: () => void;
}

/**
 * Compact/mini timer view for header or sidebar display
 * Shows phase indicator, time, and play/pause icon
 * Entire component is clickable to toggle timer
 */
export function CompactTimer({
  phase,
  timeRemaining,
  isRunning,
  onPress,
}: CompactTimerProps) {
  const isWork = phase === "work";
  const isBreak = phase === "shortBreak" || phase === "longBreak";

  return (
    <ScalePress
      onPress={onPress}
      style={pomodoroStyles.compactContainer}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`פומודורו ${formatTime(timeRemaining)} - ${isRunning ? "לחץ להשהיה" : "לחץ להתחלה"}`}
    >
      <View
        style={[
          pomodoroStyles.compactIndicator,
          isWork && pomodoroStyles.compactIndicatorWork,
          isBreak && pomodoroStyles.compactIndicatorBreak,
        ]}
      />
      <Text style={pomodoroStyles.compactTime}>
        {formatTime(timeRemaining)}
      </Text>
      <Ionicons
        name={isRunning ? "pause" : "play"}
        size={14}
        color={colors.text.secondary}
      />
    </ScalePress>
  );
}
