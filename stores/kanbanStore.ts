import { create } from "zustand";
import {
  Task,
  Label,
  KanbanStore,
  DEFAULT_LABELS,
  DEFAULT_FILTER,
} from "../types";
import { storage } from "../utils/storage";
import { generateId } from "../utils/generateId";
import { kanbanHistory } from "../utils/history";

/**
 * Kanban board store - manages tasks, labels, and filtering
 *
 * Features:
 * - Task CRUD operations with automatic persistence
 * - Label management for task categorization
 * - Advanced filtering by status, priority, labels, and more
 * - Undo/Redo support via history tracking
 *
 * @example
 * const { tasks, addTask, moveTask } = useKanbanStore();
 * addTask({ title: 'New task' });
 * moveTask(taskId, 'in_progress');
 */
export const useKanbanStore = create<KanbanStore>((set, get) => ({
  tasks: [],
  labels: DEFAULT_LABELS,
  filter: DEFAULT_FILTER,

  /**
   * Add a new task to the board
   * @param taskInput - Partial task data with required title
   */
  addTask: (taskInput) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    const newTask: Task = {
      id: generateId(),
      title: taskInput.title,
      description: taskInput.description,
      status: taskInput.status || "todo",
      priority: taskInput.priority || "p2",
      labels: taskInput.labels || [],
      subtasks: taskInput.subtasks || [],
      dueDate: taskInput.dueDate,
      estimatedMinutes: taskInput.estimatedMinutes,
      aiGenerated: taskInput.aiGenerated,
      codeSnippet: taskInput.codeSnippet,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => {
      const newTasks = [...state.tasks, newTask];
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Update an existing task
   * @param id - Task ID to update
   * @param updates - Partial task data to merge
   */
  updateTask: (id, updates) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task,
      );
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Delete a task from the board
   * @param id - Task ID to delete
   */
  deleteTask: (id) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Move a task to a different status column
   * @param taskId - Task ID to move
   * @param newStatus - Target status (todo, in_progress, complete)
   */
  moveTask: (taskId, newStatus) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: Date.now() }
          : task,
      );
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Reorder tasks within a status column
   * @param status - The status column to reorder
   * @param reorderedTasks - Tasks in their new order
   */
  reorderTasks: (status, reorderedTasks) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const otherTasks = state.tasks.filter((t) => t.status !== status);
      const newTasks = [...otherTasks, ...reorderedTasks];
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Add a subtask to an existing task
   * @param taskId - Parent task ID
   * @param text - Subtask text content
   */
  addSubtask: (taskId, text) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              { id: generateId(), text, completed: false },
            ],
            updatedAt: Date.now(),
          };
        }
        return task;
      });
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Toggle subtask completion status
   * @param taskId - Parent task ID
   * @param subtaskId - Subtask ID to toggle
   */
  toggleSubtask: (taskId, subtaskId) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st,
            ),
            updatedAt: Date.now(),
          };
        }
        return task;
      });
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Remove a subtask from a task
   * @param taskId - Parent task ID
   * @param subtaskId - Subtask ID to delete
   */
  deleteSubtask: (taskId, subtaskId) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
            updatedAt: Date.now(),
          };
        }
        return task;
      });
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  /**
   * Create a new label for task categorization
   * @param name - Label display name
   * @param color - Hex color code for the label
   */
  addLabel: (name, color) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newLabel: Label = { id: generateId(), name, color };
      const newLabels = [...state.labels, newLabel];
      storage.setKanban({ tasks: state.tasks, labels: newLabels });
      return { labels: newLabels };
    });
  },

  /**
   * Delete a label and remove it from all tasks
   * @param labelId - Label ID to delete
   */
  deleteLabel: (labelId) => {
    const { tasks, labels } = get();
    kanbanHistory.push({ tasks, labels });

    set((state) => {
      const newLabels = state.labels.filter((l) => l.id !== labelId);
      // Also remove label from all tasks
      const newTasks = state.tasks.map((task) => ({
        ...task,
        labels: task.labels.filter((l) => l !== labelId),
      }));
      storage.setKanban({ tasks: newTasks, labels: newLabels });
      return { labels: newLabels, tasks: newTasks };
    });
  },

  /**
   * Update filter settings (merges with existing filter)
   * @param filterUpdates - Partial filter state to merge
   */
  setFilter: (filterUpdates) => {
    set((state) => ({
      filter: { ...state.filter, ...filterUpdates },
    }));
  },

  /**
   * Reset all filters to default state
   */
  clearFilter: () => {
    set({ filter: DEFAULT_FILTER });
  },

  /**
   * Get tasks filtered by current filter settings
   * Applies search, status, priority, label, AI-generated, and date filters
   * @returns Filtered array of tasks
   */
  getFilteredTasks: () => {
    const { tasks, filter } = get();

    // Defensive: ensure tasks is an array
    if (!Array.isArray(tasks)) return [];

    return tasks.filter((task) => {
      // Defensive: skip invalid tasks
      if (!task || typeof task !== "object") return false;

      // Search query
      if (filter?.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query) ?? false;
        const matchesDesc =
          task.description?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status filter
      const statuses = filter?.statuses ?? [];
      if (statuses.length > 0 && !statuses.includes(task.status)) {
        return false;
      }

      // Priority filter
      const priorities = filter?.priorities ?? [];
      if (priorities.length > 0 && !priorities.includes(task.priority)) {
        return false;
      }

      // Label filter
      const filterLabels = filter?.labels ?? [];
      const taskLabels = task.labels ?? [];
      if (
        filterLabels.length > 0 &&
        !filterLabels.some((l) => taskLabels.includes(l))
      ) {
        return false;
      }

      // AI generated filter
      if (
        filter?.showAiGenerated !== null &&
        filter?.showAiGenerated !== undefined
      ) {
        if (filter.showAiGenerated && !task.aiGenerated) return false;
        if (!filter.showAiGenerated && task.aiGenerated) return false;
      }

      // Due date range
      if (filter?.dueDateRange && task.dueDate) {
        if (
          filter.dueDateRange.start &&
          task.dueDate < filter.dueDateRange.start
        ) {
          return false;
        }
        if (filter.dueDateRange.end && task.dueDate > filter.dueDateRange.end) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Get filtered tasks for a specific status column
   * @param status - Status to filter by (todo, in_progress, complete)
   * @returns Tasks matching both the filter and status
   */
  getTasksByStatus: (status) => {
    const filteredTasks = get().getFilteredTasks();
    return filteredTasks.filter((t) => t.status === status);
  },

  /**
   * Undo the last action (Ctrl+Z)
   * @returns true if undo was successful, false if no history
   */
  undo: () => {
    const { tasks, labels } = get();
    const previousState = kanbanHistory.undo({ tasks, labels });
    if (previousState) {
      const restoredTasks = previousState.tasks as Task[];
      const restoredLabels = previousState.labels as Label[];
      storage.setKanban({ tasks: restoredTasks, labels: restoredLabels });
      set({ tasks: restoredTasks, labels: restoredLabels });
      return true;
    }
    return false;
  },

  /**
   * Redo the last undone action (Ctrl+Shift+Z)
   * @returns true if redo was successful, false if no future history
   */
  redo: () => {
    const { tasks, labels } = get();
    const nextState = kanbanHistory.redo({ tasks, labels });
    if (nextState) {
      const restoredTasks = nextState.tasks as Task[];
      const restoredLabels = nextState.labels as Label[];
      storage.setKanban({ tasks: restoredTasks, labels: restoredLabels });
      set({ tasks: restoredTasks, labels: restoredLabels });
      return true;
    }
    return false;
  },

  /** Check if undo is available */
  canUndo: () => kanbanHistory.canUndo(),

  /** Check if redo is available */
  canRedo: () => kanbanHistory.canRedo(),
}));

/**
 * Initialize the kanban store from persistent storage
 * Should be called once on app startup before rendering
 */
export const initKanbanStore = async () => {
  const saved = await storage.getKanban<{ tasks: Task[]; labels: Label[] }>();
  if (saved) {
    useKanbanStore.setState({
      tasks: saved.tasks || [],
      labels: saved.labels || DEFAULT_LABELS,
    });
  }
};
