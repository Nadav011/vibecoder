import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { useTodoStore } from "../../stores";
import { TodoItem } from "./TodoItem";
import { Todo } from "../../types";
import { FadeIn, ScalePress, EmptyTodos } from "../animated";
import { haptics } from "../../utils/haptics";
import { strings } from "../../utils/strings";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } =
    useTodoStore();
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      haptics.success();
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggle={() => toggleTodo(item.id)}
      onDelete={() => deleteTodo(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.quickTasks}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>
            {pendingCount} {strings.pending}
          </Text>
        </View>
      </View>

      <FadeIn delay={100} direction="up">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={strings.addQuickTask}
            placeholderTextColor={colors.text.muted}
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={handleAddTodo}
            returnKeyType="done"
            textAlign="right"
          />
          <ScalePress
            onPress={handleAddTodo}
            style={[
              styles.addButton,
              !newTodo.trim() && styles.addButtonDisabled,
            ]}
            disabled={!newTodo.trim()}
            haptic={newTodo.trim() ? "light" : "none"}
          >
            <Ionicons
              name="add"
              size={20}
              color={newTodo.trim() ? colors.text.inverse : colors.text.muted}
            />
          </ScalePress>
        </View>
      </FadeIn>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={<EmptyTodos />}
      />

      {completedCount > 0 && (
        <FadeIn delay={200} direction="up">
          <ScalePress
            onPress={() => {
              haptics.light();
              clearCompleted();
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>
              {strings.clearCompleted.replace(
                "{count}",
                String(completedCount),
              )}
            </Text>
          </ScalePress>
        </FadeIn>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  stats: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  stat: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  addButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: colors.bg.tertiary,
  },
  list: {
    flex: 1,
  },
  clearButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  clearText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
  },
});
