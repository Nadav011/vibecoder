import { StyleSheet, Platform } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.modal,
  },
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
  },
  palette: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: "hidden",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.3,
          shadowRadius: 40,
          elevation: 20,
        }),
  },
  // Search styles
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  searchIcon: {
    marginEnd: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.lg,
    paddingVertical: spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  escHint: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  escText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  // List styles
  commandsList: {
    maxHeight: 400,
    paddingVertical: spacing.sm,
  },
  categorySection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  // Item styles
  commandItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginVertical: 1,
  },
  commandItemSelected: {
    backgroundColor: colors.bg.tertiary,
  },
  commandIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: spacing.md,
  },
  commandName: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.md,
  },
  commandNameSelected: {
    color: colors.accent.primary,
  },
  shortcutBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  shortcutText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
  },
  // Footer styles
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
  },
  footerHint: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerKey: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
});
