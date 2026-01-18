// ================================
// WORKFLOW UTILS - Helper Functions
// ================================

import {
  Command,
  Phase,
  HardStop,
  UseCase,
  ProjectFlow,
  Category,
  SkillSummary,
} from "../types";
import { PHASES } from "../phases";
import { USE_CASES } from "../use-cases";
import { PROJECT_FLOWS } from "../project-flows";
import { SKILLS_SUMMARY } from "../skills";
import { CATEGORIES } from "../categories";
import { HARD_STOPS } from "../hard-stops";

// ================================
// COMPUTED EXPORTS
// ================================

// Quick Actions - הפקודות הכי נפוצות
export const QUICK_ACTIONS: Command[] = PHASES.flatMap((phase) =>
  phase.commands.filter((cmd) => cmd.isQuickAction),
);

// כל הפקודות ברשימה אחת
export const ALL_COMMANDS: (Command & {
  phaseId?: string;
  phaseName?: string;
})[] = PHASES.flatMap((phase) =>
  phase.commands.map((cmd) => ({
    ...cmd,
    phaseId: phase.id,
    phaseName: phase.name,
  })),
);

// ספירת פקודות
export const TOTAL_COMMANDS = ALL_COMMANDS.length;

// ================================
// SEARCH FUNCTIONS
// ================================

// חיפוש פקודות
export function searchCommands(
  query: string,
): (Command & { phaseId?: string; phaseName?: string })[] {
  const lowerQuery = query.toLowerCase();
  return ALL_COMMANDS.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.flags?.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      cmd.params?.toLowerCase().includes(lowerQuery),
  );
}

// חיפוש פקודות Flutter
export function searchFlutterCommands(
  query: string,
): (Command & { phaseId?: string; phaseName?: string })[] {
  const lowerQuery = query.toLowerCase();
  return getAllFlutterCommands().filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.flags?.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      cmd.params?.toLowerCase().includes(lowerQuery),
  );
}

// ================================
// LOOKUP FUNCTIONS
// ================================

// מציאת Phase לפי ID
export function getPhaseById(id: string): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

// מציאת פקודה לפי ID
export function getCommandById(id: string): Command | undefined {
  return ALL_COMMANDS.find((c) => c.id === id);
}

// מציאת Hard Stop לפי פקודה
export function getHardStopForCommand(
  commandStr: string,
): HardStop | undefined {
  return HARD_STOPS.find((hs) => hs.after === commandStr);
}

// Get commands by category
export function getCommandsByCategory(
  categoryId: string,
): (Command & { phaseId?: string; phaseName?: string })[] {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  return ALL_COMMANDS.filter((cmd) =>
    category.commandPatterns.some(
      (pattern) => cmd.id.includes(pattern) || cmd.command.includes(pattern),
    ),
  );
}

// ================================
// BUILD FUNCTIONS
// ================================

// בניית טקסט מלא של פקודה
export function buildFullCommand(cmd: Command, withFlags = false): string {
  let text = cmd.command;

  if (withFlags && cmd.flags?.length) {
    text += ` ${cmd.flags[0]}`;
  }

  if (cmd.params) {
    text += ` ${cmd.params}`;
  }

  return text;
}

// ================================
// FLUTTER HELPER FUNCTIONS
// ================================

// קבלת כל ה-Phases של Flutter
export function getFlutterPhases(): Phase[] {
  return PHASES.filter((p) => p.id.startsWith("flutter-"));
}

// קבלת כל ה-Phases של Web
export function getWebPhases(): Phase[] {
  return PHASES.filter((p) => !p.id.startsWith("flutter-"));
}

// קבלת כל הסקילים של Flutter
export function getFlutterSkills(): SkillSummary[] {
  return SKILLS_SUMMARY.filter((s) => s.name.startsWith("FLUTTER-"));
}

// קבלת כל הסקילים של Web
export function getWebSkills(): SkillSummary[] {
  return SKILLS_SUMMARY.filter((s) => !s.name.startsWith("FLUTTER-"));
}

// בדיקה האם פקודה היא פקודת Flutter
export function isFlutterCommand(command: string): boolean {
  return command.includes("flutter") || command.startsWith("/flutter");
}

// קבלת כל ה-Use Cases של Flutter
export function getFlutterUseCases(): UseCase[] {
  return USE_CASES.filter((uc) => uc.id.startsWith("flutter-"));
}

// קבלת כל ה-Use Cases של Web
export function getWebUseCases(): UseCase[] {
  return USE_CASES.filter((uc) => !uc.id.startsWith("flutter-"));
}

// קבלת כל ה-Project Flows של Flutter
export function getFlutterProjectFlows(): ProjectFlow[] {
  return PROJECT_FLOWS.filter((pf) => pf.id.startsWith("flutter-"));
}

// קבלת כל ה-Project Flows של Web
export function getWebProjectFlows(): ProjectFlow[] {
  return PROJECT_FLOWS.filter((pf) => !pf.id.startsWith("flutter-"));
}

// קבלת כל הקטגוריות של Flutter
export function getFlutterCategories(): Category[] {
  return CATEGORIES.filter((c) => c.id.startsWith("flutter"));
}

// קבלת כל הקטגוריות של Web
export function getWebCategories(): Category[] {
  return CATEGORIES.filter((c) => !c.id.startsWith("flutter"));
}

// קבלת Quick Actions של Flutter
export function getFlutterQuickActions(): Command[] {
  return PHASES.filter((p) => p.id.startsWith("flutter-")).flatMap((phase) =>
    phase.commands.filter((cmd) => cmd.isQuickAction),
  );
}

// קבלת כל פקודות Flutter
export function getAllFlutterCommands(): (Command & {
  phaseId?: string;
  phaseName?: string;
})[] {
  return PHASES.filter((p) => p.id.startsWith("flutter-")).flatMap((phase) =>
    phase.commands.map((cmd) => ({
      ...cmd,
      phaseId: phase.id,
      phaseName: phase.name,
    })),
  );
}

// ================================
// STATISTICS
// ================================

export const FLUTTER_STATS = {
  get totalPhases() {
    return getFlutterPhases().length;
  },
  get totalSkills() {
    return getFlutterSkills().length;
  },
  get totalUseCases() {
    return getFlutterUseCases().length;
  },
  get totalProjectFlows() {
    return getFlutterProjectFlows().length;
  },
  get totalCategories() {
    return getFlutterCategories().length;
  },
  get totalCommands() {
    return getAllFlutterCommands().length;
  },
};

export const WEB_STATS = {
  get totalPhases() {
    return getWebPhases().length;
  },
  get totalSkills() {
    return getWebSkills().length;
  },
  get totalUseCases() {
    return getWebUseCases().length;
  },
  get totalProjectFlows() {
    return getWebProjectFlows().length;
  },
  get totalCategories() {
    return getWebCategories().length;
  },
  get totalCommands() {
    return ALL_COMMANDS.length - getAllFlutterCommands().length;
  },
};

export const TOTAL_STATS = {
  get totalPhases() {
    return PHASES.length;
  },
  get totalSkills() {
    return SKILLS_SUMMARY.length;
  },
  get totalUseCases() {
    return USE_CASES.length;
  },
  get totalProjectFlows() {
    return PROJECT_FLOWS.length;
  },
  get totalCategories() {
    return CATEGORIES.length;
  },
  get totalCommands() {
    return ALL_COMMANDS.length;
  },
};
