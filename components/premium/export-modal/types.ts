import { Ionicons } from "@expo/vector-icons";
import { ExportFormat } from "../../../utils/export";

export interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export interface FormatOption {
  id: ExportFormat;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
}

export interface FormatSelectorProps {
  selectedFormat: ExportFormat;
  onSelectFormat: (format: ExportFormat) => void;
}

export interface DataSelectorProps {
  includeTasks: boolean;
  includeTodos: boolean;
  includeNotes: boolean;
  tasksCount: number;
  todosCount: number;
  notesCount: number;
  onToggleTasks: () => void;
  onToggleTodos: () => void;
  onToggleNotes: () => void;
}

export interface ExportOptionsProps {
  includeCompleted: boolean;
  onToggleCompleted: () => void;
}

export interface ExportStatusMessagesProps {
  isWebOnly: boolean;
  exportSuccess: boolean;
  exportError: string | null;
}

export interface ExportActionsProps {
  onClose: () => void;
  onExport: () => void;
  isExporting: boolean;
  isDisabled: boolean;
  exportSuccess: boolean;
}

export interface ExportContentProps {
  format: ExportFormat;
  includeTasks: boolean;
  includeTodos: boolean;
  includeNotes: boolean;
  includeCompleted: boolean;
  tasksCount: number;
  todosCount: number;
  notesCount: number;
  isExporting: boolean;
  exportSuccess: boolean;
  exportError: string | null;
  isWebOnly: boolean;
  onSelectFormat: (format: ExportFormat) => void;
  onToggleTasks: () => void;
  onToggleTodos: () => void;
  onToggleNotes: () => void;
  onToggleCompleted: () => void;
  onClose: () => void;
  onExport: () => void;
}

export interface UseExportReturn {
  format: ExportFormat;
  setFormat: (format: ExportFormat) => void;
  includeTasks: boolean;
  setIncludeTasks: (value: boolean) => void;
  includeTodos: boolean;
  setIncludeTodos: (value: boolean) => void;
  includeNotes: boolean;
  setIncludeNotes: (value: boolean) => void;
  includeCompleted: boolean;
  setIncludeCompleted: (value: boolean) => void;
  isExporting: boolean;
  exportSuccess: boolean;
  exportError: string | null;
  handleExport: () => Promise<void>;
  isWebOnly: boolean;
  tasksCount: number;
  todosCount: number;
  notesCount: number;
}

export const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: "json",
    label: "JSON",
    icon: "code-slash-outline",
    desc: "גיבוי מלא של הנתונים",
  },
  {
    id: "csv",
    label: "CSV",
    icon: "grid-outline",
    desc: "לייבוא לאקסל/גוגל שיטס",
  },
  {
    id: "markdown",
    label: "Markdown",
    icon: "document-text-outline",
    desc: "קריא ונוח לשיתוף",
  },
];
