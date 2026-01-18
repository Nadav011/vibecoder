import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";
import type { Phase } from "../../../data/workflows";

interface FullFlowViewProps {
  phases: Phase[];
  expandedPhaseId: string | null;
  onExpandPhase: (phaseId: string | null) => void;
  onCopyCommand: (command: string) => void;
  platformFilter: "all" | "web" | "flutter";
}

export function FullFlowView({
  phases,
  expandedPhaseId,
  onExpandPhase,
  onCopyCommand,
  platformFilter,
}: FullFlowViewProps) {
  const handleCopyCommand = async (command: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(command);
    }
    haptics.light();
    onCopyCommand(command);
  };

  return (
    <FadeIn delay={50} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {platformFilter === "flutter"
            ? "זרימת Flutter"
            : platformFilter === "web"
              ? "זרימת Web"
              : "הזרימה המלאה"}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {phases.length} שלבים{" "}
          {platformFilter === "all"
            ? "(Web + Flutter)"
            : platformFilter === "flutter"
              ? "לפיתוח מובייל"
              : "לפיתוח Web"}
        </Text>

        <View style={styles.fullFlowContainer}>
          {phases.map((phase, phaseIndex) => (
            <FadeIn key={phase.id} delay={100 + phaseIndex * 50} direction="up">
              <View style={styles.fullFlowPhase}>
                {/* Phase Header */}
                <View style={styles.fullFlowPhaseHeader}>
                  <View
                    style={[
                      styles.fullFlowPhaseIcon,
                      { backgroundColor: `${phase.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={phase.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={phase.color}
                    />
                  </View>
                  <View style={styles.fullFlowPhaseInfo}>
                    <Text style={styles.fullFlowPhaseNumber}>
                      Phase {phase.number}
                    </Text>
                    <Text style={styles.fullFlowPhaseName}>{phase.name}</Text>
                    <Text style={styles.fullFlowPhaseSkill}>{phase.skill}</Text>
                  </View>
                  {phase.id === "phase-boot" && (
                    <View style={styles.requiredBadgeLarge}>
                      <Text style={styles.requiredTextLarge}>חובה!</Text>
                    </View>
                  )}
                </View>

                {/* Phase Description */}
                {phase.description && (
                  <Text style={styles.fullFlowPhaseDescription}>
                    {phase.description}
                  </Text>
                )}

                {/* Quick Commands */}
                <View style={styles.fullFlowCommands}>
                  {(expandedPhaseId === phase.id
                    ? phase.commands
                    : phase.commands.slice(0, 4)
                  ).map((cmd) => (
                    <ScalePress
                      key={cmd.id}
                      onPress={() => handleCopyCommand(cmd.command)}
                      style={[
                        styles.fullFlowCommandBadge,
                        { borderColor: `${phase.color}40` },
                      ]}
                      haptic="light"
                    >
                      <Text
                        style={[
                          styles.fullFlowCommandText,
                          { color: phase.color },
                        ]}
                      >
                        {cmd.command}
                      </Text>
                    </ScalePress>
                  ))}
                  {phase.commands.length > 4 && (
                    <ScalePress
                      onPress={() => {
                        haptics.light();
                        onExpandPhase(
                          expandedPhaseId === phase.id ? null : phase.id,
                        );
                      }}
                      style={styles.fullFlowMoreButton}
                      haptic="light"
                    >
                      <Text style={styles.fullFlowMoreCommands}>
                        {expandedPhaseId === phase.id
                          ? "הסתר"
                          : `+${phase.commands.length - 4} עוד`}
                      </Text>
                      <Ionicons
                        name={
                          expandedPhaseId === phase.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={12}
                        color={colors.text.muted}
                      />
                    </ScalePress>
                  )}
                </View>

                {/* Hard Stops Warning */}
                {phase.hardStops && phase.hardStops.length > 0 && (
                  <View style={styles.fullFlowHardStops}>
                    <Ionicons
                      name="warning"
                      size={12}
                      color={colors.status.error}
                    />
                    <Text style={styles.fullFlowHardStopText}>
                      {phase.hardStops[0]}
                    </Text>
                  </View>
                )}

                {/* Arrow to next phase */}
                {phaseIndex < phases.length - 1 && (
                  <View style={styles.fullFlowArrow}>
                    <Ionicons
                      name="arrow-down"
                      size={20}
                      color={colors.text.muted}
                    />
                  </View>
                )}
              </View>
            </FadeIn>
          ))}
        </View>
      </View>
    </FadeIn>
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
  fullFlowContainer: {
    gap: spacing.sm,
  },
  fullFlowPhase: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  fullFlowPhaseHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  fullFlowPhaseIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fullFlowPhaseInfo: {
    flex: 1,
  },
  fullFlowPhaseNumber: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
  },
  fullFlowPhaseName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  fullFlowPhaseSkill: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
  },
  fullFlowPhaseDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    marginEnd: 52,
  },
  fullFlowCommands: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginEnd: 52,
  },
  fullFlowCommandBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    backgroundColor: colors.bg.tertiary,
  },
  fullFlowCommandText: {
    fontSize: typography.size.xs,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: typography.weight.medium,
  },
  fullFlowMoreButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
  },
  fullFlowMoreCommands: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  fullFlowHardStops: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    marginEnd: 52,
    backgroundColor: colors.status.errorBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: "flex-end",
  },
  fullFlowHardStopText: {
    fontSize: typography.size.xs,
    color: colors.status.error,
  },
  fullFlowArrow: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  requiredBadgeLarge: {
    backgroundColor: colors.status.errorBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  requiredTextLarge: {
    fontSize: typography.size.xs,
    color: colors.status.error,
    fontWeight: typography.weight.bold,
  },
});
