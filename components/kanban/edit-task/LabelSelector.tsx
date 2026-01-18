import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Label } from "../../../types";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface LabelSelectorProps {
  labels: Label[];
  selectedLabels: string[];
  onToggleLabel: (labelId: string) => void;
  delay?: number;
}

export function LabelSelector({
  labels,
  selectedLabels,
  onToggleLabel,
  delay = 250,
}: LabelSelectorProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>{strings.labels}</Text>
        <View style={styles.labelsGrid}>
          {labels.map((label) => {
            const isActive = selectedLabels.includes(label.id);

            return (
              <ScalePress
                key={label.id}
                onPress={() => onToggleLabel(label.id)}
                style={[
                  styles.labelButton,
                  isActive && { backgroundColor: label.color + "30" },
                ]}
                haptic="none"
              >
                <View
                  style={[styles.labelDot, { backgroundColor: label.color }]}
                />
                <Text
                  style={[styles.labelText, isActive && { color: label.color }]}
                >
                  {label.name}
                </Text>
              </ScalePress>
            );
          })}
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  labelsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  labelButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  labelText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
