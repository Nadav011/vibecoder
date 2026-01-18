import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, TaskPriority } from "../../../types";
import { useKanbanStore } from "../../../stores";
import { haptics } from "../../../utils/haptics";

export interface EditTaskState {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  selectedLabels: string[];
  aiGenerated: boolean;
  newSubtask: string;
}

export interface EditTaskActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStatus: (status: TaskStatus) => void;
  setPriority: (priority: TaskPriority) => void;
  toggleLabel: (labelId: string) => void;
  setAiGenerated: (value: boolean) => void;
  setNewSubtask: (text: string) => void;
  handleAddSubtask: () => void;
  handleToggleSubtask: (subtaskId: string) => void;
  handleDeleteSubtask: (subtaskId: string) => void;
  handleSubmit: () => void;
  isValid: boolean;
}

export function useEditTask(
  task: Task,
  onSubmit: (id: string, updates: Partial<Task>) => void,
): EditTaskState & EditTaskActions {
  const { addSubtask, toggleSubtask, deleteSubtask } = useKanbanStore();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task.labels);
  const [aiGenerated, setAiGenerated] = useState(task.aiGenerated || false);
  const [newSubtask, setNewSubtask] = useState("");

  // Sync state when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setSelectedLabels(task.labels);
    setAiGenerated(task.aiGenerated || false);
  }, [task]);

  const toggleLabel = useCallback((labelId: string) => {
    haptics.selection();
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    );
  }, []);

  const handleAddSubtask = useCallback(() => {
    if (newSubtask.trim()) {
      haptics.light();
      addSubtask(task.id, newSubtask.trim());
      setNewSubtask("");
    }
  }, [task.id, newSubtask, addSubtask]);

  const handleToggleSubtask = useCallback(
    (subtaskId: string) => {
      haptics.light();
      toggleSubtask(task.id, subtaskId);
    },
    [task.id, toggleSubtask],
  );

  const handleDeleteSubtask = useCallback(
    (subtaskId: string) => {
      haptics.warning();
      deleteSubtask(task.id, subtaskId);
    },
    [task.id, deleteSubtask],
  );

  const handleSubmit = useCallback(() => {
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
  }, [
    task.id,
    title,
    description,
    status,
    priority,
    selectedLabels,
    aiGenerated,
    onSubmit,
  ]);

  const handleSetStatus = useCallback((newStatus: TaskStatus) => {
    haptics.selection();
    setStatus(newStatus);
  }, []);

  const handleSetPriority = useCallback((newPriority: TaskPriority) => {
    haptics.selection();
    setPriority(newPriority);
  }, []);

  const handleSetAiGenerated = useCallback((value: boolean) => {
    haptics.selection();
    setAiGenerated(value);
  }, []);

  return {
    // State
    title,
    description,
    status,
    priority,
    selectedLabels,
    aiGenerated,
    newSubtask,
    // Actions
    setTitle,
    setDescription,
    setStatus: handleSetStatus,
    setPriority: handleSetPriority,
    toggleLabel,
    setAiGenerated: handleSetAiGenerated,
    setNewSubtask,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleSubmit,
    isValid: Boolean(title.trim()),
  };
}
