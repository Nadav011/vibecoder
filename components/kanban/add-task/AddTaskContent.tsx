import React from "react";
import { View, ScrollView } from "react-native";
import { Task } from "../../../types";
import { useAddTask } from "./useAddTask";
import { FormFields } from "./FormFields";
import { PrioritySelector } from "./PrioritySelector";
import { LabelSelector } from "./LabelSelector";
import { AiToggle } from "./AiToggle";
import { AddTaskActions } from "./AddTaskActions";
import { addTaskStyles as styles } from "./addTaskStyles";

interface AddTaskContentProps {
  onClose: () => void;
  onSubmit: (task: Partial<Task> & { title: string }) => void;
}

export function AddTaskContent({ onClose, onSubmit }: AddTaskContentProps) {
  const {
    title,
    description,
    priority,
    selectedLabels,
    aiGenerated,
    labels,
    setTitle,
    setDescription,
    setPriority,
    toggleLabel,
    setAiGenerated,
    handleSubmit,
    resetForm,
    isValid,
  } = useAddTask({ onSubmit, onClose });

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <FormFields
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <PrioritySelector value={priority} onChange={setPriority} />

        <LabelSelector
          labels={labels}
          selectedLabels={selectedLabels}
          onToggleLabel={toggleLabel}
        />

        <AiToggle value={aiGenerated} onChange={setAiGenerated} />

        <AddTaskActions
          onCancel={resetForm}
          onSubmit={handleSubmit}
          isSubmitDisabled={!isValid}
        />
      </View>
    </ScrollView>
  );
}
