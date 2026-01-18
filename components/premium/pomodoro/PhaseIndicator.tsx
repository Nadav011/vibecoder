import React from "react";
import { View, Text } from "react-native";
import {
  PomodoroPhase,
  getPhaseDisplayName,
} from "../../../stores/pomodoroStore";
import { pomodoroStyles } from "./pomodoroStyles";

interface PhaseIndicatorProps {
  phase: PomodoroPhase;
}

/**
 * Displays the current Pomodoro phase (work, short break, long break, or idle)
 * with a colored indicator dot and localized phase name
 */
export function PhaseIndicator({ phase }: PhaseIndicatorProps) {
  const isWork = phase === "work";
  const isBreak = phase === "shortBreak" || phase === "longBreak";

  return (
    <View style={pomodoroStyles.phaseContainer}>
      <View
        style={[
          pomodoroStyles.phaseIndicator,
          isWork && pomodoroStyles.phaseIndicatorWork,
          isBreak && pomodoroStyles.phaseIndicatorBreak,
        ]}
      />
      <Text style={pomodoroStyles.phaseName}>{getPhaseDisplayName(phase)}</Text>
    </View>
  );
}
