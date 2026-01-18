import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Subtask } from "../../../types";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface SubtasksListProps {
  subtasks: Subtask[];
  newSubtask: string;
  onNewSubtaskChange: (text: string) => void;
  onAddSubtask: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  delay?: number;
}

export function SubtasksList({
  subtasks,
  newSubtask,
  onNewSubtaskChange,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  delay = 300,
}: SubtasksListProps) {
  const completedCount = subtasks.filter((s) => s.completed).length;

  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>
          {strings.subtasks} ({completedCount}/{subtasks.length})
        </Text>

        {/* Add subtask input */}
        <View style={styles.addSubtaskRow}>
          <TextInput
            style={styles.subtaskInput}
            placeholder={strings.addSubtask}
            placeholderTextColor={colors.text.muted}
            value={newSubtask}
            onChangeText={onNewSubtaskChange}
            onSubmitEditing={onAddSubtask}
            returnKeyType="done"
            textAlign="right"
          />
          <ScalePress
            onPress={onAddSubtask}
            disabled={!newSubtask.trim()}
            style={[
              styles.addSubtaskButton,
              !newSubtask.trim() && styles.addSubtaskButtonDisabled,
            ]}
            haptic={newSubtask.trim() ? "light" : "none"}
          >
            <Ionicons
              name="add"
              size={18}
              color={
                newSubtask.trim() ? colors.text.inverse : colors.text.muted
              }
            />
          </ScalePress>
        </View>

        {/* Subtasks list */}
        <View style={styles.subtasksList}>
          {subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskItem}>
              <ScalePress
                onPress={() => onToggleSubtask(subtask.id)}
                style={[
                  styles.subtaskCheckbox,
                  subtask.completed && styles.subtaskCheckboxChecked,
                ]}
                scale={0.9}
                haptic="none"
              >
                {subtask.completed && (
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={colors.text.inverse}
                  />
                )}
              </ScalePress>
              <Text
                style={[
                  styles.subtaskText,
                  subtask.completed && styles.subtaskTextCompleted,
                ]}
              >
                {subtask.text}
              </Text>
              <ScalePress
                onPress={() => onDeleteSubtask(subtask.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                scale={0.9}
                haptic="none"
              >
                <Ionicons name="close" size={14} color={colors.text.muted} />
              </ScalePress>
            </View>
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
  addSubtaskRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    writingDirection: "rtl",
  },
  addSubtaskButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  addSubtaskButtonDisabled: {
    backgroundColor: colors.bg.tertiary,
  },
  subtasksList: {
    gap: spacing.sm,
  },
  subtaskItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  subtaskCheckboxChecked: {
    backgroundColor: colors.accent.success,
    borderColor: colors.accent.success,
  },
  subtaskText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  subtaskTextCompleted: {
    color: colors.text.muted,
    textDecorationLine: "line-through",
  },
});
