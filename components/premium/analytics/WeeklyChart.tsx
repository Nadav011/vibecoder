import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";
import type { WeeklyDataPoint } from "./types";

interface WeeklyChartProps {
  weeklyData: WeeklyDataPoint[];
}

export function WeeklyChart({ weeklyData }: WeeklyChartProps) {
  const maxValue = Math.max(...weeklyData.map((d) => d.completed), 1);

  return (
    <FadeIn delay={150} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>השבוע</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {weeklyData.map((day, index) => {
              const height = (day.completed / maxValue) * 100;
              const isToday = index === weeklyData.length - 1;

              return (
                <View key={day.day} style={styles.chartBar}>
                  <View style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height: `${Math.max(height, 5)}%`,
                          backgroundColor: isToday
                            ? colors.accent.primary
                            : colors.bg.tertiary,
                        },
                      ]}
                    >
                      {day.completed > 0 && (
                        <Text style={styles.chartBarValue}>
                          {day.completed}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.chartBarLabel,
                      isToday && styles.chartBarLabelActive,
                    ]}
                  >
                    {day.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </FadeIn>
  );
}
