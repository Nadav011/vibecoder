import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskPriority, PRIORITY_CONFIG } from "../../../types";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  delay?: number;
}

export function PrioritySelector({
  value,
  onChange,
  delay = 200,
}: PrioritySelectorProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>{strings.priority}</Text>
        <View style={styles.priorityRow}>
          {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => {
            const config = PRIORITY_CONFIG[p];
            const isActive = value === p;

            return (
              <ScalePress
                key={p}
                onPress={() => onChange(p)}
                style={[
                  styles.priorityButton,
                  isActive && { backgroundColor: config.color + "30" },
                ]}
                haptic="none"
              >
                <Ionicons
                  name={config.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={isActive ? config.color : colors.text.muted}
                />
                <Text
                  style={[
                    styles.priorityText,
                    isActive && { color: config.color },
                  ]}
                >
                  {strings.priorities[p as keyof typeof strings.priorities]}
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
  priorityRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  priorityText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
