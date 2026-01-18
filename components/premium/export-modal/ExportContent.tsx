import React from "react";
import { View } from "react-native";
import { styles } from "./exportStyles";
import { FormatSelector } from "./FormatSelector";
import { DataSelector } from "./DataSelector";
import { ExportOptions } from "./ExportOptions";
import { ExportStatusMessages } from "./ExportStatusMessages";
import { ExportActions } from "./ExportActions";
import { ExportContentProps } from "./types";

export function ExportContent({
  format,
  includeTasks,
  includeTodos,
  includeNotes,
  includeCompleted,
  tasksCount,
  todosCount,
  notesCount,
  isExporting,
  exportSuccess,
  exportError,
  isWebOnly,
  onSelectFormat,
  onToggleTasks,
  onToggleTodos,
  onToggleNotes,
  onToggleCompleted,
  onClose,
  onExport,
}: ExportContentProps) {
  const isDisabled =
    (!includeTasks && !includeTodos && !includeNotes) || isWebOnly;

  return (
    <View style={styles.content}>
      <FormatSelector selectedFormat={format} onSelectFormat={onSelectFormat} />

      <DataSelector
        includeTasks={includeTasks}
        includeTodos={includeTodos}
        includeNotes={includeNotes}
        tasksCount={tasksCount}
        todosCount={todosCount}
        notesCount={notesCount}
        onToggleTasks={onToggleTasks}
        onToggleTodos={onToggleTodos}
        onToggleNotes={onToggleNotes}
      />

      <ExportOptions
        includeCompleted={includeCompleted}
        onToggleCompleted={onToggleCompleted}
      />

      <ExportStatusMessages
        isWebOnly={isWebOnly}
        exportSuccess={exportSuccess}
        exportError={exportError}
      />

      <ExportActions
        onClose={onClose}
        onExport={onExport}
        isExporting={isExporting}
        isDisabled={isDisabled}
        exportSuccess={exportSuccess}
      />
    </View>
  );
}
