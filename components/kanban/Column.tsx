import React, { useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { Task, Column as ColumnType } from "../../types";
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

  // Responsive column width - better calculations
  const isLargeDesktop = width >= 1400;
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;
  const isMobile = width < 768;

  // Calculate available width (accounting for sidebar on tablet+)
  const sidebarWidth = isLargeDesktop
    ? 400
    : isDesktop
      ? 350
      : isTablet
        ? 300
        : 0;
  const availableWidth = width - sidebarWidth;
  const columnGap = 16; // spacing.sm * 2
  const totalGaps = columnGap * 4; // gaps between and around columns

  const columnWidth = isMobile
    ? Math.min(width * 0.85, 320) // Mobile: 85% of screen, max 320
    : Math.max((availableWidth - totalGaps) / 3, 240); // Desktop/Tablet: equal thirds, min 240

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
          minWidth: isMobile ? 260 : 240,
          maxWidth: isMobile ? 320 : columnWidth,
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
          accessibilityRole="button"
          accessibilityLabel={`הוסף משימה ל${column.title}`}
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
