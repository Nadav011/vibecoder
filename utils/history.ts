/**
 * Simple history management for undo/redo functionality
 * Stores snapshots of state for reverting changes
 */

interface HistoryState<T> {
  past: T[];
  future: T[];
}

const MAX_HISTORY_SIZE = 50;

/**
 * Creates a history manager for tracking state changes
 */
export function createHistoryManager<T>() {
  const history: HistoryState<T> = {
    past: [],
    future: [],
  };

  return {
    /**
     * Push a new state to history (call before making changes)
     */
    push: (state: T) => {
      history.past.push(state);
      // Clear future when new action is taken
      history.future = [];
      // Limit history size
      if (history.past.length > MAX_HISTORY_SIZE) {
        history.past.shift();
      }
    },

    /**
     * Undo - returns the previous state or null if no history
     */
    undo: (currentState: T): T | null => {
      const previousState = history.past.pop();
      if (previousState === undefined) {
        return null;
      }
      history.future.push(currentState);
      return previousState;
    },

    /**
     * Redo - returns the next state or null if no future
     */
    redo: (currentState: T): T | null => {
      const nextState = history.future.pop();
      if (nextState === undefined) {
        return null;
      }
      history.past.push(currentState);
      return nextState;
    },

    /**
     * Check if undo is available
     */
    canUndo: () => history.past.length > 0,

    /**
     * Check if redo is available
     */
    canRedo: () => history.future.length > 0,

    /**
     * Clear all history
     */
    clear: () => {
      history.past = [];
      history.future = [];
    },

    /**
     * Get history stats for debugging
     */
    getStats: () => ({
      pastLength: history.past.length,
      futureLength: history.future.length,
    }),
  };
}

// Singleton history managers for each store
export const kanbanHistory = createHistoryManager<{
  tasks: unknown[];
  labels: unknown[];
}>();

export const todoHistory = createHistoryManager<{ todos: unknown[] }>();
