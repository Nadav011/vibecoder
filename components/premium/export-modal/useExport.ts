import { useState } from "react";
import { Platform } from "react-native";
import { useKanbanStore, useTodoStore, useNotesStore } from "../../../stores";
import {
  performExport,
  ExportFormat,
  ExportOptions,
} from "../../../utils/export";
import { haptics } from "../../../utils/haptics";
import { UseExportReturn } from "./types";

export function useExport(onClose: () => void): UseExportReturn {
  const { tasks } = useKanbanStore();
  const { todos } = useTodoStore();
  const { notes } = useNotesStore();

  const [format, setFormat] = useState<ExportFormat>("json");
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeTodos, setIncludeTodos] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const isWebOnly = Platform.OS !== "web";

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    const options: ExportOptions = {
      format,
      includeTasks,
      includeTodos,
      includeNotes,
      includeCompleted,
    };

    const result = await performExport(tasks, todos, notes, options);

    if (result.success) {
      haptics.success();
      setExportSuccess(true);

      // Auto close after success
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    } else {
      haptics.warning();
      setExportError(result.error || "Export failed");
    }

    setIsExporting(false);
  };

  return {
    format,
    setFormat,
    includeTasks,
    setIncludeTasks,
    includeTodos,
    setIncludeTodos,
    includeNotes,
    setIncludeNotes,
    includeCompleted,
    setIncludeCompleted,
    isExporting,
    exportSuccess,
    exportError,
    handleExport,
    isWebOnly,
    tasksCount: tasks.length,
    todosCount: todos.length,
    notesCount: notes.length,
  };
}
