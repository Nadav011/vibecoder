import { StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";

export const addTaskStyles = StyleSheet.create({
  // Scroll and content layout
  scroll: {
    maxHeight: 500,
  },
  content: {
    gap: spacing.lg,
  },

  // Input with counter
  inputWithCounter: {
    position: "relative",
  },
  charCounter: {
    position: "absolute",
    bottom: spacing.sm,
    start: spacing.md,
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Sections
  section: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Priority
  priorityRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  priorityText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Labels
  labelsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  labelButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  labelText: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // AI Toggle
  aiToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  aiToggleContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  aiToggleTitle: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  aiToggleSubtitle: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.bg.elevated,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.accent.primary,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.text.muted,
  },
  toggleKnobActive: {
    backgroundColor: colors.text.primary,
    marginStart: "auto",
  },

  // Actions
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
