import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TaskStatus } from "../../../types";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface StatusOption {
  id: TaskStatus;
  labelKey: keyof typeof strings.columns;
  color: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { id: "todo", labelKey: "todo", color: colors.status.todo },
  {
    id: "in_progress",
    labelKey: "inProgress",
    color: colors.status.inProgress,
  },
  { id: "complete", labelKey: "complete", color: colors.status.complete },
];

interface StatusSelectorProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  delay?: number;
}

export function StatusSelector({
  value,
  onChange,
  delay = 150,
}: StatusSelectorProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>{strings.status}</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((option) => (
            <ScalePress
              key={option.id}
              onPress={() => onChange(option.id)}
              style={[
                styles.statusButton,
                value === option.id && { borderColor: option.color },
              ]}
              haptic="none"
            >
              <View
                style={[styles.statusDot, { backgroundColor: option.color }]}
              />
              <Text
                style={[
                  styles.statusText,
                  value === option.id && { color: colors.text.primary },
                ]}
              >
                {strings.columns[option.labelKey]}
              </Text>
            </ScalePress>
          ))}
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
  statusRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  statusText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
