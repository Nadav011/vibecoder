/**
 * RTL Utilities for Hebrew Interface
 *
 * Use these utilities to ensure consistent RTL behavior
 * across all components.
 */
import { I18nManager, TextStyle, ViewStyle } from "react-native";

// App is always RTL for Hebrew
export const isRTL = true;

// Common RTL text style - use for all text elements
export const rtlTextStyle: TextStyle = {
  textAlign: "right",
  writingDirection: "rtl",
};

// RTL view style - use for containers that need explicit RTL
export const rtlViewStyle: ViewStyle = {
  direction: "rtl",
};

// Flip direction for row layouts (if needed)
export const rtlRowStyle: ViewStyle = {
  flexDirection: "row-reverse",
};

/**
 * Get RTL-aware position value
 * Use instead of left/right for positioning
 */
export const getPosition = (
  ltr: number,
  rtl?: number,
): { start: number } | { end: number } => {
  if (isRTL) {
    return { end: rtl ?? ltr };
  }
  return { start: ltr };
};

/**
 * Ensure I18nManager is configured for RTL
 * Call this at app startup
 */
export const ensureRTL = () => {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
};
