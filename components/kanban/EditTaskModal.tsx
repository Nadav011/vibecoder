import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { colors, spacing, radius, typography } from "../../theme";
import { Task, TaskStatus, TaskPriority, PRIORITY_CONFIG } from "../../types";
import { useKanbanStore } from "../../stores";
import { haptics } from "../../utils/haptics";
import { ScalePress, FadeIn } from "../animated";
import { strings } from "../../utils/strings";

interface EditTaskModalProps {
  visible: boolean;
  task: Task;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Task>) => void;
}

const STATUS_OPTIONS: {
  id: TaskStatus;
  labelKey: keyof typeof strings.columns;
  color: string;
}[] = [
  { id: "todo", labelKey: "todo", color: colors.status.todo },
  {
    id: "in_progress",
    labelKey: "inProgress",
    color: colors.status.inProgress,
  },
  { id: "complete", labelKey: "complete", color: colors.status.complete },
];

export function EditTaskModal({
  visible,
  task,
  onClose,
  onSubmit,
}: EditTaskModalProps) {
  const { labels, addSubtask, toggleSubtask, deleteSubtask } = useKanbanStore();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task.labels);
  const [aiGenerated, setAiGenerated] = useState(task.aiGenerated || false);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setSelectedLabels(task.labels);
    setAiGenerated(task.aiGenerated || false);
  }, [task]);

  const handleSubmit = () => {
    if (title.trim()) {
      haptics.success();
      onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        labels: selectedLabels,
        aiGenerated,
      });
    }
  };

  const toggleLabel = (labelId: string) => {
    haptics.selection();
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      haptics.light();
      addSubtask(task.id, newSubtask.trim());
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    haptics.light();
    toggleSubtask(task.id, subtaskId);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    haptics.warning();
    deleteSubtask(task.id, subtaskId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title={strings.editTask}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <FadeIn delay={50} direction="up">
            <Input
              label={strings.taskTitle}
              placeholder={strings.taskTitlePlaceholder}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
            />
          </FadeIn>

          {/* Description */}
          <FadeIn delay={100} direction="up">
            <Input
              label={strings.taskDescription}
              placeholder={strings.taskDescriptionPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={styles.textarea}
              textAlign="right"
            />
          </FadeIn>

          {/* Status */}
          <FadeIn delay={150} direction="up">
            <View style={styles.section}>
              <Text style={styles.label}>{strings.status}</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map((option) => (
                  <ScalePress
                    key={option.id}
                    onPress={() => {
                      haptics.selection();
                      setStatus(option.id);
                    }}
                    style={[
                      styles.statusButton,
                      status === option.id && { borderColor: option.color },
                    ]}
                    haptic="none"
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: option.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        status === option.id && { color: colors.text.primary },
                      ]}
                    >
                      {strings.columns[option.labelKey]}
                    </Text>
                  </ScalePress>
                ))}
              </View>
            </View>
          </FadeIn>

          {/* Priority */}
          <FadeIn delay={200} direction="up">
            <View style={styles.section}>
              <Text style={styles.label}>{strings.priority}</Text>
              <View style={styles.priorityRow}>
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => {
                  const config = PRIORITY_CONFIG[p];
                  const isActive = priority === p;

                  return (
                    <ScalePress
                      key={p}
                      onPress={() => {
                        haptics.selection();
                        setPriority(p);
                      }}
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
                        {
                          strings.priorities[
                            p as keyof typeof strings.priorities
                          ]
                        }
                      </Text>
                    </ScalePress>
                  );
                })}
              </View>
            </View>
          </FadeIn>

          {/* Labels */}
          <FadeIn delay={250} direction="up">
            <View style={styles.section}>
              <Text style={styles.label}>{strings.labels}</Text>
              <View style={styles.labelsGrid}>
                {labels.map((label) => {
                  const isActive = selectedLabels.includes(label.id);

                  return (
                    <ScalePress
                      key={label.id}
                      onPress={() => toggleLabel(label.id)}
                      style={[
                        styles.labelButton,
                        isActive && { backgroundColor: label.color + "30" },
                      ]}
                      haptic="none"
                    >
                      <View
                        style={[
                          styles.labelDot,
                          { backgroundColor: label.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.labelText,
                          isActive && { color: label.color },
                        ]}
                      >
                        {label.name}
                      </Text>
                    </ScalePress>
                  );
                })}
              </View>
            </View>
          </FadeIn>

          {/* Subtasks */}
          <FadeIn delay={300} direction="up">
            <View style={styles.section}>
              <Text style={styles.label}>
                {strings.subtasks} (
                {task.subtasks.filter((s) => s.completed).length}/
                {task.subtasks.length})
              </Text>

              {/* Add subtask input */}
              <View style={styles.addSubtaskRow}>
                <TextInput
                  style={styles.subtaskInput}
                  placeholder={strings.addSubtask}
                  placeholderTextColor={colors.text.muted}
                  value={newSubtask}
                  onChangeText={setNewSubtask}
                  onSubmitEditing={handleAddSubtask}
                  returnKeyType="done"
                  textAlign="right"
                />
                <ScalePress
                  onPress={handleAddSubtask}
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
                      newSubtask.trim()
                        ? colors.text.inverse
                        : colors.text.muted
                    }
                  />
                </ScalePress>
              </View>

              {/* Subtasks list */}
              <View style={styles.subtasksList}>
                {task.subtasks.map((subtask) => (
                  <View key={subtask.id} style={styles.subtaskItem}>
                    <ScalePress
                      onPress={() => handleToggleSubtask(subtask.id)}
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
                      onPress={() => handleDeleteSubtask(subtask.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      scale={0.9}
                      haptic="none"
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={colors.text.muted}
                      />
                    </ScalePress>
                  </View>
                ))}
              </View>
            </View>
          </FadeIn>

          {/* AI Generated toggle */}
          <FadeIn delay={350} direction="up">
            <ScalePress
              onPress={() => {
                haptics.selection();
                setAiGenerated(!aiGenerated);
              }}
              style={styles.aiToggle}
              scale={0.99}
              haptic="none"
            >
              <View style={styles.aiToggleContent}>
                <Ionicons
                  name="sparkles"
                  size={18}
                  color={
                    aiGenerated ? colors.accent.primary : colors.text.muted
                  }
                />
                <Text style={styles.aiToggleTitle}>{strings.aiGenerated}</Text>
              </View>
              <View style={[styles.toggle, aiGenerated && styles.toggleActive]}>
                <View
                  style={[
                    styles.toggleKnob,
                    aiGenerated && styles.toggleKnobActive,
                  ]}
                />
              </View>
            </ScalePress>
          </FadeIn>

          {/* Actions */}
          <FadeIn delay={400} direction="up">
            <View style={styles.actions}>
              <Button
                title={strings.cancel}
                variant="secondary"
                onPress={onClose}
                style={styles.button}
              />
              <Button
                title={strings.saveChanges}
                onPress={handleSubmit}
                disabled={!title.trim()}
                style={styles.button}
              />
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 500,
  },
  content: {
    gap: spacing.lg,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
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
  labelsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  labelButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  labelText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
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
  aiToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  aiToggleContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  aiToggleTitle: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.bg.elevated,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.accent.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.text.muted,
  },
  toggleKnobActive: {
    backgroundColor: colors.text.primary,
    marginStart: "auto",
  },
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
