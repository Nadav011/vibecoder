import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";
import type { ProjectFlow, UseCase, Phase } from "../../../data/workflows";

interface UseCasesViewProps {
  projectFlows: ProjectFlow[];
  useCases: UseCase[];
  phases: Phase[];
  onCopyCommand: (command: string) => void;
  onCopyUseCase: (useCase: UseCase) => void;
}

export function UseCasesView({
  projectFlows,
  useCases,
  phases,
  onCopyCommand,
  onCopyUseCase,
}: UseCasesViewProps) {
  const handleCopyCommand = async (command: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(command);
    }
    haptics.success();
    onCopyCommand(command);
  };

  // Filter out project flow use cases (they are shown in the main flows section)
  const quickTemplates = useCases.filter(
    (uc) =>
      uc.id !== "new-project" &&
      uc.id !== "existing-project" &&
      uc.id !== "flutter-new-project" &&
      uc.id !== "flutter-existing-project",
  );

  return (
    <FadeIn delay={100} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>מדריכי פרויקט מלאים</Text>
        <Text style={styles.sectionSubtitle}>
          זרימות עבודה מפורטות שלב אחר שלב
        </Text>

        {/* Main Project Flows */}
        <View style={styles.projectFlowsContainer}>
          {projectFlows.map((flow, flowIndex) => (
            <FadeIn key={flow.id} delay={100 + flowIndex * 100} direction="up">
              <View style={styles.projectFlowCard}>
                {/* Flow Header */}
                <View
                  style={[
                    styles.projectFlowHeader,
                    { backgroundColor: `${flow.color}15` },
                  ]}
                >
                  <View
                    style={[
                      styles.projectFlowIcon,
                      { backgroundColor: `${flow.color}25` },
                    ]}
                  >
                    <Ionicons
                      name={flow.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={flow.color}
                    />
                  </View>
                  <View style={styles.projectFlowHeaderText}>
                    <Text style={styles.projectFlowTitle}>{flow.nameHe}</Text>
                    <Text style={styles.projectFlowDesc}>
                      {flow.description}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.projectFlowBadge,
                      { backgroundColor: flow.color },
                    ]}
                  >
                    <Text style={styles.projectFlowBadgeText}>
                      {flow.steps.length} שלבים
                    </Text>
                  </View>
                </View>

                {/* Flow Steps */}
                <View style={styles.projectFlowSteps}>
                  {flow.steps.map((step, stepIndex) => {
                    const phase = phases.find((p) => p.id === step.phase);
                    const phaseColor = phase?.color || flow.color;

                    return (
                      <View key={stepIndex} style={styles.projectFlowStep}>
                        <View
                          style={[
                            styles.projectFlowStepNumber,
                            { backgroundColor: `${phaseColor}20` },
                          ]}
                        >
                          <Text
                            style={[
                              styles.projectFlowStepNumberText,
                              { color: phaseColor },
                            ]}
                          >
                            {step.stepNumber}
                          </Text>
                        </View>
                        <View style={styles.projectFlowStepContent}>
                          <View style={styles.projectFlowStepHeader}>
                            <Text
                              style={[
                                styles.projectFlowStepPhase,
                                { color: phaseColor },
                              ]}
                            >
                              {phase?.name || step.phase}
                            </Text>
                            {step.isRequired && (
                              <View style={styles.stepRequiredBadge}>
                                <Text style={styles.stepRequiredBadgeText}>
                                  חובה
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.projectFlowStepTitle}>
                            {step.titleHe}
                          </Text>
                          <Text style={styles.projectFlowStepDesc}>
                            {step.description}
                          </Text>
                          <View style={styles.projectFlowStepCommands}>
                            {step.commands.map((cmd, cmdIdx) => (
                              <ScalePress
                                key={cmdIdx}
                                onPress={() => handleCopyCommand(cmd)}
                                style={[
                                  styles.projectFlowStepCmd,
                                  { borderColor: `${phaseColor}40` },
                                ]}
                                haptic="none"
                              >
                                <Text
                                  style={[
                                    styles.projectFlowStepCmdText,
                                    { color: phaseColor },
                                  ]}
                                >
                                  {cmd}
                                </Text>
                                <Ionicons
                                  name="copy-outline"
                                  size={14}
                                  color={phaseColor}
                                />
                              </ScalePress>
                            ))}
                          </View>
                          {step.warning && (
                            <View style={styles.projectFlowStepWarning}>
                              <Ionicons
                                name="warning"
                                size={14}
                                color={colors.status.error}
                              />
                              <Text style={styles.projectFlowStepWarningText}>
                                {step.warning}
                              </Text>
                            </View>
                          )}
                        </View>
                        {stepIndex < flow.steps.length - 1 && (
                          <View style={styles.projectFlowStepLine} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </FadeIn>
          ))}
        </View>

        {/* Quick Templates */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
          תבניות מהירות
        </Text>
        <Text style={styles.sectionSubtitle}>לחץ להעתקת כל הפקודות בסדר</Text>
        <View style={styles.useCasesGrid}>
          {quickTemplates.map((useCase, index) => (
            <FadeIn key={useCase.id} delay={300 + index * 50} direction="up">
              <ScalePress
                onPress={() => onCopyUseCase(useCase)}
                style={styles.useCaseCard}
                haptic="medium"
              >
                <View
                  style={[
                    styles.useCaseIcon,
                    {
                      backgroundColor:
                        useCase.id === "emergency"
                          ? colors.status.errorBg
                          : colors.accent.primaryGlow,
                    },
                  ]}
                >
                  <Ionicons
                    name={useCase.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={
                      useCase.id === "emergency"
                        ? colors.status.error
                        : colors.accent.primary
                    }
                  />
                </View>
                <Text style={styles.useCaseName}>{useCase.nameHe}</Text>
                <Text style={styles.useCaseDescription}>
                  {useCase.description}
                </Text>
                <View style={styles.useCaseCommands}>
                  {useCase.commands.map((cmd, i) => (
                    <Text key={i} style={styles.useCaseCommand}>
                      {cmd}
                    </Text>
                  ))}
                </View>
                <View style={styles.useCaseCopyHint}>
                  <Ionicons
                    name="copy-outline"
                    size={14}
                    color={colors.text.muted}
                  />
                  <Text style={styles.useCaseCopyText}>לחץ להעתקה</Text>
                </View>
              </ScalePress>
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

  // Project Flows
  projectFlowsContainer: {
    gap: spacing.xl,
  },
  projectFlowCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  projectFlowHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  projectFlowIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  projectFlowHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  projectFlowTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  projectFlowDesc: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  projectFlowBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  projectFlowBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },
  projectFlowSteps: {
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.md,
  },
  projectFlowStep: {
    flexDirection: "row-reverse",
    gap: spacing.md,
  },
  projectFlowStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  projectFlowStepNumberText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  projectFlowStepContent: {
    flex: 1,
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  projectFlowStepHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  projectFlowStepPhase: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
  },
  stepRequiredBadge: {
    backgroundColor: colors.status.errorBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  stepRequiredBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.status.error,
  },
  projectFlowStepTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
  },
  projectFlowStepDesc: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  projectFlowStepCommands: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  projectFlowStepCmd: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  projectFlowStepCmdText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  projectFlowStepWarning: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.status.errorBg,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  projectFlowStepWarningText: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.status.error,
    textAlign: "right",
  },
  projectFlowStepLine: {
    position: "absolute",
    start: 15,
    top: 32,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border.subtle,
  },

  // Use Cases
  useCasesGrid: {
    gap: spacing.md,
  },
  useCaseCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  useCaseIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  useCaseName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  useCaseDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  useCaseCommands: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  useCaseCommand: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
  },
  useCaseCopyHint: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  useCaseCopyText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
