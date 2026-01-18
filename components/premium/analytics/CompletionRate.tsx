import React from "react";
import { View, Text } from "react-native";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";

interface CompletionRateProps {
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
}

export function CompletionRate({
  completionRate,
  completedTasks,
  totalTasks,
}: CompletionRateProps) {
  return (
    <FadeIn delay={250} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>אחוז השלמה</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressValue}>{completionRate}%</Text>
            <Text style={styles.progressLabel}>
              {completedTasks} מתוך {totalTasks} משימות
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${completionRate}%` }]}
            />
          </View>
        </View>
      </View>
    </FadeIn>
  );
}
