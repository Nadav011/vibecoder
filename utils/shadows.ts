import { Platform, ViewStyle } from "react-native";
import { colors } from "../theme";

/**
 * Cross-platform shadow utilities
 * Handles Platform.OS differences between web (boxShadow) and native (shadowColor, etc.)
 */

type ShadowLevel = "sm" | "md" | "lg" | "xl" | "glow";

interface ShadowConfig {
  offsetY: number;
  blur: number;
  opacity: number;
  elevation: number;
}

const SHADOW_CONFIGS: Record<ShadowLevel, ShadowConfig> = {
  sm: { offsetY: 2, blur: 8, opacity: 0.2, elevation: 4 },
  md: { offsetY: 4, blur: 12, opacity: 0.25, elevation: 8 },
  lg: { offsetY: 8, blur: 24, opacity: 0.3, elevation: 16 },
  xl: { offsetY: 20, blur: 40, opacity: 0.3, elevation: 20 },
  glow: { offsetY: 4, blur: 8, opacity: 0.3, elevation: 8 },
};

/**
 * Creates cross-platform shadow styles
 * @param level - Shadow intensity level
 * @param color - Optional custom shadow color (defaults to black, or primary for glow)
 */
export function createShadow(level: ShadowLevel, color?: string): ViewStyle {
  const config = SHADOW_CONFIGS[level];
  const shadowColor =
    color ?? (level === "glow" ? colors.accent.primary : "#000");

  if (Platform.OS === "web") {
    const rgba =
      level === "glow"
        ? `${shadowColor}4D` // 30% opacity in hex
        : `rgba(0, 0, 0, ${config.opacity})`;
    return {
      boxShadow: `0px ${config.offsetY}px ${config.blur}px ${rgba}`,
    } as ViewStyle;
  }

  return {
    shadowColor,
    shadowOffset: { width: 0, height: config.offsetY },
    shadowOpacity: config.opacity,
    shadowRadius: config.blur,
    elevation: config.elevation,
  };
}

/**
 * Pre-built shadow styles for common use cases
 */
export const shadows = {
  /** Small shadow - for cards, buttons */
  sm: createShadow("sm"),

  /** Medium shadow - for elevated content */
  md: createShadow("md"),

  /** Large shadow - for modals, overlays */
  lg: createShadow("lg"),

  /** Extra large shadow - for command palette, dropdowns */
  xl: createShadow("xl"),

  /** Glow effect - for accent elements */
  glow: createShadow("glow"),

  /** Active state glow with primary color */
  activeGlow: createShadow("glow", colors.accent.primary),
} as const;

/**
 * Creates a custom shadow with specific CSS/native values
 * For cases where the preset shadows don't fit
 */
export function customShadow(params: {
  offsetX?: number;
  offsetY: number;
  blur: number;
  spread?: number;
  color: string;
  opacity: number;
  elevation?: number;
}): ViewStyle {
  const {
    offsetX = 0,
    offsetY,
    blur,
    spread = 0,
    color,
    opacity,
    elevation = 8,
  } = params;

  if (Platform.OS === "web") {
    const rgba = color.startsWith("rgba") ? color : `rgba(0, 0, 0, ${opacity})`;
    return {
      boxShadow: spread
        ? `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`
        : `${offsetX}px ${offsetY}px ${blur}px ${rgba}`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation,
  };
}
