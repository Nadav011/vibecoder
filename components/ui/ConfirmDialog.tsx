import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "אישור",
  cancelLabel = "ביטול",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    haptics.warning();
    onConfirm();
  };

  const handleCancel = () => {
    haptics.light();
    onCancel();
  };

  const iconName: keyof typeof Ionicons.glyphMap =
    variant === "danger"
      ? "alert-circle"
      : variant === "warning"
        ? "warning"
        : "information-circle";

  const iconColor =
    variant === "danger"
      ? colors.priority.critical
      : variant === "warning"
        ? colors.accent.warning
        : colors.accent.info;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable
        onPress={handleCancel}
        style={styles.overlay}
        accessibilityRole="button"
        accessibilityLabel="סגור דיאלוג"
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <FadeIn delay={0} direction="up">
            <View
              style={styles.content}
              accessibilityRole="alert"
              accessibilityLabel={`${title}: ${message}`}
              accessibilityViewIsModal={true}
              accessibilityLiveRegion="assertive"
            >
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={48} color={iconColor} />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.actions}>
                <ScalePress
                  onPress={handleCancel}
                  style={styles.cancelButton}
                  haptic="none"
                  accessibilityRole="button"
                  accessibilityLabel={cancelLabel}
                >
                  <Text style={styles.cancelText}>{cancelLabel}</Text>
                </ScalePress>

                <ScalePress
                  onPress={handleConfirm}
                  style={[
                    styles.confirmButton,
                    variant === "danger" && styles.dangerButton,
                    variant === "warning" && styles.warningButton,
                  ]}
                  haptic="none"
                  accessibilityRole="button"
                  accessibilityLabel={confirmLabel}
                >
                  <Text style={styles.confirmText}>{confirmLabel}</Text>
                </ScalePress>
              </View>
            </View>
          </FadeIn>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.modal,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  content: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: 320,
    maxWidth: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
          elevation: 16,
        }),
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: typography.size.md * 1.5,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    alignItems: "center",
  },
  cancelText: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: colors.priority.critical,
  },
  warningButton: {
    backgroundColor: colors.accent.warning,
  },
  confirmText: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
});
