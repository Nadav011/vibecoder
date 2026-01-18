import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../../theme";
import { ScalePress } from "../animated/ScalePress";

export interface UpdateBannerProps {
  visible: boolean;
  version: string;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateBanner({
  visible,
  version,
  onUpdate,
  onDismiss,
}: UpdateBannerProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.updateBanner, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.updateContent}>
        <Ionicons
          name="refresh-circle"
          size={24}
          color={colors.accent.primary}
        />
        <View style={styles.updateTextContainer}>
          <Text style={styles.updateTitle}>עדכון חדש זמין!</Text>
          <Text style={styles.updateVersion}>גרסה {version}</Text>
        </View>
      </View>
      <View style={styles.updateButtons}>
        <ScalePress
          onPress={onDismiss}
          style={styles.updateDismissButton}
          haptic="light"
        >
          <Text style={styles.updateDismissText}>אחר כך</Text>
        </ScalePress>
        <ScalePress
          onPress={onUpdate}
          style={styles.updateButton}
          haptic="medium"
        >
          <Text style={styles.updateButtonText}>עדכן עכשיו</Text>
        </ScalePress>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  updateBanner: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    backgroundColor: colors.bg.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }),
  },
  updateContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  updateTextContainer: {
    alignItems: "flex-end",
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  updateVersion: {
    fontSize: 12,
    color: colors.text.muted,
  },
  updateButtons: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  updateButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  updateButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  updateDismissButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  updateDismissText: {
    fontSize: 13,
    color: colors.text.muted,
  },
});
