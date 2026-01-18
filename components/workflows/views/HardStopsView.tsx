import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { colors, spacing, radius, typography } from "../../../theme";
import { FadeIn, ScalePress } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { HardStop } from "../../../data/workflows";

interface HardStopsViewProps {
  hardStops: HardStop[];
  onCopyCommand: (command: string) => void;
}

export function HardStopsView({
  hardStops,
  onCopyCommand,
}: HardStopsViewProps) {
  const copyToClipboard = async (text: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.light();
    onCopyCommand(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hard Stops</Text>
      <Text style={styles.sectionSubtitle}>תנאי מעבר קריטיים - אסור לדלג!</Text>

      <View style={styles.hardStopsTable}>
        {/* Header */}
        <View style={styles.hardStopHeader}>
          <Text style={[styles.hardStopHeaderText, { flex: 1.5 }]}>אחרי</Text>
          <Text style={[styles.hardStopHeaderText, { flex: 1 }]}>בדיקה</Text>
          <Text style={[styles.hardStopHeaderText, { flex: 1 }]}>תנאי</Text>
          <Text style={[styles.hardStopHeaderText, { flex: 1.5 }]}>
            אם נכשל
          </Text>
        </View>

        {/* Rows */}
        {hardStops.map((stop, index) => (
          <FadeIn key={index} delay={100 + index * 30} direction="up">
            <View style={styles.hardStopRow}>
              <ScalePress
                onPress={() => copyToClipboard(stop.after)}
                style={[styles.hardStopCellView, { flex: 1.5 }]}
                haptic="light"
              >
                <Text style={styles.hardStopCommand}>{stop.after}</Text>
              </ScalePress>
              <View style={[styles.hardStopCellView, { flex: 1 }]}>
                <Text style={styles.hardStopCellText}>{stop.check}</Text>
              </View>
              <View style={[styles.hardStopCellView, { flex: 1 }]}>
                <Text style={styles.hardStopCellText}>{stop.condition}</Text>
              </View>
              <ScalePress
                onPress={() => copyToClipboard(stop.ifFailed)}
                style={[styles.hardStopCellView, { flex: 1.5 }]}
                haptic="light"
              >
                <Text
                  style={[
                    styles.hardStopCommand,
                    stop.ifFailed === "DO NOT COMMIT" && styles.hardStopDanger,
                  ]}
                >
                  {stop.ifFailed}
                </Text>
              </ScalePress>
            </View>
          </FadeIn>
        ))}
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
  hardStopsTable: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  hardStopHeader: {
    flexDirection: "row-reverse",
    backgroundColor: colors.bg.tertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  hardStopHeaderText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: "right",
  },
  hardStopRow: {
    flexDirection: "row-reverse",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  hardStopCellView: {
    // ViewStyle - flex is applied inline
  },
  hardStopCellText: {
    fontSize: typography.size.xs,
    color: colors.text.primary,
    textAlign: "right",
  },
  hardStopCommand: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  hardStopDanger: {
    color: colors.status.error,
    fontWeight: typography.weight.bold,
  },
});
