// ================================
// WORKFLOWS - Main Export
// ================================
// This file provides a single import point for all workflow data
// Maintains backward compatibility with the original workflows.ts

// Types
export type {
  Command,
  Phase,
  UseCase,
  ProjectFlowStep,
  ProjectFlow,
  Plugin,
  HardStop,
  SkillSummary,
  Breakpoint,
  Device,
  TouchTarget,
  Category,
  PlatformFilter,
} from "./types";

// Data Arrays
export { PHASES, WEB_PHASES, FLUTTER_PHASES } from "./phases";
export { USE_CASES, WEB_USE_CASES, FLUTTER_USE_CASES } from "./use-cases";
export {
  PROJECT_FLOWS,
  WEB_PROJECT_FLOWS,
  FLUTTER_PROJECT_FLOWS,
} from "./project-flows";
export { SKILLS_SUMMARY, WEB_SKILLS, FLUTTER_SKILLS } from "./skills";
export { CATEGORIES, WEB_CATEGORIES, FLUTTER_CATEGORIES } from "./categories";
export { PLUGINS } from "./plugins";
export { HARD_STOPS } from "./hard-stops";
export { BREAKPOINTS, DEVICES, TOUCH_TARGETS } from "./responsive";

// Utility Functions & Computed Values
export {
  // Computed exports
  QUICK_ACTIONS,
  ALL_COMMANDS,
  TOTAL_COMMANDS,
  // Search functions
  searchCommands,
  searchFlutterCommands,
  // Lookup functions
  getPhaseById,
  getCommandById,
  getHardStopForCommand,
  getCommandsByCategory,
  // Build functions
  buildFullCommand,
  // Flutter helpers
  getFlutterPhases,
  getWebPhases,
  getFlutterSkills,
  getWebSkills,
  isFlutterCommand,
  getFlutterUseCases,
  getWebUseCases,
  getFlutterProjectFlows,
  getWebProjectFlows,
  getFlutterCategories,
  getWebCategories,
  getFlutterQuickActions,
  getAllFlutterCommands,
  // Statistics
  FLUTTER_STATS,
  WEB_STATS,
  TOTAL_STATS,
} from "./utils";
