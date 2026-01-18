import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { Breakpoint, Device, TouchTarget } from "../../../data/workflows";

interface ResponsiveViewProps {
  breakpoints: Breakpoint[];
  devices: Device[];
  touchTargets: TouchTarget[];
  onCopyCommand: (command: string) => void;
}

export function ResponsiveView({
  breakpoints,
  devices,
  touchTargets,
  onCopyCommand,
}: ResponsiveViewProps) {
  const copyToClipboard = async (text: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.light();
    onCopyCommand(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Responsive Design</Text>
      <Text style={styles.sectionSubtitle}>
        תמיכה בכל המסכים וגדלי המכשירים
      </Text>

      {/* Breakpoints */}
      <View style={styles.responsiveSection}>
        <Text style={styles.responsiveSectionTitle}>
          Breakpoints (Tailwind)
        </Text>
        <View style={styles.breakpointsTable}>
          {/* Header */}
          <View style={styles.breakpointHeader}>
            <Text style={[styles.breakpointHeaderText, { flex: 1 }]}>שם</Text>
            <Text style={[styles.breakpointHeaderText, { flex: 1 }]}>טווח</Text>
            <Text style={[styles.breakpointHeaderText, { flex: 0.5 }]}>
              Class
            </Text>
          </View>
          {breakpoints.map((bp) => (
            <View key={bp.name} style={styles.breakpointRow}>
              <Text style={[styles.breakpointCell, { flex: 1 }]}>
                {bp.name}
              </Text>
              <Text style={[styles.breakpointCell, { flex: 1 }]}>
                {bp.minWidth}px{bp.maxWidth ? ` - ${bp.maxWidth}px` : "+"}
              </Text>
              <ScalePress
                onPress={() => copyToClipboard(`${bp.tailwindClass}:`)}
                style={styles.breakpointClassBadge}
                haptic="light"
              >
                <Text style={styles.breakpointClass}>{bp.tailwindClass}:</Text>
              </ScalePress>
            </View>
          ))}
        </View>
      </View>

      {/* Devices */}
      <View style={styles.responsiveSection}>
        <Text style={styles.responsiveSectionTitle}>מכשירים לבדיקה</Text>
        <View style={styles.devicesGrid}>
          {devices
            .filter((d) => d.required)
            .map((device) => (
              <View key={device.name} style={styles.deviceCard}>
                <Ionicons
                  name={
                    device.type === "mobile"
                      ? "phone-portrait-outline"
                      : device.type === "tablet"
                        ? "tablet-portrait-outline"
                        : "desktop-outline"
                  }
                  size={20}
                  color={
                    device.required ? colors.accent.success : colors.text.muted
                  }
                />
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceSize}>
                  {device.width}x{device.height}
                </Text>
                {device.required && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>חובה</Text>
                  </View>
                )}
              </View>
            ))}
        </View>
      </View>

      {/* Touch Targets */}
      <View style={styles.responsiveSection}>
        <Text style={styles.responsiveSectionTitle}>
          Touch Targets (נגישות)
        </Text>
        <View style={styles.touchTargetsTable}>
          <View style={styles.touchTargetHeader}>
            <Text style={[styles.touchTargetHeaderText, { flex: 1 }]}>
              אלמנט
            </Text>
            <Text style={[styles.touchTargetHeaderText, { flex: 1 }]}>
              מינימום
            </Text>
            <Text style={[styles.touchTargetHeaderText, { flex: 1 }]}>
              מומלץ
            </Text>
          </View>
          {touchTargets.map((tt) => (
            <View key={tt.element} style={styles.touchTargetRow}>
              <Text style={[styles.touchTargetCell, { flex: 1 }]}>
                {tt.element}
              </Text>
              <Text
                style={[
                  styles.touchTargetCell,
                  { flex: 1, color: colors.accent.warning },
                ]}
              >
                {tt.minimum}
              </Text>
              <Text
                style={[
                  styles.touchTargetCell,
                  { flex: 1, color: colors.accent.success },
                ]}
              >
                {tt.recommended}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  sectionSubtitle: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textAlign: "right",
    marginTop: -spacing.sm,
  },
  responsiveSection: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  responsiveSectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
  },
  breakpointsTable: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  breakpointHeader: {
    flexDirection: "row-reverse",
    backgroundColor: colors.bg.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  breakpointHeaderText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: "right",
  },
  breakpointRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  breakpointCell: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    textAlign: "right",
  },
  breakpointClassBadge: {
    backgroundColor: colors.accent.primaryGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  breakpointClass: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: typography.weight.bold,
  },
  devicesGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  deviceCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  deviceName: {
    fontSize: typography.size.xs,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    textAlign: "center",
  },
  deviceSize: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  requiredBadge: {
    backgroundColor: colors.status.successBg,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  requiredText: {
    fontSize: typography.size.xs,
    color: colors.accent.success,
    fontWeight: typography.weight.medium,
  },
  touchTargetsTable: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  touchTargetHeader: {
    flexDirection: "row-reverse",
    backgroundColor: colors.bg.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  touchTargetHeaderText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: "right",
  },
  touchTargetRow: {
    flexDirection: "row-reverse",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  touchTargetCell: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    textAlign: "right",
  },
});
