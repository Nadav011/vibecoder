import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { colors, spacing } from "../../theme";
import { Task, TaskStatus, Column as ColumnType } from "../../types";
import { useKanbanStore } from "../../stores";
import { Column } from "./Column";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { SearchBar } from "./SearchBar";
import { FadeIn } from "../animated";
import { strings } from "../../utils/strings";

// Logical order for RTL: Todo (right) -> In Progress -> Complete (left)
const COLUMNS: ColumnType[] = [
  { id: "todo", title: strings.columns.todo, color: colors.status.todo },
  {
    id: "in_progress",
    title: strings.columns.inProgress,
    color: colors.status.inProgress,
  },
  {
    id: "complete",
    title: strings.columns.complete,
    color: colors.status.complete,
  },
];

export function Board() {
  // Use shallow selector to prevent unnecessary re-renders
  const { addTask, updateTask, deleteTask, reorderTasks, getFilteredTasks } =
    useKanbanStore(
      useShallow((state) => ({
        addTask: state.addTask,
        updateTask: state.updateTask,
        deleteTask: state.deleteTask,
        reorderTasks: state.reorderTasks,
        getFilteredTasks: state.getFilteredTasks,
      })),
    );

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addToColumn, setAddToColumn] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Memoize filtered tasks to prevent recalculation on every render
  const filteredTasks = useMemo(() => getFilteredTasks(), [getFilteredTasks]);

  // Memoize tasks by status
  const tasksByStatus = useMemo(() => {
    const byStatus: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      complete: [],
    };
    for (const task of filteredTasks) {
      byStatus[task.status].push(task);
    }
    return byStatus;
  }, [filteredTasks]);

  const handleAddTask = useCallback((columnId: TaskStatus) => {
    setAddToColumn(columnId);
    setAddModalVisible(true);
  }, []);

  const handleCreateTask = useCallback(
    (taskData: Partial<Task> & { title: string }) => {
      addTask({ ...taskData, status: addToColumn });
      setAddModalVisible(false);
    },
    [addTask, addToColumn],
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateTask(id, updates);
      setEditingTask(null);
    },
    [updateTask],
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
    },
    [deleteTask],
  );

  const handleReorder = useCallback(
    (status: TaskStatus, reorderedTasks: Task[]) => {
      reorderTasks(status, reorderedTasks);
    },
    [reorderTasks],
  );

  return (
    <View style={styles.container}>
      <SearchBar />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COLUMNS.map((column, index) => (
          <FadeIn key={column.id} delay={index * 100} direction="up">
            <Column
              column={column}
              tasks={tasksByStatus[column.id]}
              onAddTask={() => handleAddTask(column.id)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onReorder={(tasks) => handleReorder(column.id, tasks)}
            />
          </FadeIn>
        ))}
      </ScrollView>

      <AddTaskModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleCreateTask}
      />

      {editingTask != null && (
        <EditTaskModal
          visible={editingTask != null}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
});
