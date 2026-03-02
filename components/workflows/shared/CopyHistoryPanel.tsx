import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";

interface CopyHistoryPanelProps {
  recentCopies: string[];
  onCopyAgain: (text: string) => void;
  onClear: () => void;
  maxItems?: number;
}

export function CopyHistoryPanel({
  recentCopies,
  onCopyAgain,
  onClear,
  maxItems = 10,
}: CopyHistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const displayItems = recentCopies.slice(0, maxItems);

  const handleCopy = async (text: string, index: number) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.success();
    setCopiedIndex(index);
    onCopyAgain(text);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Don't show if no history
  if (recentCopies.length === 0) return null;

  return (
    <>
      {/* Floating Action Button */}
      <ScalePress
        onPress={() => setIsOpen(true)}
        style={styles.fab}
        haptic="medium"
        accessibilityRole="button"
        accessibilityLabel={`היסטוריית העתקות: ${recentCopies.length} פריטים`}
      >
        <View style={styles.fabContent}>
          <Ionicons name="clipboard" size={20} color={colors.text.primary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Math.min(recentCopies.length, 99)}
            </Text>
          </View>
        </View>
      </ScalePress>

      {/* History Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <ScalePress
          onPress={() => setIsOpen(false)}
          style={styles.modalOverlay}
          haptic="none"
        >
          <View />
        </ScalePress>

        <View style={styles.modalContent}>
          <FadeIn direction="up" distance={30}>
            <View style={styles.panel}>
              {/* Header */}
              <View style={styles.panelHeader}>
                <View style={styles.headerTitleRow}>
                  <Ionicons
                    name="clipboard-outline"
                    size={18}
                    color={colors.accent.primary}
                  />
                  <Text style={styles.panelTitle}>העתקות אחרונות</Text>
                </View>
                <View style={styles.headerActions}>
                  {recentCopies.length > 0 && (
                    <ScalePress
                      onPress={onClear}
                      style={styles.clearButton}
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel="נקה היסטוריה"
                    >
                      <Text style={styles.clearText}>נקה</Text>
                    </ScalePress>
                  )}
                  <ScalePress
                    onPress={() => setIsOpen(false)}
                    style={styles.closeButton}
                    haptic="light"
                    accessibilityRole="button"
                    accessibilityLabel="סגור"
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={colors.text.secondary}
                    />
                  </ScalePress>
                </View>
              </View>

              {/* History List */}
              <ScrollView
                style={styles.historyList}
                showsVerticalScrollIndicator={false}
              >
                {displayItems.map((item, index) => {
                  const isCopied = copiedIndex === index;
                  const displayText =
                    item.length > 60 ? item.slice(0, 60) + "..." : item;
                  const isMultiline = item.includes("\n");

                  return (
                    <ScalePress
                      key={`${item}-${index}`}
                      onPress={() => handleCopy(item, index)}
                      style={[
                        styles.historyItem,
                        isCopied && styles.historyItemCopied,
                      ]}
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={isCopied ? "הועתק" : "לחץ להעתקה"}
                    >
                      <View style={styles.historyItemContent}>
                        <Text style={styles.historyItemText} numberOfLines={2}>
                          {displayText}
                        </Text>
                        {isMultiline && (
                          <View style={styles.multilineBadge}>
                            <Ionicons
                              name="layers-outline"
                              size={10}
                              color={colors.text.muted}
                            />
                            <Text style={styles.multilineText}>רב-שורתי</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.copyIcon}>
                        <Ionicons
                          name={isCopied ? "checkmark" : "copy-outline"}
                          size={16}
                          color={
                            isCopied
                              ? colors.status.success
                              : colors.text.secondary
                          }
                        />
                      </View>
                    </ScalePress>
                  );
                })}
              </ScrollView>

              {/* Footer */}
              <View style={styles.panelFooter}>
                <Text style={styles.footerText}>
                  {recentCopies.length} פריטים בהיסטוריה
                </Text>
              </View>
            </View>
          </FadeIn>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: spacing.xxl,
    start: spacing.md,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: colors.shadow.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100,
  },
  fabContent: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    end: -8,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.accent.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.modal,
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    start: 0,
    end: 0,
    maxHeight: "70%",
  },
  panel: {
    backgroundColor: colors.bg.secondary,
    borderTopStartRadius: radius.xl,
    borderTopEndRadius: radius.xl,
    paddingTop: spacing.md,
    maxHeight: 500,
  },
  panelHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  headerTitleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  panelTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  headerActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  clearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.status.errorBg,
  },
  clearText: {
    fontSize: typography.size.xs,
    color: colors.status.error,
    fontWeight: typography.weight.medium,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  historyList: {
    padding: spacing.md,
    maxHeight: 350,
  },
  historyItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  historyItemCopied: {
    backgroundColor: colors.status.successBg,
    borderColor: colors.status.success,
  },
  historyItemContent: {
    flex: 1,
    gap: spacing.xs,
  },
  historyItemText: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  multilineBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 2,
  },
  multilineText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  copyIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bg.elevated,
    alignItems: "center",
    justifyContent: "center",
    marginStart: spacing.sm,
  },
  panelFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
