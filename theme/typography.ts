// ============================================
// VIBECODER - Typography System
// JetBrains Mono + System - Developer-focused
// ============================================

import { Platform } from "react-native";

// Font families
export const fonts = {
  // Monospace for code-like elements (titles, counts)
  mono: Platform.select({
    ios: "JetBrainsMono-Regular",
    android: "JetBrainsMono-Regular",
    default: "monospace",
  }),
  monoBold: Platform.select({
    ios: "JetBrainsMono-Bold",
    android: "JetBrainsMono-Bold",
    default: "monospace",
  }),
  monoMedium: Platform.select({
    ios: "JetBrainsMono-Medium",
    android: "JetBrainsMono-Medium",
    default: "monospace",
  }),

  // System for body text (readable)
  body: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "System",
  }),
} as const;

export const typography = {
  // Font sizes - Modular scale (1.2 ratio)
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 26,
    xxxl: 32,
    display: 40,
  },

  // Font weights
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -1,
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    mono: 0.5, // For monospace fonts
  },

  // Pre-composed text styles
  styles: {
    // Display - Hero text
    display: {
      fontSize: 40,
      fontWeight: "700" as const,
      lineHeight: 1.1,
      letterSpacing: -1,
    },

    // Headings
    h1: {
      fontSize: 32,
      fontWeight: "700" as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 26,
      fontWeight: "600" as const,
      lineHeight: 1.25,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 22,
      fontWeight: "600" as const,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: "600" as const,
      lineHeight: 1.35,
    },

    // Body text
    bodyLarge: {
      fontSize: 18,
      fontWeight: "400" as const,
      lineHeight: 1.5,
    },
    body: {
      fontSize: 15,
      fontWeight: "400" as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: "400" as const,
      lineHeight: 1.5,
    },

    // UI text
    label: {
      fontSize: 13,
      fontWeight: "500" as const,
      lineHeight: 1.2,
      letterSpacing: 0.25,
    },
    caption: {
      fontSize: 11,
      fontWeight: "400" as const,
      lineHeight: 1.35,
    },

    // Monospace (code-like)
    mono: {
      fontSize: 13,
      fontWeight: "400" as const,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },
    monoLarge: {
      fontSize: 15,
      fontWeight: "500" as const,
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
  },

  fonts,
} as const;

export type Typography = typeof typography;
