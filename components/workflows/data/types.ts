/**
 * ViberCoder Workflows Data Types
 * TypeScript interfaces for the complete workflow system
 * RTL-first, 8pt grid, strict typing
 */

// ============================================================================
// PHASE TYPES
// ============================================================================

export interface Phase {
  id: string;
  order: number;
  title: string;
  titleHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  color: string;
  commands: string[]; // Command IDs
  whenToUse: string[];
  flowchart?: string;
}

// ============================================================================
// COMMAND TYPES
// ============================================================================

export type CommandCategory =
  | "session"
  | "scan"
  | "quality"
  | "development"
  | "git"
  | "deploy"
  | "ui"
  | "agent"
  | "mcp"
  | "init"
  | "prime"
  | "misc";

export interface Command {
  id: string;
  name: string;
  description: string;
  descriptionHe: string;
  category: CommandCategory;
  phase?: string; // Phase ID if belongs to a specific phase
  usage: string;
  examples: string[];
  relatedCommands: string[];
  isQuickAccess: boolean;
  aliases?: string[];
}

export const COMMAND_CATEGORY_LABELS: Record<
  CommandCategory,
  { en: string; he: string }
> = {
  session: { en: "Session", he: "סשן" },
  scan: { en: "Scan", he: "סריקה" },
  quality: { en: "Quality", he: "איכות" },
  development: { en: "Development", he: "פיתוח" },
  git: { en: "Git", he: "גיט" },
  deploy: { en: "Deploy", he: "פריסה" },
  ui: { en: "UI", he: "ממשק" },
  agent: { en: "Agent", he: "סוכן" },
  mcp: { en: "MCP", he: "MCP" },
  init: { en: "Init", he: "אתחול" },
  prime: { en: "Prime", he: "פריים" },
  misc: { en: "Misc", he: "שונות" },
};

// ============================================================================
// SKILL TYPES
// ============================================================================

export type SkillCategory =
  | "core"
  | "workflow"
  | "quality"
  | "git"
  | "ui"
  | "agent"
  | "deploy"
  | "test"
  | "security"
  | "utility"
  | "flutter";

export type SkillPlatform = "web" | "flutter" | "both";

export interface Skill {
  id: string;
  name: string;
  description: string;
  descriptionHe: string;
  trigger: string;
  command: string;
  platform: SkillPlatform;
  autoTrigger: boolean;
  category: SkillCategory;
  aliases?: string[];
}

export const SKILL_CATEGORY_LABELS: Record<
  SkillCategory,
  { en: string; he: string }
> = {
  core: { en: "Core", he: "ליבה" },
  workflow: { en: "Workflow", he: "זרימה" },
  quality: { en: "Quality", he: "איכות" },
  git: { en: "Git", he: "גיט" },
  ui: { en: "UI", he: "ממשק" },
  agent: { en: "Agent", he: "סוכן" },
  deploy: { en: "Deploy", he: "פריסה" },
  test: { en: "Test", he: "בדיקות" },
  security: { en: "Security", he: "אבטחה" },
  utility: { en: "Utility", he: "כלים" },
  flutter: { en: "Flutter", he: "פלאטר" },
};

// ============================================================================
// AGENT TYPES
// ============================================================================

export type AgentModel = "opus" | "sonnet" | "haiku";

export interface Agent {
  id: string;
  name: string;
  description: string;
  descriptionHe: string;
  model: AgentModel;
  cost: "$" | "$$" | "$$$";
  useCase: string[];
  tools: string[];
  icon: string;
  color: string;
  triggers?: string[];
}

export const AGENT_MODEL_LABELS: Record<
  AgentModel,
  { en: string; he: string; cost: string }
> = {
  opus: { en: "Opus", he: "אופוס", cost: "$$$" },
  sonnet: { en: "Sonnet", he: "סונט", cost: "$$" },
  haiku: { en: "Haiku", he: "הייקו", cost: "$" },
};

// ============================================================================
// MCP SERVER TYPES
// ============================================================================

export interface MCPTool {
  name: string;
  description: string;
  descriptionHe?: string;
  usage: string;
}

export interface MCPExample {
  title: string;
  titleHe?: string;
  code: string;
  description?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  descriptionHe: string;
  tools: MCPTool[];
  examples: MCPExample[];
  icon: string;
  color: string;
  setupRequired?: boolean;
  envVars?: string[];
}

// ============================================================================
// GATE TYPES
// ============================================================================

export type GateCategory =
  | "foundation"
  | "structure"
  | "sensation"
  | "integrity"
  | "performance"
  | "neural"
  | "evolution"
  | "extended"
  | "accessibility";

export type GateSeverity = "critical" | "high" | "medium";

export interface Gate {
  id: string;
  code: string; // G1-G55 or A1-A15
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  category: GateCategory;
  severity: GateSeverity;
  autoFix: boolean;
  fixCommand?: string;
  cluster?: string;
}

export const GATE_CATEGORY_LABELS: Record<
  GateCategory,
  { en: string; he: string; color: string }
> = {
  foundation: { en: "Foundation", he: "יסודות", color: "#3B82F6" },
  structure: { en: "Structure", he: "מבנה", color: "#8B5CF6" },
  sensation: { en: "Sensation", he: "תחושה", color: "#EC4899" },
  integrity: { en: "Integrity", he: "שלמות", color: "#10B981" },
  performance: { en: "Performance", he: "ביצועים", color: "#F59E0B" },
  neural: { en: "Neural", he: "עצבי", color: "#6366F1" },
  evolution: { en: "Evolution", he: "אבולוציה", color: "#14B8A6" },
  extended: { en: "Extended", he: "מורחב", color: "#64748B" },
  accessibility: { en: "Accessibility", he: "נגישות", color: "#06B6D4" },
};

export const GATE_SEVERITY_LABELS: Record<
  GateSeverity,
  { en: string; he: string; color: string }
> = {
  critical: { en: "Critical", he: "קריטי", color: "#EF4444" },
  high: { en: "High", he: "גבוה", color: "#F97316" },
  medium: { en: "Medium", he: "בינוני", color: "#EAB308" },
};

// ============================================================================
// CHEATSHEET TYPES
// ============================================================================

export interface CheatsheetItem {
  label: string;
  labelHe?: string;
  value: string;
  description?: string;
  descriptionHe?: string;
}

export interface CheatsheetSection {
  id: string;
  title: string;
  titleHe: string;
  icon?: string;
  items: CheatsheetItem[];
}

// ============================================================================
// VIEW & NAVIGATION TYPES
// ============================================================================

export type ViewMode =
  | "fullFlow"
  | "phases"
  | "commands"
  | "skills"
  | "agents"
  | "mcp"
  | "gates"
  | "cheatsheet";

export interface ViewTab {
  id: ViewMode;
  icon: string;
  labelEn: string;
  labelHe: string;
}

export const VIEW_TABS: ViewTab[] = [
  {
    id: "fullFlow",
    icon: "GitBranch",
    labelEn: "Full Flow",
    labelHe: "זרימה מלאה",
  },
  { id: "phases", icon: "Layers", labelEn: "Phases", labelHe: "שלבים" },
  { id: "commands", icon: "Terminal", labelEn: "Commands", labelHe: "פקודות" },
  { id: "skills", icon: "Zap", labelEn: "Skills", labelHe: "סקילים" },
  { id: "agents", icon: "Bot", labelEn: "Agents", labelHe: "סוכנים" },
  { id: "mcp", icon: "Server", labelEn: "MCP", labelHe: "MCP" },
  { id: "gates", icon: "Shield", labelEn: "Gates", labelHe: "שערים" },
  {
    id: "cheatsheet",
    icon: "FileText",
    labelEn: "Cheatsheet",
    labelHe: "צ'יטשיט",
  },
];

export interface BreadcrumbItem {
  label: string;
  labelHe: string;
  path?: string;
  viewMode?: ViewMode;
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export interface ProgressWeights {
  phases: number;
  commands: number;
  skills: number;
  gates: number;
}

export const DEFAULT_PROGRESS_WEIGHTS: ProgressWeights = {
  phases: 0.3, // 30%
  commands: 0.25, // 25%
  skills: 0.2, // 20%
  gates: 0.25, // 25%
};

export interface ProgressData {
  total: number;
  phases: number;
  commands: number;
  skills: number;
  gates: number;
  completedItems: {
    phases: number;
    commands: number;
    skills: number;
    gates: number;
  };
  totalItems: {
    phases: number;
    commands: number;
    skills: number;
    gates: number;
  };
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export type SearchResultType =
  | "command"
  | "skill"
  | "agent"
  | "gate"
  | "mcp"
  | "phase";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  titleHe?: string;
  description: string;
  descriptionHe?: string;
  relevance: number;
  path: string[];
  category?: string;
}

export interface SearchOptions {
  query: string;
  types?: SearchResultType[];
  limit?: number;
  minRelevance?: number;
}

// ============================================================================
// COPY HISTORY TYPES
// ============================================================================

export interface CopiedItem {
  id: string;
  content: string;
  type: "command" | "code" | "text";
  label: string;
  timestamp: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export type PlatformFilter = "all" | "web" | "flutter";

export interface FilterState {
  platform: PlatformFilter;
  category: string | null;
  searchQuery: string;
  showCompleted: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TOTALS = {
  COMMANDS: 88,
  SKILLS: 58,
  GATES: 70,
  CORE_GATES: 55,
  A11Y_GATES: 15,
  AGENTS: 5,
  MCP_SERVERS: 6,
  PHASES: 6,
} as const;
