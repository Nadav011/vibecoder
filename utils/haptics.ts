import * as Haptics from "expo-haptics";

export const haptics = {
  // Light tap - for selections, toggles
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Medium tap - for confirmations, drag start
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  // Heavy tap - for deletions, major actions
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  // Success - task completion
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning - attention needed
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  // Error - action failed
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  // Selection change
  selection: () => Haptics.selectionAsync(),
};
