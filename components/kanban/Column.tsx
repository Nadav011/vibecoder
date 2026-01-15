import React, { useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { Task, TaskStatus, Column as ColumnType } from "../../types";
import { Card } from "./Card";
import { ScalePress, EmptyTasks } from "../animated";
import { haptics } from "../../utils/haptics";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onReorder: (tasks: Task[]) => void;
}

export function Column({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onReorder,
}: ColumnProps) {
  const { width } = useWindowDimensions();

  // Responsive column width
  const isDesktop = width >= 1200;
  const isTablet = width >= 768;
  const columnWidth = isDesktop
    ? (width - 400) / 3 - 24 // Desktop: 3 columns, minus sidebar
    : isTablet
      ? (width - 350) / 3 - 16 // Tablet: 3 columns, smaller sidebar
      : 280; // Mobile: fixed width for horizontal scroll

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Task>) => (
      <ScaleDecorator>
        <Card
          task={item}
          onPress={() => onEditTask(item)}
          onDelete={() => onDeleteTask(item.id)}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    ),
    [onEditTask, onDeleteTask],
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <View
      style={[
        styles.container,
        {
          width: columnWidth,
          minWidth: isTablet ? columnWidth : 280,
          maxWidth: isTablet ? columnWidth : 320,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.indicator, { backgroundColor: column.color }]} />
          <Text style={styles.title}>{column.title}</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>{tasks.length}</Text>
          </View>
        </View>
        <ScalePress
          onPress={() => {
            haptics.light();
            onAddTask();
          }}
          style={styles.addButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={20} color={colors.text.secondary} />
        </ScalePress>
      </View>

      <DraggableFlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onDragEnd={({ data }) => onReorder(data)}
        containerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {tasks.length === 0 && (
        <View style={styles.emptyState}>
          <EmptyTasks onAdd={onAddTask} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.sm,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  count: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  countText: {
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    writingDirection: "rtl",
  },
  addButton: {
    padding: spacing.xs,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.sm,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
