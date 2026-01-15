// ============================================
// VIBECODER - Premium Color System
// Refined Dark Mode for Vibe Coders
// ============================================

export const colors = {
  // Backgrounds - Deep, rich blacks with subtle warmth
  bg: {
    primary: "#09090B", // True black with hint of warmth
    secondary: "#121214", // Elevated surfaces
    tertiary: "#1A1A1D", // Cards and containers
    elevated: "#222225", // Interactive elements
    hover: "#2A2A2D", // Hover states
  },

  // Accents - Vibrant but refined
  accent: {
    primary: "#818CF8", // Soft indigo (less harsh than pure)
    primaryMuted: "#6366F1", // Deeper indigo
    primaryGlow: "rgba(129, 140, 248, 0.15)", // Glow effect

    success: "#34D399", // Mint green (softer)
    successMuted: "#10B981",
    successGlow: "rgba(52, 211, 153, 0.15)",

    warning: "#FBBF24", // Warm amber
    warningMuted: "#F59E0B",
    warningGlow: "rgba(251, 191, 36, 0.15)",

    error: "#F87171", // Soft red
    errorMuted: "#EF4444",

    info: "#60A5FA", // Light blue
    infoMuted: "#3B82F6",
    infoGlow: "rgba(96, 165, 250, 0.15)",

    muted: "#6B7280", // Neutral gray
  },

  // Text - Clear hierarchy with warmth
  text: {
    primary: "#FAFAFA", // Pure white
    secondary: "#A1A1AA", // Muted
    tertiary: "#71717A", // Even more muted
    muted: "#52525B", // Disabled
    inverse: "#09090B", // On light backgrounds
  },

  // Borders - Subtle but defined
  border: {
    default: "#27272A",
    subtle: "#1F1F22",
    hover: "#3F3F46",
    focus: "#818CF8", // Primary on focus
  },

  // Status colors - Semantic meaning
  status: {
    todo: "#6B7280", // Neutral gray
    inProgress: "#FBBF24", // Warm amber
    complete: "#34D399", // Mint green
    // Priority status colors for analytics
    p0: "#F87171", // Critical - red
    p1: "#FBBF24", // High - amber
    p2: "#818CF8", // Medium - indigo
    p3: "#6B7280", // Low - gray
    // Success/Error states
    success: "#34D399",
    successBg: "rgba(52, 211, 153, 0.15)",
    error: "#F87171",
    errorBg: "rgba(248, 113, 113, 0.15)",
  },

  // Priority colors - Clear differentiation
  priority: {
    critical: "#F87171", // P0
    high: "#FBBF24", // P1
    medium: "#818CF8", // P2
    low: "#6B7280", // P3
  },

  // Gradients - Subtle, not flashy
  gradient: {
    primary: ["#818CF8", "#6366F1"],
    success: ["#34D399", "#10B981"],
    surface: ["#1A1A1D", "#121214"],
    glow: ["rgba(129, 140, 248, 0.1)", "rgba(129, 140, 248, 0)"],
  },

  // Shadows - Depth without harshness
  shadow: {
    sm: "rgba(0, 0, 0, 0.3)",
    md: "rgba(0, 0, 0, 0.4)",
    lg: "rgba(0, 0, 0, 0.5)",
    glow: "rgba(129, 140, 248, 0.25)",
  },

  // Overlay
  overlay: {
    light: "rgba(255, 255, 255, 0.05)",
    dark: "rgba(0, 0, 0, 0.5)",
    modal: "rgba(0, 0, 0, 0.8)",
  },

  // Glass Effects - Premium UI
  glass: {
    bg: "rgba(255, 255, 255, 0.03)",
    bgHover: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.15)",
  },
} as const;

export type Colors = typeof colors;
