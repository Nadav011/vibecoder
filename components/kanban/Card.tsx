import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { Task, PRIORITY_CONFIG } from "../../types";
import { useKanbanStore } from "../../stores";
import { haptics } from "../../utils/haptics";
import { strings } from "../../utils/strings";
import { formatDate } from "../../utils/dateFormat";
import { ConfirmDialog } from "../ui";

interface CardProps {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
  drag?: () => void;
  isActive?: boolean;
}

export function Card({ task, onPress, onDelete, drag, isActive }: CardProps) {
  const { labels } = useKanbanStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const taskLabels = labels.filter((l) => task.labels.includes(l.id));
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleLongPress = () => {
    haptics.medium();
    drag?.();
  };

  const handleDeletePress = useCallback(() => {
    haptics.warning();
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    onDelete();
  }, [onDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const isOverdue = Boolean(
    task.dueDate && task.dueDate < Date.now() && task.status !== "complete",
  );

  const accessibilityLabel = `משימה: ${task.title}. עדיפות ${strings.priorities[task.priority as keyof typeof strings.priorities]}${isOverdue ? ". באיחור" : ""}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={150}
      activeOpacity={0.8}
      style={[styles.container, isActive && styles.active]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="הקש לעריכה, לחץ ארוך לגרירה"
    >
      {/* Priority indicator */}
      <View
        style={[styles.priorityBar, { backgroundColor: priorityConfig.color }]}
      />

      <View style={styles.content}>
        {/* Header: Title + Delete */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <TouchableOpacity
            onPress={handleDeletePress}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="מחק משימה"
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color={colors.text.muted}
            />
          </TouchableOpacity>
        </View>

        {/* Description */}
        {task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Labels */}
        {taskLabels.length > 0 && (
          <View style={styles.labelsRow}>
            {taskLabels.slice(0, 3).map((label) => (
              <View
                key={label.id}
                style={[styles.label, { backgroundColor: label.color + "20" }]}
              >
                <View
                  style={[styles.labelDot, { backgroundColor: label.color }]}
                />
                <Text style={[styles.labelText, { color: label.color }]}>
                  {label.name}
                </Text>
              </View>
            ))}
            {taskLabels.length > 3 && (
              <Text style={styles.moreLabels}>+{taskLabels.length - 3}</Text>
            )}
          </View>
        )}

        {/* Footer: Metadata */}
        <View style={styles.footer}>
          {/* Priority badge */}
          <View style={styles.footerItem}>
            <Ionicons
              name={priorityConfig.icon as keyof typeof Ionicons.glyphMap}
              size={12}
              color={priorityConfig.color}
            />
            <Text style={[styles.footerText, { color: priorityConfig.color }]}>
              {
                strings.priorities[
                  task.priority as keyof typeof strings.priorities
                ]
              }
            </Text>
          </View>

          {/* Subtasks count */}
          {totalSubtasks > 0 && (
            <View style={styles.footerItem}>
              <Ionicons
                name="checkbox-outline"
                size={12}
                color={colors.text.muted}
              />
              <Text style={styles.footerText}>
                {completedSubtasks}/{totalSubtasks}
              </Text>
            </View>
          )}

          {/* Due date */}
          {task.dueDate && (
            <View style={styles.footerItem}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={isOverdue ? "#EF4444" : colors.text.muted}
              />
              <Text
                style={[styles.footerText, isOverdue && { color: "#EF4444" }]}
              >
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}

          {/* AI generated indicator */}
          {task.aiGenerated && (
            <View style={styles.footerItem}>
              <Ionicons
                name="sparkles"
                size={12}
                color={colors.accent.primary}
              />
            </View>
          )}
        </View>
      </View>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={showDeleteConfirm}
        title="מחיקת משימה"
        message={`האם למחוק את "${task.title}"? פעולה זו אינה ניתנת לביטול.`}
        confirmLabel="מחק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
    flexDirection: "row-reverse",
  },
  active: {
    backgroundColor: colors.bg.elevated,
    borderColor: colors.accent.primary,
    ...(Platform.OS === "web"
      ? { boxShadow: `0px 4px 8px ${colors.accent.primary}4D` }
      : {
          shadowColor: colors.accent.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  priorityBar: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    lineHeight: typography.size.md * typography.lineHeight.normal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  deleteButton: {
    padding: spacing.xs,
    marginStart: spacing.sm,
  },
  description: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  labelsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  label: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  labelText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  moreLabels: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    alignSelf: "center",
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  footerItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
});
