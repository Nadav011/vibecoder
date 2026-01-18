import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./analyticsStyles";
import type { LegendItemProps } from "./types";

export const LegendItem = memo(function LegendItem({
  color,
  label,
  value,
}: LegendItemProps) {
  return (
    <View
      style={styles.legendItem}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
});
