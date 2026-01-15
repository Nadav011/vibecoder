import { create } from "zustand";
import { Todo, TodoStore, TaskPriority } from "../types";
import { storage } from "../utils/storage";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],

  addTodo: (text, priority) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    set((state) => {
      const newTodos = [newTodo, ...state.todos];
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  toggleTodo: (id) => {
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  deleteTodo: (id) => {
    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  updateTodo: (id, updates) => {
    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo,
      );
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  clearCompleted: () => {
    set((state) => {
      const newTodos = state.todos.filter((todo) => !todo.completed);
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  reorderTodos: (todos) => {
    storage.setTodos(todos);
    set({ todos });
  },
}));

// Initialize store from storage
export const initTodoStore = async () => {
  const saved = await storage.getTodos<Todo[]>();
  if (saved) {
    useTodoStore.setState({ todos: saved });
  }
};
