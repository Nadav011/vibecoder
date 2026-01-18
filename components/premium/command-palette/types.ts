import { Ionicons } from "@expo/vector-icons";
import { KeyboardShortcut } from "../../../hooks";

export type CommandCategory = "navigation" | "tasks" | "actions" | "settings";

export interface Command {
  id: string;
  name: string;
  nameEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: CommandCategory;
  shortcut?: KeyboardShortcut;
  action: () => void;
}

export interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  commands?: Command[];
}

export interface CommandSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface CommandListProps {
  commands: Command[];
  groupedCommands: Record<string, Command[]>;
  selectedIndex: number;
  onExecuteCommand: (command: Command) => void;
}

export interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  onPress: () => void;
}

export const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: "ניווט",
  tasks: "משימות",
  actions: "פעולות",
  settings: "הגדרות",
};

export const CATEGORY_ORDER: readonly CommandCategory[] = [
  "navigation",
  "tasks",
  "actions",
  "settings",
] as const;

export interface CreateDefaultCommandsActions {
  goToBoard: () => void;
  goToTodos: () => void;
  goToNotes: () => void;
  goToWorkflows: () => void;
  createTask: () => void;
  createTodo: () => void;
  startPomodoro: () => void;
  toggleTheme: () => void;
  openExport: () => void;
  openSettings: () => void;
  openTemplates: () => void;
}
