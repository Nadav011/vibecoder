import { useState, useCallback } from "react";
import { Task, TaskPriority, Label } from "../../../types";
import { useKanbanStore } from "../../../stores";
import { haptics } from "../../../utils/haptics";
import {
  sanitizeTaskTitle,
  sanitizeTaskDescription,
} from "../../../utils/sanitize";

// Validation constants
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export interface AddTaskState {
  title: string;
  description: string;
  priority: TaskPriority;
  selectedLabels: string[];
  aiGenerated: boolean;
}

export interface AddTaskActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPriority: (priority: TaskPriority) => void;
  toggleLabel: (labelId: string) => void;
  setAiGenerated: (value: boolean) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  isValid: boolean;
}

export interface UseAddTaskProps {
  onSubmit: (task: Partial<Task> & { title: string }) => void;
  onClose: () => void;
}

export function useAddTask({
  onSubmit,
  onClose,
}: UseAddTaskProps): AddTaskState & AddTaskActions & { labels: Label[] } {
  const { labels } = useKanbanStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("p2");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [aiGenerated, setAiGenerated] = useState(false);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority("p2");
    setSelectedLabels([]);
    setAiGenerated(false);
  }, []);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text.slice(0, MAX_TITLE_LENGTH));
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text.slice(0, MAX_DESCRIPTION_LENGTH));
  }, []);

  const handlePriorityChange = useCallback((newPriority: TaskPriority) => {
    haptics.selection();
    setPriority(newPriority);
  }, []);

  const toggleLabel = useCallback((labelId: string) => {
    haptics.selection();
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  }, []);

  const handleAiGeneratedChange = useCallback((value: boolean) => {
    haptics.selection();
    setAiGenerated(value);
  }, []);

  const handleSubmit = useCallback(() => {
    const sanitizedTitle = sanitizeTaskTitle(title, MAX_TITLE_LENGTH);
    if (sanitizedTitle) {
      haptics.success();
      onSubmit({
        title: sanitizedTitle,
        description:
          sanitizeTaskDescription(description, MAX_DESCRIPTION_LENGTH) ||
          undefined,
        priority,
        labels: selectedLabels,
        aiGenerated,
        subtasks: [],
      });
      resetForm();
    }
  }, [
    title,
    description,
    priority,
    selectedLabels,
    aiGenerated,
    onSubmit,
    resetForm,
  ]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  return {
    // State
    title,
    description,
    priority,
    selectedLabels,
    aiGenerated,
    labels,
    // Actions
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setPriority: handlePriorityChange,
    toggleLabel,
    setAiGenerated: handleAiGeneratedChange,
    handleSubmit,
    resetForm: handleClose,
    isValid: Boolean(title.trim()),
  };
}
