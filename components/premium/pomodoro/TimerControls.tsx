import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PomodoroPhase } from "../../../stores/pomodoroStore";
import { ScalePress } from "../../animated";
import { pomodoroStyles, colors } from "./pomodoroStyles";

interface TimerControlsProps {
  phase: PomodoroPhase;
  isRunning: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
  onReset: () => void;
}

/**
 * Control buttons for the Pomodoro timer
 * Includes reset, play/pause, and skip controls with haptic feedback
 */
export function TimerControls({
  phase,
  isRunning,
  onPlayPause,
  onSkip,
  onReset,
}: TimerControlsProps) {
  const isIdle = phase === "idle";
  const playIcon = isIdle ? "play" : isRunning ? "pause" : "play";
  const playLabel = isIdle ? "התחל" : isRunning ? "השהה" : "המשך";

  return (
    <View style={pomodoroStyles.controls}>
      {/* Reset button */}
      <ScalePress
        onPress={onReset}
        style={pomodoroStyles.controlButton}
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel="אפס טיימר"
      >
        <Ionicons
          name="refresh-outline"
          size={24}
          color={colors.text.secondary}
        />
      </ScalePress>

      {/* Play/Pause button */}
      <ScalePress
        onPress={onPlayPause}
        style={[pomodoroStyles.controlButton, pomodoroStyles.playButton]}
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel={playLabel}
      >
        <Ionicons name={playIcon} size={32} color={colors.text.inverse} />
      </ScalePress>

      {/* Skip button */}
      <ScalePress
        onPress={onSkip}
        style={pomodoroStyles.controlButton}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel="דלג לשלב הבא"
      >
        <Ionicons
          name="play-skip-forward-outline"
          size={24}
          color={colors.text.secondary}
        />
      </ScalePress>
    </View>
  );
}
