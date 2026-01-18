// ================================
// WORKFLOWS - Legacy Export (Backward Compatibility)
// ================================
// This file maintains backward compatibility by re-exporting from modular structure
// The actual data is now organized in data/workflows/ directory:
// - types.ts - TypeScript interfaces
// - phases/ - Web and Flutter phases
// - use-cases.ts - Usage templates
// - project-flows.ts - Step-by-step project flows
// - skills.ts - Skills summary
// - categories.ts - Command categories
// - plugins.ts - Plugins/integrations
// - hard-stops.ts - Hard stops definitions
// - responsive.ts - Breakpoints, devices, touch targets
// - utils/ - Helper functions and computed values

// Re-export everything from modular structure
export * from "./workflows/index";
