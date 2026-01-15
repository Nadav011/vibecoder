// ============================================
// VIBECODER - Type Definitions
// Premium Project Management for Vibe Coders
// ============================================

// Task Status - Workflow stages
export type TaskStatus = "todo" | "in_progress" | "complete";

// Priority Levels - P0 (Critical) to P3 (Low)
export type TaskPriority = "p0" | "p1" | "p2" | "p3";

// Label for categorization
export interface Label {
  id: string;
  name: string;
  color: string;
}

// Subtask for breaking down work
export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

// Main Task interface - Full featured
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[]; // Label IDs
  subtasks: Subtask[];
  dueDate?: number; // Unix timestamp
  estimatedMinutes?: number;
  aiGenerated?: boolean; // Track AI-assisted work
  codeSnippet?: string; // Paste from Claude output
  createdAt: number;
  updatedAt: number;
}

// Column definition
export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

// Quick Todo - Lightweight tasks
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority?: TaskPriority;
  createdAt: number;
}

// Note for documentation
export interface Note {
  id: string;
  title?: string;
  content: string;
  pinned?: boolean;
  updatedAt: number;
}

// App Settings
export interface AppSettings {
  theme: "dark" | "light" | "system";
  showCompletedTasks: boolean;
  defaultPriority: TaskPriority;
  hapticFeedback: boolean;
  soundEffects: boolean;
}

// Filter state for search/filter
export interface FilterState {
  searchQuery: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  labels: string[];
  showAiGenerated: boolean | null;
  dueDateRange: { start?: number; end?: number } | null;
}

// ============================================
// Store Types
// ============================================

export interface KanbanStore {
  tasks: Task[];
  labels: Label[];
  filter: FilterState;

  // Task actions
  addTask: (task: Partial<Task> & { title: string }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, tasks: Task[]) => void;

  // Subtask actions
  addSubtask: (taskId: string, text: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Label actions
  addLabel: (name: string, color: string) => void;
  deleteLabel: (labelId: string) => void;

  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilter: () => void;

  // Computed
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export interface TodoStore {
  todos: Todo[];
  addTodo: (text: string, priority?: TaskPriority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  clearCompleted: () => void;
  reorderTodos: (todos: Todo[]) => void;
}

export interface NotesStore {
  notes: Note[];
  activeNoteId: string | null;
  addNote: (title?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  togglePinned: (id: string) => void;
}

export interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

// ============================================
// Utility Types
// ============================================

export type CreateTaskInput = Pick<Task, "title"> &
  Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

export const DEFAULT_LABELS: Label[] = [
  { id: "bug", name: "Bug", color: "#EF4444" },
  { id: "feature", name: "Feature", color: "#8B5CF6" },
  { id: "refactor", name: "Refactor", color: "#F59E0B" },
  { id: "ai-generated", name: "AI Generated", color: "#6366F1" },
  { id: "tech-debt", name: "Tech Debt", color: "#EC4899" },
  { id: "docs", name: "Docs", color: "#10B981" },
];

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; icon: string }
> = {
  p0: { label: "Critical", color: "#EF4444", icon: "flame" },
  p1: { label: "High", color: "#F59E0B", icon: "arrow-up" },
  p2: { label: "Medium", color: "#6366F1", icon: "remove" },
  p3: { label: "Low", color: "#71717A", icon: "arrow-down" },
};

export const DEFAULT_FILTER: FilterState = {
  searchQuery: "",
  statuses: [],
  priorities: [],
  labels: [],
  showAiGenerated: null,
  dueDateRange: null,
};
