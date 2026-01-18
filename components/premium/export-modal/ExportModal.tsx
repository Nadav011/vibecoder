import React from "react";
import { Modal } from "../../ui/Modal";
import { ExportContent } from "./ExportContent";
import { useExport } from "./useExport";
import { ExportModalProps } from "./types";

export function ExportModal({ visible, onClose }: ExportModalProps) {
  const {
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
    tasksCount,
    todosCount,
    notesCount,
  } = useExport(onClose);

  return (
    <Modal visible={visible} onClose={onClose} title="ייצוא נתונים">
      <ExportContent
        format={format}
        includeTasks={includeTasks}
        includeTodos={includeTodos}
        includeNotes={includeNotes}
        includeCompleted={includeCompleted}
        tasksCount={tasksCount}
        todosCount={todosCount}
        notesCount={notesCount}
        isExporting={isExporting}
        exportSuccess={exportSuccess}
        exportError={exportError}
        isWebOnly={isWebOnly}
        onSelectFormat={setFormat}
        onToggleTasks={() => setIncludeTasks(!includeTasks)}
        onToggleTodos={() => setIncludeTodos(!includeTodos)}
        onToggleNotes={() => setIncludeNotes(!includeNotes)}
        onToggleCompleted={() => setIncludeCompleted(!includeCompleted)}
        onClose={onClose}
        onExport={handleExport}
      />
    </Modal>
  );
}
