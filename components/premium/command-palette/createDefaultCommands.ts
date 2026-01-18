import { Command, CreateDefaultCommandsActions } from "./types";

export function createDefaultCommands(
  actions: CreateDefaultCommandsActions,
): Command[] {
  return [
    // Navigation
    {
      id: "go-board",
      name: "עבור ללוח",
      nameEn: "Go to Board",
      icon: "grid-outline",
      category: "navigation",
      action: actions.goToBoard,
    },
    {
      id: "go-todos",
      name: "עבור למשימות מהירות",
      nameEn: "Go to Quick Tasks",
      icon: "checkbox-outline",
      category: "navigation",
      action: actions.goToTodos,
    },
    {
      id: "go-notes",
      name: "עבור להערות",
      nameEn: "Go to Notes",
      icon: "document-text-outline",
      category: "navigation",
      action: actions.goToNotes,
    },
    {
      id: "go-workflows",
      name: "מרכז הפיקוד",
      nameEn: "Command Center",
      icon: "terminal-outline",
      category: "navigation",
      action: actions.goToWorkflows,
    },

    // Tasks
    {
      id: "create-task",
      name: "צור משימה חדשה",
      nameEn: "Create New Task",
      icon: "add-circle-outline",
      category: "tasks",
      action: actions.createTask,
    },
    {
      id: "create-todo",
      name: "הוסף משימה מהירה",
      nameEn: "Add Quick Task",
      icon: "flash-outline",
      category: "tasks",
      action: actions.createTodo,
    },
    {
      id: "templates",
      name: "השתמש בתבנית",
      nameEn: "Use Template",
      icon: "copy-outline",
      category: "tasks",
      action: actions.openTemplates,
    },

    // Actions
    {
      id: "pomodoro",
      name: "התחל פומודורו",
      nameEn: "Start Pomodoro",
      icon: "timer-outline",
      category: "actions",
      action: actions.startPomodoro,
    },
    {
      id: "export",
      name: "ייצא נתונים",
      nameEn: "Export Data",
      icon: "download-outline",
      category: "actions",
      action: actions.openExport,
    },

    // Settings
    {
      id: "theme",
      name: "החלף ערכת נושא",
      nameEn: "Toggle Theme",
      icon: "contrast-outline",
      category: "settings",
      action: actions.toggleTheme,
    },
    {
      id: "settings",
      name: "הגדרות",
      nameEn: "Settings",
      icon: "settings-outline",
      category: "settings",
      action: actions.openSettings,
    },
  ];
}
