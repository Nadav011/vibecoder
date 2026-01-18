// Main component
export { CommandPaletteModal } from "./CommandPaletteModal";

// Sub-components
export { CommandSearch } from "./CommandSearch";
export { CommandList } from "./CommandList";
export { CommandItem } from "./CommandItem";
export { CommandPaletteFooter } from "./CommandPaletteFooter";

// Hook
export { useCommandPalette } from "./useCommandPalette";

// Factory function
export { createDefaultCommands } from "./createDefaultCommands";

// Types
export type {
  Command,
  CommandCategory,
  CommandPaletteProps,
  CommandSearchProps,
  CommandListProps,
  CommandItemProps,
  CreateDefaultCommandsActions,
} from "./types";

export { CATEGORY_LABELS, CATEGORY_ORDER } from "./types";

// Styles
export { styles as commandPaletteStyles } from "./commandPaletteStyles";
