import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  KANBAN: "@vibecoder/kanban",
  TODOS: "@vibecoder/todos",
  NOTES: "@vibecoder/notes",
  SETTINGS: "@vibecoder/settings",
  POMODORO: "@vibecoder/pomodoro",
  ANALYTICS: "@vibecoder/analytics",
  WORKFLOW_PROGRESS: "@vibecoder/workflow-progress",
} as const;

// Error callback for external error handling (e.g., showing toast)
type StorageErrorCallback = (error: Error, operation: string) => void;
let onStorageError: StorageErrorCallback | null = null;

/**
 * Set a callback for storage errors
 * This allows the app to show user-friendly error messages
 */
export function setStorageErrorHandler(callback: StorageErrorCallback): void {
  onStorageError = callback;
}

/**
 * Log storage error and optionally notify external handler
 */
export function handleStorageError(error: unknown, operation: string): void {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[Storage] ${operation} failed:`, err.message);

  if (onStorageError) {
    onStorageError(err, operation);
  }
}

export const storage = {
  // Kanban
  async getKanban<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.KANBAN);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getKanban");
      return null;
    }
  },

  async setKanban<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.KANBAN, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setKanban");
      return false;
    }
  },

  // Todos
  async getTodos<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getTodos");
      return null;
    }
  },

  async setTodos<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setTodos");
      return false;
    }
  },

  // Notes
  async getNotes<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getNotes");
      return null;
    }
  },

  async setNotes<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setNotes");
      return false;
    }
  },

  // Settings
  async getSettings<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getSettings");
      return null;
    }
  },

  async setSettings<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setSettings");
      return false;
    }
  },

  // Pomodoro
  async getPomodoro<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.POMODORO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getPomodoro");
      return null;
    }
  },

  async setPomodoro<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setPomodoro");
      return false;
    }
  },

  // Analytics
  async getAnalytics<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getAnalytics");
      return null;
    }
  },

  async setAnalytics<T>(data: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
      return true;
    } catch (error) {
      handleStorageError(error, "setAnalytics");
      return false;
    }
  },

  // Workflow Progress
  async getWorkflowProgress(): Promise<string[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKFLOW_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      handleStorageError(error, "getWorkflowProgress");
      return null;
    }
  },

  async setWorkflowProgress(completedSteps: string[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WORKFLOW_PROGRESS,
        JSON.stringify(completedSteps),
      );
      return true;
    } catch (error) {
      handleStorageError(error, "setWorkflowProgress");
      return false;
    }
  },

  // Clear all data
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      handleStorageError(error, "clearAll");
      return false;
    }
  },
};
