import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated";
import { haptics } from "../../utils/haptics";
import { Phase } from "../../data/workflows";

interface PhaseTabsProps {
  phases: Phase[];
  selectedPhaseId: string;
  onSelectPhase: (phaseId: string) => void;
}

export function PhaseTabs({
  phases,
  selectedPhaseId,
  onSelectPhase,
}: PhaseTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {phases.map((phase) => {
        const isSelected = phase.id === selectedPhaseId;

        return (
          <ScalePress
            key={phase.id}
            onPress={() => {
              haptics.light();
              onSelectPhase(phase.id);
            }}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
              isSelected && { borderColor: phase.color },
            ]}
          >
            <Text style={styles.phaseNumber}>{phase.number}</Text>
            <Text
              style={[styles.phaseName, isSelected && { color: phase.color }]}
            >
              {phase.nameHe}
            </Text>
          </ScalePress>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    minWidth: 70,
  },
  tabSelected: {
    backgroundColor: colors.bg.tertiary,
  },
  phaseNumber: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontWeight: typography.weight.medium,
    writingDirection: "rtl",
  },
  phaseName: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
