import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface AiGeneratedToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  delay?: number;
}

export function AiGeneratedToggle({
  value,
  onChange,
  delay = 350,
}: AiGeneratedToggleProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <ScalePress
        onPress={() => onChange(!value)}
        style={styles.aiToggle}
        scale={0.99}
        haptic="none"
      >
        <View style={styles.aiToggleContent}>
          <Ionicons
            name="sparkles"
            size={18}
            color={value ? colors.accent.primary : colors.text.muted}
          />
          <Text style={styles.aiToggleTitle}>{strings.aiGenerated}</Text>
        </View>
        <View style={[styles.toggle, value && styles.toggleActive]}>
          <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
        </View>
      </ScalePress>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  aiToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  aiToggleContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  aiToggleTitle: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.bg.elevated,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.accent.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.text.muted,
  },
  toggleKnobActive: {
    backgroundColor: colors.text.primary,
    marginStart: "auto",
  },
});
