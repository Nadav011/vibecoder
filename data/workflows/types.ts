// ================================
// WORKFLOW TYPES - All TypeScript interfaces
// ================================

export interface Command {
  id: string;
  command: string;
  flags?: string[];
  params?: string;
  description: string;
  output?: string;
  shortcut?: string;
  isQuickAction?: boolean;
  requirement?: string;
  timeEstimate?: string;
  isAutonomous?: boolean;
}

export interface Phase {
  id: string;
  number: string;
  name: string;
  nameHe: string;
  skill: string;
  icon: string;
  color: string;
  commands: Command[];
  hardStops?: string[];
  description?: string;
}

export interface UseCase {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  commands: string[];
  description: string;
}

export interface ProjectFlowStep {
  stepNumber: number;
  phase: string;
  title: string;
  titleHe: string;
  description: string;
  commands: string[];
  tips?: string[];
  warning?: string;
  isRequired: boolean;
}

export interface ProjectFlow {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  color: string;
  description: string;
  estimatedTime: string;
  steps: ProjectFlowStep[];
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  commands: Command[];
}

export interface HardStop {
  after: string;
  check: string;
  condition: string;
  ifFailed: string;
}

export interface SkillSummary {
  number: number;
  name: string;
  phase: string;
  role: string;
  keyCommands: string[];
}

export interface Breakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  tailwindClass: string;
  description: string;
}

export interface Device {
  name: string;
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
  required: boolean;
}

export interface TouchTarget {
  element: string;
  minimum: string;
  recommended: string;
}

export interface Category {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  color: string;
  commandPatterns: string[];
}

// Platform filter type
export type PlatformFilter = "all" | "web" | "flutter";
