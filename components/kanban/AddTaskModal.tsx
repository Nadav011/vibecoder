import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { colors, spacing, radius, typography } from "../../theme";
import { Task, TaskPriority, PRIORITY_CONFIG } from "../../types";
import { useKanbanStore } from "../../stores";
import { haptics } from "../../utils/haptics";
import { ScalePress, FadeIn } from "../animated";
import { strings } from "../../utils/strings";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task> & { title: string }) => void;
}

export function AddTaskModal({
  visible,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const { labels } = useKanbanStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("p2");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [aiGenerated, setAiGenerated] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      haptics.success();
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        labels: selectedLabels,
        aiGenerated,
        subtasks: [],
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("p2");
    setSelectedLabels([]);
    setAiGenerated(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleLabel = (labelId: string) => {
    haptics.selection();
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  };

  return (
    <Modal visible={visible} onClose={handleClose} title={strings.newTask}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title */}
          <FadeIn delay={50} direction="up">
            <Input
              label={strings.taskTitle}
              placeholder={strings.taskTitlePlaceholder}
              value={title}
              onChangeText={setTitle}
              autoFocus
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

          {/* Priority */}
          <FadeIn delay={150} direction="up">
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
          <FadeIn delay={200} direction="up">
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
                      {isActive && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={label.color}
                        />
                      )}
                    </ScalePress>
                  );
                })}
              </View>
            </View>
          </FadeIn>

          {/* AI Generated toggle */}
          <FadeIn delay={250} direction="up">
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
                <View>
                  <Text style={styles.aiToggleTitle}>
                    {strings.aiGenerated}
                  </Text>
                  <Text style={styles.aiToggleSubtitle}>
                    {strings.aiGeneratedDesc}
                  </Text>
                </View>
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
          <FadeIn delay={300} direction="up">
            <View style={styles.actions}>
              <Button
                title={strings.cancel}
                variant="secondary"
                onPress={handleClose}
                style={styles.button}
              />
              <Button
                title={strings.createTask}
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
  aiToggleSubtitle: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
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
