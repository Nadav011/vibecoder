import React from "react";
import { View, Text } from "react-native";
import { formatTime } from "../../../stores/pomodoroStore";
import { pomodoroStyles } from "./pomodoroStyles";

interface TimerDisplayProps {
  timeRemaining: number;
  /** Total duration for calculating progress (in seconds) */
  totalDuration?: number;
}

/**
 * Circular timer display showing time remaining with a progress ring
 * The progress ring rotates based on the elapsed time
 */
export function TimerDisplay({
  timeRemaining,
  totalDuration = 25 * 60,
}: TimerDisplayProps) {
  // Calculate rotation for progress fill (0-360 degrees)
  const progress = 1 - timeRemaining / totalDuration;
  const rotation = progress * 360;

  return (
    <View style={pomodoroStyles.timerContainer}>
      <Text style={pomodoroStyles.timerText}>{formatTime(timeRemaining)}</Text>

      {/* Progress ring */}
      <View style={pomodoroStyles.progressRing}>
        <View
          style={[
            pomodoroStyles.progressFill,
            {
              transform: [{ rotate: `${rotation}deg` }],
            },
          ]}
        />
      </View>
    </View>
  );
}
