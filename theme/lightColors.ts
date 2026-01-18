// Light mode color palette for VibeCoder
// Clean, professional light theme that works with RTL Hebrew
// Matches the structure of colors.ts (dark mode)

export const lightColors = {
  // Backgrounds - Clean whites and light grays
  bg: {
    primary: "#FAFAFA",
    secondary: "#F4F4F5",
    tertiary: "#E4E4E7",
    elevated: "#FFFFFF",
    hover: "#D4D4D8",
  },

  // Accents - Vibrant but readable on light
  accent: {
    primary: "#6366F1", // Indigo
    primaryMuted: "#4F46E5",
    primaryGlow: "rgba(99, 102, 241, 0.15)",

    success: "#22C55E", // Green
    successMuted: "#16A34A",
    successGlow: "rgba(34, 197, 94, 0.15)",

    warning: "#F59E0B", // Amber
    warningMuted: "#D97706",
    warningGlow: "rgba(245, 158, 11, 0.15)",

    error: "#EF4444", // Red
    errorMuted: "#DC2626",

    info: "#3B82F6", // Blue
    infoMuted: "#2563EB",
    infoGlow: "rgba(59, 130, 246, 0.15)",

    muted: "#6B7280", // Neutral gray
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
    focus: "#6366F1",
  },

  // Status colors for kanban columns
  status: {
    todo: "#71717A",
    inProgress: "#F59E0B",
    complete: "#22C55E",
    // Priority status colors for analytics
    p0: "#EF4444", // Critical - red
    p1: "#F59E0B", // High - amber
    p2: "#6366F1", // Medium - indigo
    p3: "#71717A", // Low - gray
    // Success/Error states
    success: "#22C55E",
    successBg: "rgba(34, 197, 94, 0.15)",
    error: "#EF4444",
    errorBg: "rgba(239, 68, 68, 0.15)",
  },

  // Priority colors
  priority: {
    critical: "#EF4444", // P0
    high: "#F59E0B", // P1
    medium: "#6366F1", // P2
    low: "#71717A", // P3
  },

  // Gradients
  gradient: {
    primary: ["#6366F1", "#4F46E5"],
    success: ["#22C55E", "#16A34A"],
    surface: ["#F4F4F5", "#E4E4E7"],
    glow: ["rgba(99, 102, 241, 0.1)", "rgba(99, 102, 241, 0)"],
  },

  // Shadows for light mode (more visible)
  shadow: {
    sm: "rgba(0, 0, 0, 0.05)",
    md: "rgba(0, 0, 0, 0.1)",
    lg: "rgba(0, 0, 0, 0.15)",
    glow: "rgba(99, 102, 241, 0.25)",
  },

  // Overlay for modals
  overlay: {
    light: "rgba(0, 0, 0, 0.02)",
    dark: "rgba(0, 0, 0, 0.3)",
    modal: "rgba(0, 0, 0, 0.5)",
  },

  // Glass Effects
  glass: {
    bg: "rgba(0, 0, 0, 0.02)",
    bgHover: "rgba(0, 0, 0, 0.04)",
    border: "rgba(0, 0, 0, 0.06)",
    borderHover: "rgba(0, 0, 0, 0.1)",
  },
} as const;

export type LightColors = typeof lightColors;
