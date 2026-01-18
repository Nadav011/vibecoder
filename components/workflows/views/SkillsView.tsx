import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { FadeIn, ScalePress } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { SkillSummary, Phase } from "../../../data/workflows";

interface SkillsViewProps {
  skills: SkillSummary[];
  phases: Phase[];
  expandedSkillName: string | null;
  onExpandSkill: (skillName: string | null) => void;
  onCopyCommand: (command: string) => void;
}

export function SkillsView({
  skills,
  phases,
  expandedSkillName,
  onExpandSkill,
  onCopyCommand,
}: SkillsViewProps) {
  const copyToClipboard = async (text: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.light();
    onCopyCommand(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{skills.length} Skills</Text>
      <Text style={styles.sectionSubtitle}>
        כל הסקילים (Web + Flutter) - לחץ לפירוט מלא
      </Text>

      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => {
          const phase = phases.find(
            (p) => p.skill.toUpperCase() === skill.name.toUpperCase(),
          );
          const phaseColor = phase?.color || colors.accent.primary;
          const isExpanded = expandedSkillName === skill.name;

          return (
            <FadeIn key={skill.name} delay={100 + index * 50} direction="up">
              <View
                style={[
                  styles.skillCard,
                  isExpanded && styles.skillCardExpanded,
                  isExpanded && { borderColor: phaseColor },
                ]}
              >
                {/* Skill Header - Clickable */}
                <ScalePress
                  onPress={() => {
                    haptics.light();
                    onExpandSkill(isExpanded ? null : skill.name);
                  }}
                  style={styles.skillHeaderClickable}
                  haptic="light"
                >
                  <View style={styles.skillHeader}>
                    <View
                      style={[
                        styles.skillNumber,
                        { backgroundColor: `${phaseColor}20` },
                      ]}
                    >
                      <Text
                        style={[styles.skillNumberText, { color: phaseColor }]}
                      >
                        {skill.number}
                      </Text>
                    </View>
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <Text style={styles.skillRole}>{skill.role}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.text.muted}
                    />
                  </View>
                </ScalePress>

                <View style={styles.skillPhase}>
                  <Text style={styles.skillPhaseLabel}>Phase</Text>
                  <Text style={[styles.skillPhaseValue, { color: phaseColor }]}>
                    {skill.phase}
                  </Text>
                </View>

                {/* Key Commands (always visible) */}
                <View style={styles.skillCommands}>
                  {skill.keyCommands.map((cmd, i) => (
                    <ScalePress
                      key={i}
                      onPress={() => copyToClipboard(cmd)}
                      style={styles.skillCommandBadge}
                      haptic="light"
                    >
                      <Text style={styles.skillCommandText}>{cmd}</Text>
                    </ScalePress>
                  ))}
                </View>

                {/* Expanded: All Commands with Descriptions */}
                {isExpanded && phase && (
                  <View style={styles.skillExpandedContent}>
                    <View style={styles.skillExpandedDivider} />
                    <Text
                      style={[styles.skillExpandedTitle, { color: phaseColor }]}
                    >
                      כל הפקודות ({phase.commands.length})
                    </Text>
                    {phase.description && (
                      <Text style={styles.skillExpandedDescription}>
                        {phase.description}
                      </Text>
                    )}
                    <View style={styles.skillExpandedCommands}>
                      {phase.commands.map((cmd) => (
                        <ScalePress
                          key={cmd.id}
                          onPress={() => {
                            const fullCommand = cmd.params
                              ? `${cmd.command} ${cmd.params}`
                              : cmd.command;
                            copyToClipboard(fullCommand);
                          }}
                          style={styles.skillExpandedCommandCard}
                          haptic="light"
                        >
                          <View style={styles.skillExpandedCommandHeader}>
                            <Text
                              style={[
                                styles.skillExpandedCommandText,
                                { color: phaseColor },
                              ]}
                            >
                              {cmd.command}
                            </Text>
                            {cmd.params && (
                              <Text style={styles.skillExpandedCommandParams}>
                                {cmd.params}
                              </Text>
                            )}
                            {cmd.isQuickAction && (
                              <View style={styles.quickActionBadge}>
                                <Ionicons
                                  name="flash"
                                  size={10}
                                  color={colors.accent.warning}
                                />
                              </View>
                            )}
                          </View>
                          <Text
                            style={styles.skillExpandedCommandDesc}
                            numberOfLines={2}
                          >
                            {cmd.description}
                          </Text>
                          {cmd.output && (
                            <Text style={styles.skillExpandedCommandOutput}>
                              {cmd.output}
                            </Text>
                          )}
                        </ScalePress>
                      ))}
                    </View>

                    {/* Hard Stops for this phase */}
                    {phase.hardStops && phase.hardStops.length > 0 && (
                      <View style={styles.skillHardStops}>
                        <Text style={styles.skillHardStopsTitle}>
                          Hard Stops
                        </Text>
                        {phase.hardStops.map((stop, stopIndex) => (
                          <View
                            key={stopIndex}
                            style={styles.skillHardStopItem}
                          >
                            <Ionicons
                              name="warning"
                              size={14}
                              color={colors.accent.warning}
                            />
                            <Text style={styles.skillHardStopText}>{stop}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </FadeIn>
          );
        })}
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
  skillsGrid: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  skillCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }),
  },
  skillHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  skillNumber: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  skillNumberText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  skillInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  skillName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
  },
  skillRole: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
  },
  skillPhase: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  skillPhaseLabel: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  skillPhaseValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  skillCommands: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  skillCommandBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  skillCommandText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  skillCardExpanded: {
    borderWidth: 2,
  },
  skillHeaderClickable: {
    width: "100%",
    minHeight: 44,
  },
  skillExpandedContent: {
    marginTop: spacing.sm,
    alignItems: "stretch",
  },
  skillExpandedDivider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  skillExpandedTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    marginBottom: spacing.sm,
  },
  skillExpandedDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  skillExpandedCommands: {
    gap: spacing.md,
  },
  skillExpandedCommandCard: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: "flex-end",
    minHeight: 48,
  },
  skillExpandedCommandHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  skillExpandedCommandText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  skillExpandedCommandParams: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  skillExpandedCommandDesc: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    marginTop: spacing.xs,
    lineHeight: 16,
  },
  skillExpandedCommandOutput: {
    fontSize: typography.size.xs,
    color: colors.accent.success,
    textAlign: "right",
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
  quickActionBadge: {
    backgroundColor: `${colors.accent.warning}20`,
    padding: 2,
    borderRadius: radius.xs,
  },
  skillHardStops: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: `${colors.accent.warning}10`,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.accent.warning}30`,
  },
  skillHardStopsTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.accent.warning,
    textAlign: "right",
    marginBottom: spacing.sm,
  },
  skillHardStopItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  skillHardStopText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    flex: 1,
    lineHeight: 16,
  },
});
