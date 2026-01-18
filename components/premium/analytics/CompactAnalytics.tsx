import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { styles } from "./analyticsStyles";

interface CompactAnalyticsProps {
  currentStreak: number;
  tasksCompletedToday: number;
}

export function CompactAnalytics({
  currentStreak,
  tasksCompletedToday,
}: CompactAnalyticsProps) {
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
        <Text style={styles.compactValue}>{tasksCompletedToday}</Text>
      </View>
    </View>
  );
}
