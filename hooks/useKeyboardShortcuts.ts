import { useEffect, useCallback } from "react";
import { Platform } from "react-native";

export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "cmd" | "shift" | "alt")[];
  action: () => void;
  description: string;
  descriptionHe: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

// Check if we're on web
const isWeb = Platform.OS === "web";

// Detect Mac vs Windows/Linux
const isMac =
  isWeb && typeof navigator !== "undefined"
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {},
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if typing in input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Only allow Escape to work in inputs
        if (event.key !== "Escape") return;
      }

      for (const shortcut of shortcuts) {
        const modifiers = shortcut.modifiers || [];

        // Check modifiers
        const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;
        const needsCmdOrCtrl =
          modifiers.includes("cmd") || modifiers.includes("ctrl");
        const needsShift = modifiers.includes("shift");
        const needsAlt = modifiers.includes("alt");

        const modifiersMatch =
          (needsCmdOrCtrl ? cmdOrCtrl : !cmdOrCtrl || event.key === "Escape") &&
          (needsShift ? event.shiftKey : !event.shiftKey) &&
          (needsAlt ? event.altKey : !event.altKey);

        // Check key
        const keyMatch =
          event.key.toLowerCase() === shortcut.key.toLowerCase() ||
          event.code === `Key${shortcut.key.toUpperCase()}` ||
          event.code === `Digit${shortcut.key}`;

        if (modifiersMatch && keyMatch) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (!isWeb || !enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}

// Pre-defined shortcut configurations
export function createShortcuts(actions: {
  openCommandPalette?: () => void;
  createTask?: () => void;
  createTodo?: () => void;
  focusSearch?: () => void;
  goToBoard?: () => void;
  goToTodos?: () => void;
  goToNotes?: () => void;
  startPomodoro?: () => void;
  toggleTheme?: () => void;
  exportData?: () => void;
  closeModal?: () => void;
  showShortcuts?: () => void;
  undo?: () => void;
  redo?: () => void;
}): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.openCommandPalette) {
    shortcuts.push({
      key: "k",
      modifiers: ["cmd"],
      action: actions.openCommandPalette,
      description: "Open Command Palette",
      descriptionHe: "פתח פלטת פקודות",
    });
  }

  if (actions.createTask) {
    shortcuts.push({
      key: "n",
      modifiers: ["cmd"],
      action: actions.createTask,
      description: "Create New Task",
      descriptionHe: "צור משימה חדשה",
    });
  }

  if (actions.createTodo) {
    shortcuts.push({
      key: "n",
      modifiers: ["cmd", "shift"],
      action: actions.createTodo,
      description: "Create Quick Todo",
      descriptionHe: "צור משימה מהירה",
    });
  }

  if (actions.focusSearch) {
    shortcuts.push({
      key: "f",
      modifiers: ["cmd"],
      action: actions.focusSearch,
      description: "Focus Search",
      descriptionHe: "מיקוד חיפוש",
    });
  }

  if (actions.goToBoard) {
    shortcuts.push({
      key: "1",
      modifiers: ["cmd"],
      action: actions.goToBoard,
      description: "Go to Board",
      descriptionHe: "עבור ללוח",
    });
  }

  if (actions.goToTodos) {
    shortcuts.push({
      key: "2",
      modifiers: ["cmd"],
      action: actions.goToTodos,
      description: "Go to Todos",
      descriptionHe: "עבור למשימות",
    });
  }

  if (actions.goToNotes) {
    shortcuts.push({
      key: "3",
      modifiers: ["cmd"],
      action: actions.goToNotes,
      description: "Go to Notes",
      descriptionHe: "עבור להערות",
    });
  }

  if (actions.startPomodoro) {
    shortcuts.push({
      key: "p",
      modifiers: ["cmd"],
      action: actions.startPomodoro,
      description: "Start Pomodoro",
      descriptionHe: "התחל פומודורו",
    });
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: "d",
      modifiers: ["cmd"],
      action: actions.toggleTheme,
      description: "Toggle Theme",
      descriptionHe: "החלף ערכת נושא",
    });
  }

  if (actions.exportData) {
    shortcuts.push({
      key: "e",
      modifiers: ["cmd"],
      action: actions.exportData,
      description: "Export Data",
      descriptionHe: "ייצא נתונים",
    });
  }

  if (actions.closeModal) {
    shortcuts.push({
      key: "Escape",
      action: actions.closeModal,
      description: "Close / Cancel",
      descriptionHe: "סגור / בטל",
    });
  }

  if (actions.showShortcuts) {
    shortcuts.push({
      key: "?",
      action: actions.showShortcuts,
      description: "Show Keyboard Shortcuts",
      descriptionHe: "הצג קיצורי מקלדת",
    });
  }

  if (actions.undo) {
    shortcuts.push({
      key: "z",
      modifiers: ["cmd"],
      action: actions.undo,
      description: "Undo",
      descriptionHe: "בטל פעולה",
    });
  }

  if (actions.redo) {
    shortcuts.push({
      key: "z",
      modifiers: ["cmd", "shift"],
      action: actions.redo,
      description: "Redo",
      descriptionHe: "בצע שוב",
    });
  }

  return shortcuts;
}

// Format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  const modifiers = shortcut.modifiers || [];

  if (modifiers.includes("cmd") || modifiers.includes("ctrl")) {
    parts.push(isMac ? "⌘" : "Ctrl");
  }
  if (modifiers.includes("shift")) {
    parts.push(isMac ? "⇧" : "Shift");
  }
  if (modifiers.includes("alt")) {
    parts.push(isMac ? "⌥" : "Alt");
  }

  // Format key
  let keyDisplay = shortcut.key.toUpperCase();
  if (keyDisplay === "ESCAPE") keyDisplay = "Esc";

  parts.push(keyDisplay);

  return parts.join(isMac ? "" : "+");
}

// Export for checking if shortcuts are available
export const shortcutsAvailable = isWeb;
