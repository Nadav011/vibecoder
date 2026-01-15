// Light mode color palette for VibeCoder
// Clean, professional light theme that works with RTL Hebrew

export const lightColors = {
  // Backgrounds - Clean whites and light grays
  bg: {
    primary: "#FAFAFA",
    secondary: "#F4F4F5",
    tertiary: "#E4E4E7",
    elevated: "#FFFFFF",
  },

  // Text colors - Dark for readability
  text: {
    primary: "#18181B",
    secondary: "#52525B",
    tertiary: "#71717A",
    muted: "#A1A1AA",
    inverse: "#FAFAFA",
  },

  // Border colors
  border: {
    default: "#E4E4E7",
    subtle: "#F4F4F5",
    hover: "#D4D4D8",
    focus: "#818CF8",
  },

  // Accent colors - Keep same as dark for consistency
  accent: {
    primary: "#6366F1", // Indigo
    primaryHover: "#4F46E5",
    primaryGlow: "rgba(99, 102, 241, 0.15)",
    success: "#22C55E", // Green
    successGlow: "rgba(34, 197, 94, 0.15)",
    warning: "#F59E0B", // Amber
    warningGlow: "rgba(245, 158, 11, 0.15)",
    error: "#EF4444", // Red
    errorGlow: "rgba(239, 68, 68, 0.15)",
  },

  // Status colors for kanban columns
  status: {
    todo: "#71717A",
    inProgress: "#F59E0B",
    complete: "#22C55E",
  },

  // Priority colors
  priority: {
    p0: "#EF4444", // Critical - Red
    p1: "#F59E0B", // High - Amber
    p2: "#6366F1", // Medium - Indigo
    p3: "#71717A", // Low - Gray
  },

  // Overlay for modals
  overlay: "rgba(0, 0, 0, 0.3)",

  // Shadows for light mode (more visible)
  shadow: {
    sm: "rgba(0, 0, 0, 0.05)",
    md: "rgba(0, 0, 0, 0.1)",
    lg: "rgba(0, 0, 0, 0.15)",
  },
} as const;

export type LightColors = typeof lightColors;
