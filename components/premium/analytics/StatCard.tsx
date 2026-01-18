import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./analyticsStyles";
import type { StatCardProps } from "./types";

export const StatCard = memo(function StatCard({
  icon,
  value,
  label,
  color,
  suffix = "",
  small = false,
}: StatCardProps) {
  return (
    <View
      style={[styles.statCard, small && styles.statCardSmall]}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}${suffix}`}
    >
      <View
        style={[
          styles.statIcon,
          small && styles.statIconSmall,
          { backgroundColor: color + "20" },
        ]}
      >
        <Ionicons name={icon} size={small ? 16 : 20} color={color} />
      </View>
      <Text style={[styles.statValue, small && styles.statValueSmall]}>
        {value}
        {suffix}
      </Text>
      <Text style={[styles.statLabel, small && styles.statLabelSmall]}>
        {label}
      </Text>
    </View>
  );
});
