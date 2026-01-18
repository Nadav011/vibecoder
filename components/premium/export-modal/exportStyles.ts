import { StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";

export const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Format selector styles
  formatOptions: {
    gap: spacing.sm,
  },
  formatOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    gap: spacing.md,
  },
  formatOptionActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primaryGlow,
  },
  formatLabel: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    minWidth: 80,
    textAlign: "right",
    writingDirection: "rtl",
  },
  formatLabelActive: {
    color: colors.accent.primary,
  },
  formatDesc: {
    flex: 1,
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Checkbox styles
  checkboxList: {
    gap: spacing.sm,
  },
  checkboxOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  checkboxLabel: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Warning styles
  warning: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.accent.warningGlow,
    borderRadius: radius.md,
  },
  warningText: {
    color: colors.accent.warning,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Success message styles
  successMessage: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.status.successBg,
    borderRadius: radius.md,
  },
  successText: {
    color: colors.accent.success,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Error message styles
  errorMessage: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.priority.critical + "15",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.priority.critical + "30",
  },
  errorText: {
    flex: 1,
    color: colors.priority.critical,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Actions styles
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
