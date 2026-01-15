import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  KANBAN: "@vibecoder/kanban",
  TODOS: "@vibecoder/todos",
  NOTES: "@vibecoder/notes",
} as const;

export const storage = {
  async getKanban<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.KANBAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setKanban<T>(data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.KANBAN, JSON.stringify(data));
    } catch {
      // Silent fail
    }
  },

  async getTodos<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setTodos<T>(data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(data));
    } catch {
      // Silent fail
    }
  },

  async getNotes<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setNotes<T>(data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data));
    } catch {
      // Silent fail
    }
  },
};
