import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Modal } from "../ui/Modal";
import { colors, spacing, radius, typography } from "../../theme";
import { FadeIn } from "../animated";
import {
  KeyboardShortcut,
  formatShortcut,
  shortcutsAvailable,
} from "../../hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
  visible: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

// Group shortcuts by category
const CATEGORIES = {
  navigation: {
    title: "ניווט",
    keys: ["1", "2", "3"],
  },
  actions: {
    title: "פעולות",
    keys: ["k", "n", "f", "p", "e", "z"],
  },
  other: {
    title: "אחר",
    keys: ["d", "Escape", "?"],
  },
};

export function KeyboardShortcutsModal({
  visible,
  onClose,
  shortcuts,
}: KeyboardShortcutsModalProps) {
  if (!shortcutsAvailable) return null;

  // Group shortcuts
  const groupedShortcuts = {
    navigation: shortcuts.filter((s) =>
      CATEGORIES.navigation.keys.includes(s.key),
    ),
    actions: shortcuts.filter((s) => CATEGORIES.actions.keys.includes(s.key)),
    other: shortcuts.filter((s) => CATEGORIES.other.keys.includes(s.key)),
  };

  return (
    <Modal visible={visible} onClose={onClose} title="קיצורי מקלדת">
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Platform indicator */}
          <FadeIn delay={0} direction="up">
            <View style={styles.platformBadge}>
              <Text style={styles.platformText}>
                {Platform.OS === "web" && typeof navigator !== "undefined"
                  ? navigator.platform.includes("Mac")
                    ? "Mac"
                    : "Windows/Linux"
                  : "Web"}
              </Text>
            </View>
          </FadeIn>

          {/* Navigation shortcuts */}
          {groupedShortcuts.navigation.length > 0 && (
            <FadeIn delay={50} direction="up">
              <ShortcutSection
                title={CATEGORIES.navigation.title}
                shortcuts={groupedShortcuts.navigation}
              />
            </FadeIn>
          )}

          {/* Action shortcuts */}
          {groupedShortcuts.actions.length > 0 && (
            <FadeIn delay={100} direction="up">
              <ShortcutSection
                title={CATEGORIES.actions.title}
                shortcuts={groupedShortcuts.actions}
              />
            </FadeIn>
          )}

          {/* Other shortcuts */}
          {groupedShortcuts.other.length > 0 && (
            <FadeIn delay={150} direction="up">
              <ShortcutSection
                title={CATEGORIES.other.title}
                shortcuts={groupedShortcuts.other}
              />
            </FadeIn>
          )}

          {/* Tip */}
          <FadeIn delay={200} direction="up">
            <View style={styles.tip}>
              <Text style={styles.tipText}>
                לחץ על ? בכל מקום כדי להציג את החלון הזה
              </Text>
            </View>
          </FadeIn>
        </View>
      </ScrollView>
    </Modal>
  );
}

interface ShortcutSectionProps {
  title: string;
  shortcuts: KeyboardShortcut[];
}

function ShortcutSection({ title, shortcuts }: ShortcutSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.shortcutsList}>
        {shortcuts.map((shortcut, index) => (
          <View key={index} style={styles.shortcutRow}>
            <Text style={styles.shortcutDesc}>{shortcut.descriptionHe}</Text>
            <View style={styles.keyBadge}>
              <Text style={styles.keyText}>{formatShortcut(shortcut)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 450,
  },
  content: {
    gap: spacing.lg,
  },
  platformBadge: {
    alignSelf: "flex-end",
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  platformText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
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
  shortcutsList: {
    gap: spacing.sm,
  },
  shortcutRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  shortcutDesc: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    textAlign: "right",
    writingDirection: "rtl",
    flex: 1,
  },
  keyBadge: {
    backgroundColor: colors.bg.elevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    minWidth: 60,
    alignItems: "center",
  },
  keyText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  tip: {
    padding: spacing.md,
    backgroundColor: colors.accent.primaryGlow,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  tipText: {
    color: colors.accent.primary,
    fontSize: typography.size.sm,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
