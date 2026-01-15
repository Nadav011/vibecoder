import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskPriority } from "../types";

export interface TaskTemplate {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
  task: {
    title: string;
    description?: string;
    priority: TaskPriority;
    labels: string[];
    subtasks: string[];
    estimatedMinutes?: number;
  };
}

const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: "bug-fix",
    name: "תיקון באג",
    icon: "bug-outline",
    isDefault: true,
    task: {
      title: "[BUG] ",
      description:
        "תיאור הבאג:\n\nצעדים לשחזור:\n1. \n2. \n3. \n\nתוצאה צפויה:\n\nתוצאה בפועל:",
      priority: "p1",
      labels: ["bug"],
      subtasks: [
        "שחזור הבאג",
        "מציאת שורש הבעיה",
        "כתיבת תיקון",
        "בדיקות",
        "סקירת קוד",
      ],
      estimatedMinutes: 60,
    },
  },
  {
    id: "feature",
    name: "פיצ'ר חדש",
    icon: "sparkles-outline",
    isDefault: true,
    task: {
      title: "[FEATURE] ",
      description: "תיאור הפיצ'ר:\n\nדרישות:\n- \n\nאקספטנס קריטריה:\n- ",
      priority: "p2",
      labels: ["feature"],
      subtasks: ["תכנון", "עיצוב", "פיתוח", "בדיקות", "תיעוד"],
      estimatedMinutes: 120,
    },
  },
  {
    id: "refactor",
    name: "ריפקטור",
    icon: "code-slash-outline",
    isDefault: true,
    task: {
      title: "[REFACTOR] ",
      description: "מה לשפר:\n\nסיבה:\n\nסיכונים:",
      priority: "p3",
      labels: ["refactor"],
      subtasks: [
        "ניתוח קוד קיים",
        "תכנון שיפורים",
        "ביצוע שינויים",
        "בדיקות רגרסיה",
      ],
      estimatedMinutes: 90,
    },
  },
  {
    id: "ai-task",
    name: "משימת AI",
    icon: "hardware-chip-outline",
    isDefault: true,
    task: {
      title: "[AI] ",
      description: "פרומפט:\n\nמטרה:\n\nהערות:",
      priority: "p2",
      labels: ["ai-generated"],
      subtasks: ["הגדרת פרומפט", "בדיקת פלט", "שילוב בקוד", "בדיקות"],
      estimatedMinutes: 45,
    },
  },
  {
    id: "docs",
    name: "תיעוד",
    icon: "document-text-outline",
    isDefault: true,
    task: {
      title: "[DOCS] ",
      description: "מה לתעד:\n\nקהל יעד:\n\nפורמט:",
      priority: "p3",
      labels: ["docs"],
      subtasks: ["מחקר", "כתיבה", "סקירה", "פרסום"],
      estimatedMinutes: 60,
    },
  },
  {
    id: "quick",
    name: "משימה מהירה",
    icon: "flash-outline",
    isDefault: true,
    task: {
      title: "",
      priority: "p2",
      labels: [],
      subtasks: [],
    },
  },
];

const STORAGE_KEY = "@vibecoder/templates";

interface TemplateStore {
  templates: TaskTemplate[];
  isLoaded: boolean;

  // Actions
  addTemplate: (template: Omit<TaskTemplate, "id" | "isDefault">) => void;
  updateTemplate: (id: string, updates: Partial<TaskTemplate>) => void;
  deleteTemplate: (id: string) => void;
  resetToDefaults: () => void;
  getTemplate: (id: string) => TaskTemplate | undefined;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: DEFAULT_TEMPLATES,
  isLoaded: false,

  addTemplate: (template) => {
    const newTemplate: TaskTemplate = {
      ...template,
      id: generateId(),
      isDefault: false,
    };

    set((state) => {
      const newTemplates = [...state.templates, newTemplate];
      saveTemplates(newTemplates);
      return { templates: newTemplates };
    });
  },

  updateTemplate: (id, updates) => {
    set((state) => {
      const newTemplates = state.templates.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      saveTemplates(newTemplates);
      return { templates: newTemplates };
    });
  },

  deleteTemplate: (id) => {
    set((state) => {
      const template = state.templates.find((t) => t.id === id);
      // Don't delete default templates
      if (template?.isDefault) return state;

      const newTemplates = state.templates.filter((t) => t.id !== id);
      saveTemplates(newTemplates);
      return { templates: newTemplates };
    });
  },

  resetToDefaults: () => {
    set({ templates: DEFAULT_TEMPLATES });
    saveTemplates(DEFAULT_TEMPLATES);
  },

  getTemplate: (id) => {
    return get().templates.find((t) => t.id === id);
  },
}));

// Helpers
function generateId(): string {
  return `tpl_${Math.random().toString(36).substring(2, 9)}`;
}

async function saveTemplates(templates: TaskTemplate[]): Promise<void> {
  try {
    // Only save custom templates (non-default)
    const customTemplates = templates.filter((t) => !t.isDefault);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates));
  } catch (error) {
    console.error("Failed to save templates:", error);
  }
}

export async function initTemplateStore(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customTemplates = JSON.parse(stored) as TaskTemplate[];
      // Merge default + custom templates
      const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];
      useTemplateStore.setState({ templates: allTemplates, isLoaded: true });
    } else {
      useTemplateStore.setState({ isLoaded: true });
    }
  } catch (error) {
    console.error("Failed to load templates:", error);
    useTemplateStore.setState({ isLoaded: true });
  }
}
