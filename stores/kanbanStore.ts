import { create } from "zustand";
import {
  Task,
  TaskStatus,
  TaskPriority,
  Label,
  FilterState,
  KanbanStore,
  DEFAULT_LABELS,
  DEFAULT_FILTER,
} from "../types";
import { storage } from "../utils/storage";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  tasks: [],
  labels: DEFAULT_LABELS,
  filter: DEFAULT_FILTER,

  // Task actions
  addTask: (taskInput) => {
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

  updateTask: (id, updates) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task,
      );
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  moveTask: (taskId, newStatus) => {
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

  reorderTasks: (status, reorderedTasks) => {
    set((state) => {
      const otherTasks = state.tasks.filter((t) => t.status !== status);
      const newTasks = [...otherTasks, ...reorderedTasks];
      storage.setKanban({ tasks: newTasks, labels: state.labels });
      return { tasks: newTasks };
    });
  },

  // Subtask actions
  addSubtask: (taskId, text) => {
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

  toggleSubtask: (taskId, subtaskId) => {
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

  deleteSubtask: (taskId, subtaskId) => {
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

  // Label actions
  addLabel: (name, color) => {
    set((state) => {
      const newLabel: Label = { id: generateId(), name, color };
      const newLabels = [...state.labels, newLabel];
      storage.setKanban({ tasks: state.tasks, labels: newLabels });
      return { labels: newLabels };
    });
  },

  deleteLabel: (labelId) => {
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

  // Filter actions
  setFilter: (filterUpdates) => {
    set((state) => ({
      filter: { ...state.filter, ...filterUpdates },
    }));
  },

  clearFilter: () => {
    set({ filter: DEFAULT_FILTER });
  },

  // Computed
  getFilteredTasks: () => {
    const { tasks, filter } = get();

    return tasks.filter((task) => {
      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status filter
      if (
        filter.statuses.length > 0 &&
        !filter.statuses.includes(task.status)
      ) {
        return false;
      }

      // Priority filter
      if (
        filter.priorities.length > 0 &&
        !filter.priorities.includes(task.priority)
      ) {
        return false;
      }

      // Label filter
      if (
        filter.labels.length > 0 &&
        !filter.labels.some((l) => task.labels.includes(l))
      ) {
        return false;
      }

      // AI generated filter
      if (filter.showAiGenerated !== null) {
        if (filter.showAiGenerated && !task.aiGenerated) return false;
        if (!filter.showAiGenerated && task.aiGenerated) return false;
      }

      // Due date range
      if (filter.dueDateRange && task.dueDate) {
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

  getTasksByStatus: (status) => {
    const filteredTasks = get().getFilteredTasks();
    return filteredTasks.filter((t) => t.status === status);
  },
}));

// Initialize store from storage
export const initKanbanStore = async () => {
  const saved = await storage.getKanban<{ tasks: Task[]; labels: Label[] }>();
  if (saved) {
    useKanbanStore.setState({
      tasks: saved.tasks || [],
      labels: saved.labels || DEFAULT_LABELS,
    });
  }
};
