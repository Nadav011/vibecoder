import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
  const { addTask, updateTask, deleteTask, reorderTasks, getTasksByStatus } =
    useKanbanStore();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addToColumn, setAddToColumn] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (columnId: TaskStatus) => {
    setAddToColumn(columnId);
    setAddModalVisible(true);
  };

  const handleCreateTask = (taskData: Partial<Task> & { title: string }) => {
    addTask({ ...taskData, status: addToColumn });
    setAddModalVisible(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleReorder = (status: TaskStatus, reorderedTasks: Task[]) => {
    reorderTasks(status, reorderedTasks);
  };

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
              tasks={getTasksByStatus(column.id)}
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

      {editingTask && (
        <EditTaskModal
          visible={!!editingTask}
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
