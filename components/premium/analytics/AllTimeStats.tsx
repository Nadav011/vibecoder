import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";

interface AllTimeStatsProps {
  longestStreak: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
}

export function AllTimeStats({
  longestStreak,
  totalTasksCompleted,
  totalFocusMinutes,
}: AllTimeStatsProps) {
  return (
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
  );
}
