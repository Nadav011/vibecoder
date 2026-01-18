import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../../theme";
import { ScalePress } from "../../animated";

interface WorkflowsHeaderProps {
  onBack: () => void;
  commandCount: number;
}

export function WorkflowsHeader({
  onBack,
  commandCount,
}: WorkflowsHeaderProps) {
  return (
    <View style={styles.header}>
      <ScalePress
        onPress={onBack}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        haptic="light"
      >
        <Ionicons name="arrow-forward" size={24} color={colors.text.primary} />
      </ScalePress>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>מרכז הפיקוד</Text>
        <Text style={styles.subtitle}>
          v17.3.0 OMEGA • {commandCount} פקודות
        </Text>
      </View>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  placeholder: {
    width: 40,
  },
});
