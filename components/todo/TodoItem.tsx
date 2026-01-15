import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { Todo } from "../../types";
import { ScalePress } from "../animated";
import { haptics } from "../../utils/haptics";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = () => {
    haptics.success();
    onToggle();
  };

  const handleDelete = () => {
    haptics.warning();
    onDelete();
  };

  return (
    <ScalePress
      onPress={handleToggle}
      style={[styles.container, todo.completed && styles.containerCompleted]}
      scale={0.98}
      haptic="none"
    >
      <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
        {todo.completed && (
          <Ionicons name="checkmark" size={12} color={colors.text.inverse} />
        )}
      </View>

      <Text
        style={[styles.text, todo.completed && styles.textCompleted]}
        numberOfLines={2}
      >
        {todo.text}
      </Text>

      <ScalePress
        onPress={handleDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        scale={0.9}
        haptic="none"
      >
        <Ionicons name="close" size={14} color={colors.text.muted} />
      </ScalePress>
    </ScalePress>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  containerCompleted: {
    opacity: 0.7,
    backgroundColor: colors.bg.secondary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.accent.success,
    borderColor: colors.accent.success,
  },
  text: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  textCompleted: {
    color: colors.text.muted,
    textDecorationLine: "line-through",
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
