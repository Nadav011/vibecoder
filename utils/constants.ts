/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// List item heights for FlatList optimization
export const ITEM_HEIGHTS = {
  TODO_ITEM: 56,
  TASK_CARD: 120,
  NOTE_TAB: 60,
  COMMAND_ITEM: 48,
} as const;

// Input validation limits
export const VALIDATION = {
  TASK_TITLE_MAX: 100,
  TASK_DESCRIPTION_MAX: 500,
  TODO_TEXT_MAX: 200,
  NOTE_CONTENT_MAX: 10000,
  LABEL_NAME_MAX: 30,
} as const;

// Animation durations (ms)
export const ANIMATIONS = {
  FADE_DURATION: 200,
  SCALE_DURATION: 150,
  SKELETON_SHIMMER: 1500,
  MODAL_TRANSITION: 250,
} as const;

// Pomodoro defaults (minutes)
export const POMODORO = {
  WORK_DURATION: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
  SESSIONS_BEFORE_LONG_BREAK: 4,
  MAX_SESSIONS_STORED: 100,
} as const;

// Storage limits
export const STORAGE = {
  MAX_TASKS: 1000,
  MAX_TODOS: 500,
  MAX_NOTES: 100,
  MAX_LABELS: 50,
} as const;

// Pagination
export const PAGINATION = {
  INITIAL_RENDER: 15,
  MAX_PER_BATCH: 10,
  WINDOW_SIZE: 5,
} as const;

// Z-index layers
export const Z_INDEX = {
  MODAL: 1000,
  OVERLAY: 999,
  DROPDOWN: 100,
  HEADER: 50,
  FLOATING_BUTTON: 10,
} as const;
