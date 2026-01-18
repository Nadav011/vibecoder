/**
 * CommandPalette - Main entry point
 *
 * This file re-exports the modular command palette components from ./command-palette/
 * for backward compatibility. The actual implementation is split into:
 *
 * - CommandPaletteModal.tsx - Main modal wrapper component
 * - CommandSearch.tsx - Search input with icon
 * - CommandList.tsx - Scrollable list of grouped commands
 * - CommandItem.tsx - Individual command row
 * - CommandPaletteFooter.tsx - Keyboard hints footer
 * - useCommandPalette.ts - Hook for search, selection, keyboard navigation
 * - createDefaultCommands.ts - Factory function for default commands
 * - types.ts - TypeScript interfaces and types
 * - commandPaletteStyles.ts - Shared styles
 * - index.ts - Barrel exports
 */

// Re-export main component with original name for backward compatibility
export { CommandPaletteModal as CommandPalette } from "./command-palette";

// Re-export types
export type { Command, CommandPaletteProps } from "./command-palette";

// Re-export factory function
export { createDefaultCommands } from "./command-palette";
