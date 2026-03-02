// ============================================
// VIBECODER - Design DNA Configuration
// APEX-UI Standard Compliant
// ============================================

/**
 * Spring physics configuration for animations
 * Based on APEX standard: mass:1, tension:170, friction:26
 * Translated to react-native-reanimated spring config
 */
export const SPRING_CONFIG = {
  // Default spring (balanced)
  default: {
    mass: 1,
    damping: 26,
    stiffness: 170,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
  // Snappy spring (faster response)
  snappy: {
    mass: 1,
    damping: 20,
    stiffness: 400,
    overshootClamping: false,
  },
  // Gentle spring (slower, more elegant)
  gentle: {
    mass: 1,
    damping: 30,
    stiffness: 100,
    overshootClamping: false,
  },
  // Bouncy spring (playful)
  bouncy: {
    mass: 1,
    damping: 12,
    stiffness: 180,
    overshootClamping: false,
  },
  // Press feedback spring (for ScalePress)
  press: {
    mass: 1,
    damping: 15,
    stiffness: 400,
    overshootClamping: true,
  },
} as const;

/**
 * Duration presets for timing animations (when spring is not applicable)
 * Use sparingly - prefer spring physics
 */
export const DURATION = {
  instant: 100,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
} as const;

/**
 * Design DNA - Visual Identity
 */
export const DESIGN_DNA = {
  // Personality: tech-focused, professional, minimal
  personality: "tech-professional" as const,

  // Motion philosophy: spring-based, natural feeling
  motion: {
    spring: SPRING_CONFIG,
    duration: DURATION,
    // Prefer spring over timing
    preferSpring: true,
  },

  // Distinctiveness score (target: 85+)
  // Higher = more unique visual identity
  distinctiveness: 85,

  // Typography identity
  typography: {
    // Primary display font
    display: "system", // Using system fonts for performance
    // Code/mono font
    mono: "monospace",
    // Hebrew-first: RTL optimized
    direction: "rtl",
  },

  // Color identity
  colors: {
    // Primary accent: Soft Indigo (not generic blue)
    primary: "#818CF8",
    // Secondary: Mint Green (not generic green)
    success: "#34D399",
    // Warning: Warm Amber (not harsh yellow)
    warning: "#FBBF24",
    // Error: Soft Red (not harsh)
    error: "#F87171",
    // Dark mode base: True black with warmth
    background: "#09090B",
  },

  // Grid system
  grid: {
    base: 8, // 8pt grid
    columns: 12,
    gutter: 16,
  },

  // Radius philosophy: rounded but not pill-shaped
  radius: {
    philosophy: "soft-corners",
    primary: 12, // lg
    secondary: 8, // md
  },

  // Performance targets (APEX standard)
  performance: {
    fpsTarget: 144,
    fpsMinimum: 60,
    inputLatencyMax: 100, // ms
  },

  // Accessibility targets (WCAG AAA)
  accessibility: {
    standard: "WCAG-AAA",
    contrastMinimum: 7, // 7:1 ratio
    touchTargetMinimum: 44, // 44x44 points
  },
} as const;

export type DesignDNA = typeof DESIGN_DNA;
export type SpringConfig = keyof typeof SPRING_CONFIG;
