import { create } from "zustand";
import { Todo, TodoStore } from "../types";
import { storage } from "../utils/storage";
import { generateId } from "../utils/generateId";
import { todoHistory } from "../utils/history";

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],

  addTodo: (text, priority) => {
    const { todos } = get();
    todoHistory.push({ todos });

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
    const { todos } = get();
    todoHistory.push({ todos });

    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo,
      );
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  deleteTodo: (id) => {
    const { todos } = get();
    todoHistory.push({ todos });

    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  updateTodo: (id, updates) => {
    const { todos } = get();
    todoHistory.push({ todos });

    set((state) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates, updatedAt: Date.now() } : todo,
      );
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  clearCompleted: () => {
    const { todos } = get();
    todoHistory.push({ todos });

    set((state) => {
      const newTodos = state.todos.filter((todo) => !todo.completed);
      storage.setTodos(newTodos);
      return { todos: newTodos };
    });
  },

  reorderTodos: (todos) => {
    const currentTodos = get().todos;
    todoHistory.push({ todos: currentTodos });

    storage.setTodos(todos);
    set({ todos });
  },

  // Undo/Redo actions
  undo: () => {
    const { todos } = get();
    const previousState = todoHistory.undo({ todos });
    if (previousState) {
      const restoredTodos = previousState.todos as Todo[];
      storage.setTodos(restoredTodos);
      set({ todos: restoredTodos });
      return true;
    }
    return false;
  },

  redo: () => {
    const { todos } = get();
    const nextState = todoHistory.redo({ todos });
    if (nextState) {
      const restoredTodos = nextState.todos as Todo[];
      storage.setTodos(restoredTodos);
      set({ todos: restoredTodos });
      return true;
    }
    return false;
  },

  canUndo: () => todoHistory.canUndo(),
  canRedo: () => todoHistory.canRedo(),
}));

// Initialize store from storage
export const initTodoStore = async () => {
  const saved = await storage.getTodos<Todo[]>();
  if (saved) {
    useTodoStore.setState({ todos: saved });
  }
};
