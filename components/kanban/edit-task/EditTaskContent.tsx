import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Task } from "../../../types";
import { useKanbanStore } from "../../../stores";
import { spacing } from "../../../theme";
import { useEditTask } from "./useEditTask";
import { TaskFormFields } from "./TaskFormFields";
import { StatusSelector } from "./StatusSelector";
import { PrioritySelector } from "./PrioritySelector";
import { LabelSelector } from "./LabelSelector";
import { SubtasksList } from "./SubtasksList";
import { AiGeneratedToggle } from "./AiGeneratedToggle";
import { ActionButtons } from "./ActionButtons";

interface EditTaskContentProps {
  task: Task;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Task>) => void;
}

export function EditTaskContent({
  task,
  onClose,
  onSubmit,
}: EditTaskContentProps) {
  const { labels } = useKanbanStore();

  const {
    title,
    description,
    status,
    priority,
    selectedLabels,
    aiGenerated,
    newSubtask,
    setTitle,
    setDescription,
    setStatus,
    setPriority,
    toggleLabel,
    setAiGenerated,
    setNewSubtask,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleSubmit,
    isValid,
  } = useEditTask(task, onSubmit);

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <TaskFormFields
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <StatusSelector value={status} onChange={setStatus} />

        <PrioritySelector value={priority} onChange={setPriority} />

        <LabelSelector
          labels={labels}
          selectedLabels={selectedLabels}
          onToggleLabel={toggleLabel}
        />

        <SubtasksList
          subtasks={task.subtasks}
          newSubtask={newSubtask}
          onNewSubtaskChange={setNewSubtask}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />

        <AiGeneratedToggle value={aiGenerated} onChange={setAiGenerated} />

        <ActionButtons
          onCancel={onClose}
          onSubmit={handleSubmit}
          isSubmitDisabled={!isValid}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 500,
  },
  content: {
    gap: spacing.lg,
  },
});
