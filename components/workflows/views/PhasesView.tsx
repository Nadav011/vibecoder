import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";
import type { ProjectFlow, Phase } from "../../../data/workflows";

interface FlowProgress {
  completed: number;
  total: number;
  percent: number;
}

interface PhasesViewProps {
  projectFlows: ProjectFlow[];
  phases: Phase[];
  selectedFlowId: string | null;
  onSelectFlow: (flowId: string | null) => void;
  isStepCompleted: (flowId: string, stepNumber: number) => boolean;
  toggleStepComplete: (flowId: string, stepNumber: number) => void;
  getFlowProgress: (flow: ProjectFlow) => FlowProgress;
  onCopyCommand: (command: string) => void;
}

export function PhasesView({
  projectFlows,
  phases,
  selectedFlowId,
  onSelectFlow,
  isStepCompleted,
  toggleStepComplete,
  getFlowProgress,
  onCopyCommand,
}: PhasesViewProps) {
  const handleCopyCommand = async (command: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(command);
    }
    haptics.success();
    onCopyCommand(command);
  };

  // Project Flows Selection (no flow selected)
  if (!selectedFlowId) {
    return (
      <FadeIn delay={50} direction="up">
        {/* Hero Section */}
        <View style={styles.flowHeroSection}>
          <View style={styles.flowHeroContent}>
            <View style={styles.flowHeroIconContainer}>
              <Ionicons
                name="map-outline"
                size={40}
                color={colors.accent.primary}
              />
            </View>
            <Text style={styles.flowHeroTitle}>מדריך התחלה מהירה</Text>
            <Text style={styles.flowHeroSubtitle}>
              בחר את סוג הפרויקט שלך וקבל מדריך מפורט צעד-אחר-צעד
            </Text>
          </View>
        </View>

        {/* Flow Selection Cards */}
        <View style={styles.flowCardsContainer}>
          {projectFlows.map((flow, index) => {
            const requiredSteps = flow.steps.filter((s) => s.isRequired).length;
            const optionalSteps = flow.steps.length - requiredSteps;
            const progress = getFlowProgress(flow);

            return (
              <FadeIn key={flow.id} delay={150 + index * 100} direction="up">
                <ScalePress
                  onPress={() => onSelectFlow(flow.id)}
                  style={styles.flowCardPremium}
                  haptic="medium"
                  scale={0.98}
                >
                  {/* Card Header with Gradient Effect */}
                  <View
                    style={[
                      styles.flowCardHeader,
                      { backgroundColor: `${flow.color}15` },
                    ]}
                  >
                    <View
                      style={[
                        styles.flowCardIconLarge,
                        { backgroundColor: `${flow.color}25` },
                      ]}
                    >
                      <Ionicons
                        name={flow.icon as keyof typeof Ionicons.glyphMap}
                        size={36}
                        color={flow.color}
                      />
                    </View>
                    <View style={styles.flowCardBadgeContainer}>
                      <View
                        style={[
                          styles.flowCardBadge,
                          { backgroundColor: flow.color },
                        ]}
                      >
                        <Text style={styles.flowCardBadgeText}>
                          {flow.id === "new-project"
                            ? "מומלץ למתחילים"
                            : "למפתחים מנוסים"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Content */}
                  <View style={styles.flowCardBody}>
                    <Text style={styles.flowCardTitle}>{flow.nameHe}</Text>
                    <Text style={styles.flowCardDescription}>
                      {flow.description}
                    </Text>

                    {/* Stats Row */}
                    <View style={styles.flowCardStats}>
                      <View style={styles.flowCardStat}>
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={flow.color}
                        />
                        <Text style={styles.flowCardStatValue}>
                          {flow.estimatedTime}
                        </Text>
                      </View>
                      <View style={styles.flowCardStatDivider} />
                      <View style={styles.flowCardStat}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={18}
                          color={colors.accent.success}
                        />
                        <Text style={styles.flowCardStatValue}>
                          {requiredSteps} שלבי חובה
                        </Text>
                      </View>
                      <View style={styles.flowCardStatDivider} />
                      <View style={styles.flowCardStat}>
                        <Ionicons
                          name="options-outline"
                          size={18}
                          color={colors.text.muted}
                        />
                        <Text style={styles.flowCardStatValue}>
                          {optionalSteps} אופציונלי
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    {progress.completed > 0 && (
                      <View style={styles.flowCardProgress}>
                        <View style={styles.flowCardProgressHeader}>
                          <Text style={styles.flowCardProgressText}>
                            התקדמות: {progress.completed}/{progress.total}
                          </Text>
                          <Text
                            style={[
                              styles.flowCardProgressPercent,
                              {
                                color:
                                  progress.percent === 100
                                    ? colors.accent.success
                                    : flow.color,
                              },
                            ]}
                          >
                            {progress.percent}%
                          </Text>
                        </View>
                        <View style={styles.flowCardProgressBar}>
                          <View
                            style={[
                              styles.flowCardProgressFill,
                              {
                                width: `${progress.percent}%`,
                                backgroundColor:
                                  progress.percent === 100
                                    ? colors.accent.success
                                    : flow.color,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    )}

                    {/* Preview of first 3 steps */}
                    <View style={styles.flowCardPreview}>
                      <Text style={styles.flowCardPreviewTitle}>השלבים:</Text>
                      {flow.steps.slice(0, 3).map((step, i) => (
                        <View key={i} style={styles.flowCardPreviewStep}>
                          <View
                            style={[
                              styles.flowCardPreviewDot,
                              { backgroundColor: flow.color },
                            ]}
                          />
                          <Text style={styles.flowCardPreviewText}>
                            {step.titleHe}
                          </Text>
                          {step.isRequired && (
                            <View style={styles.flowCardPreviewRequired}>
                              <Text style={styles.flowCardPreviewRequiredText}>
                                חובה
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                      {flow.steps.length > 3 && (
                        <Text style={styles.flowCardPreviewMore}>
                          +{flow.steps.length - 3} שלבים נוספים...
                        </Text>
                      )}
                    </View>

                    {/* CTA Button */}
                    <View
                      style={[
                        styles.flowCardCTA,
                        { backgroundColor: flow.color },
                      ]}
                    >
                      <Text style={styles.flowCardCTAText}>התחל את המדריך</Text>
                      <Ionicons name="arrow-back" size={18} color="#fff" />
                    </View>
                  </View>
                </ScalePress>
              </FadeIn>
            );
          })}
        </View>
      </FadeIn>
    );
  }

  // Selected Flow Detail View
  const flow = projectFlows.find((f) => f.id === selectedFlowId);
  if (!flow) return null;

  const requiredSteps = flow.steps.filter((s) => s.isRequired).length;

  return (
    <FadeIn delay={50} direction="up">
      <View style={styles.flowDetailContainer}>
        {/* Premium Header */}
        <View
          style={[
            styles.flowDetailHero,
            { backgroundColor: `${flow.color}10` },
          ]}
        >
          <ScalePress
            onPress={() => onSelectFlow(null)}
            style={styles.flowDetailBack}
            haptic="light"
          >
            <Ionicons
              name="arrow-forward"
              size={20}
              color={colors.text.secondary}
            />
            <Text style={styles.flowDetailBackText}>חזרה</Text>
          </ScalePress>

          <View style={styles.flowDetailHeroContent}>
            <View
              style={[
                styles.flowDetailIconLarge,
                { backgroundColor: `${flow.color}20` },
              ]}
            >
              <Ionicons
                name={flow.icon as keyof typeof Ionicons.glyphMap}
                size={48}
                color={flow.color}
              />
            </View>
            <Text style={styles.flowDetailTitle}>{flow.nameHe}</Text>
            <Text style={styles.flowDetailSubtitle}>{flow.description}</Text>

            {/* Progress Bar */}
            <View style={styles.flowProgressContainer}>
              <View style={styles.flowProgressBar}>
                <View
                  style={[
                    styles.flowProgressFill,
                    {
                      backgroundColor: flow.color,
                      width: "0%",
                    },
                  ]}
                />
              </View>
              <View style={styles.flowProgressStats}>
                <View style={styles.flowProgressStat}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.text.muted}
                  />
                  <Text style={styles.flowProgressStatText}>
                    {flow.estimatedTime}
                  </Text>
                </View>
                <View style={styles.flowProgressStat}>
                  <Ionicons
                    name="list-outline"
                    size={16}
                    color={colors.text.muted}
                  />
                  <Text style={styles.flowProgressStatText}>
                    {flow.steps.length} שלבים ({requiredSteps} חובה)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Steps Timeline */}
        <View style={styles.flowStepsTimeline}>
          {flow.steps.map((step, stepIndex) => {
            const phase = phases.find((p) => p.id === step.phase);
            const phaseColor = phase?.color || flow.color;

            return (
              <FadeIn
                key={step.stepNumber}
                delay={100 + stepIndex * 75}
                direction="up"
              >
                <View style={styles.flowStepPremium}>
                  {/* Timeline connector with checkbox */}
                  <View style={styles.flowStepTimelineLeft}>
                    <ScalePress
                      onPress={() =>
                        toggleStepComplete(flow.id, step.stepNumber)
                      }
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      haptic="light"
                      style={[
                        styles.flowStepCircle,
                        {
                          backgroundColor: isStepCompleted(
                            flow.id,
                            step.stepNumber,
                          )
                            ? colors.accent.success
                            : step.isRequired
                              ? phaseColor
                              : colors.bg.tertiary,
                          borderColor: isStepCompleted(flow.id, step.stepNumber)
                            ? colors.accent.success
                            : phaseColor,
                        },
                      ]}
                    >
                      {isStepCompleted(flow.id, step.stepNumber) ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      ) : (
                        <Text
                          style={[
                            styles.flowStepCircleText,
                            {
                              color: step.isRequired
                                ? "#fff"
                                : colors.text.muted,
                            },
                          ]}
                        >
                          {step.stepNumber}
                        </Text>
                      )}
                    </ScalePress>
                    {stepIndex < flow.steps.length - 1 && (
                      <View
                        style={[
                          styles.flowStepConnector,
                          { backgroundColor: `${phaseColor}40` },
                        ]}
                      />
                    )}
                  </View>

                  {/* Step Card */}
                  <View
                    style={[
                      styles.flowStepCard,
                      {
                        borderStartColor: phaseColor,
                        borderStartWidth: 3,
                      },
                    ]}
                  >
                    {/* Card Header */}
                    <View style={styles.flowStepCardHeader}>
                      <View style={styles.flowStepCardTitleRow}>
                        {phase && (
                          <View
                            style={[
                              styles.flowStepPhaseIcon,
                              { backgroundColor: `${phaseColor}20` },
                            ]}
                          >
                            <Ionicons
                              name={
                                phase.icon as keyof typeof Ionicons.glyphMap
                              }
                              size={16}
                              color={phaseColor}
                            />
                          </View>
                        )}
                        <View style={styles.flowStepTitleContainer}>
                          <Text style={styles.flowStepCardTitle}>
                            {step.titleHe}
                          </Text>
                          {phase && (
                            <Text
                              style={[
                                styles.flowStepPhaseLabel,
                                { color: phaseColor },
                              ]}
                            >
                              Phase {phase.number}: {phase.name}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View
                        style={[
                          styles.flowStepStatusBadge,
                          {
                            backgroundColor: step.isRequired
                              ? colors.status.errorBg
                              : colors.bg.tertiary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.flowStepStatusText,
                            {
                              color: step.isRequired
                                ? colors.status.error
                                : colors.text.muted,
                            },
                          ]}
                        >
                          {step.isRequired ? "חובה" : "אופציונלי"}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.flowStepCardDescription}>
                      {step.description}
                    </Text>

                    {/* Commands Section */}
                    <View style={styles.flowStepCommandsSection}>
                      <Text style={styles.flowStepCommandsLabel}>
                        פקודות להרצה:
                      </Text>
                      <View style={styles.flowStepCommandsList}>
                        {step.commands.map((cmd, cmdIndex) => (
                          <ScalePress
                            key={cmdIndex}
                            onPress={() => handleCopyCommand(cmd)}
                            style={[
                              styles.flowStepCommandPill,
                              { backgroundColor: `${phaseColor}15` },
                            ]}
                            haptic="medium"
                          >
                            <Text
                              style={[
                                styles.flowStepCommandPillText,
                                { color: phaseColor },
                              ]}
                            >
                              {cmd}
                            </Text>
                            <View
                              style={[
                                styles.flowStepCopyIcon,
                                { backgroundColor: phaseColor },
                              ]}
                            >
                              <Ionicons name="copy" size={10} color="#fff" />
                            </View>
                          </ScalePress>
                        ))}
                      </View>
                    </View>

                    {/* Tips */}
                    {step.tips && step.tips.length > 0 && (
                      <View style={styles.flowStepTipsSection}>
                        <View style={styles.flowStepTipsHeader}>
                          <Ionicons
                            name="bulb"
                            size={16}
                            color={colors.accent.warning}
                          />
                          <Text style={styles.flowStepTipsLabel}>
                            טיפים חשובים
                          </Text>
                        </View>
                        {step.tips.map((tip, tipIndex) => (
                          <View key={tipIndex} style={styles.flowStepTipRow}>
                            <View style={styles.flowStepTipBullet} />
                            <Text style={styles.flowStepTipContent}>{tip}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Warning */}
                    {step.warning && (
                      <View style={styles.flowStepWarningSection}>
                        <Ionicons
                          name="alert-circle"
                          size={18}
                          color={colors.status.error}
                        />
                        <Text style={styles.flowStepWarningContent}>
                          {step.warning}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </FadeIn>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <View style={styles.flowBottomCTA}>
          <Text style={styles.flowBottomCTAText}>
            סיימת? חזור לבחירת סוג פרויקט או המשך לעבודה עם הפקודות
          </Text>
          <ScalePress
            onPress={() => onSelectFlow(null)}
            style={[
              styles.flowBottomCTAButton,
              { backgroundColor: flow.color },
            ]}
            haptic="medium"
          >
            <Text style={styles.flowBottomCTAButtonText}>
              חזרה לתפריט הראשי
            </Text>
          </ScalePress>
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  // Hero Section
  flowHeroSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
  },
  flowHeroContent: {
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  flowHeroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.accent.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  flowHeroTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  flowHeroSubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 400,
  },

  // Flow Cards Container
  flowCardsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  flowCardPremium: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.subtle,
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
  flowCardHeader: {
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  flowCardIconLarge: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  flowCardBadgeContainer: {
    position: "absolute",
    top: spacing.md,
    end: spacing.md,
  },
  flowCardBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  flowCardBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },
  flowCardBody: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.bg.primary,
  },
  flowCardTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  flowCardDescription: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "right",
    lineHeight: 22,
  },
  flowCardStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  flowCardStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  flowCardStatValue: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  flowCardStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border.subtle,
  },
  flowCardProgress: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  flowCardProgressHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flowCardProgressText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  flowCardProgressPercent: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  flowCardProgressBar: {
    height: 6,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  flowCardProgressFill: {
    height: "100%",
    borderRadius: radius.sm,
  },
  flowCardPreview: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  flowCardPreviewTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
    marginBottom: spacing.xs,
  },
  flowCardPreviewStep: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  flowCardPreviewDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  flowCardPreviewText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    flex: 1,
    textAlign: "right",
  },
  flowCardPreviewRequired: {
    backgroundColor: colors.status.errorBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  flowCardPreviewRequiredText: {
    fontSize: typography.size.xs,
    color: colors.status.error,
    fontWeight: typography.weight.medium,
  },
  flowCardPreviewMore: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
    fontStyle: "italic",
  },
  flowCardCTA: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  flowCardCTAText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },

  // Flow Detail Container
  flowDetailContainer: {
    flex: 1,
  },
  flowDetailHero: {
    marginHorizontal: spacing.md,
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  flowDetailBack: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.md,
  },
  flowDetailBackText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  flowDetailHeroContent: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  flowDetailIconLarge: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  flowDetailTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  flowDetailSubtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 400,
  },
  flowProgressContainer: {
    width: "100%",
    maxWidth: 400,
    gap: spacing.sm,
  },
  flowProgressBar: {
    height: 6,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  flowProgressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  flowProgressStats: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: spacing.lg,
  },
  flowProgressStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  flowProgressStatText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },

  // Steps Timeline
  flowStepsTimeline: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  flowStepPremium: {
    flexDirection: "row-reverse",
  },
  flowStepTimelineLeft: {
    width: 48,
    alignItems: "center",
  },
  flowStepCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  flowStepCircleText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  flowStepConnector: {
    width: 3,
    flex: 1,
    marginVertical: spacing.xs,
    borderRadius: radius.full,
  },
  flowStepCard: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  flowStepCardHeader: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  flowStepCardTitleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  flowStepPhaseIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  flowStepTitleContainer: {
    flex: 1,
  },
  flowStepCardTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  flowStepPhaseLabel: {
    fontSize: typography.size.xs,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginTop: 2,
    textAlign: "right",
  },
  flowStepStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  flowStepStatusText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  flowStepCardDescription: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "right",
    lineHeight: 22,
  },
  flowStepCommandsSection: {
    gap: spacing.sm,
  },
  flowStepCommandsLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
  },
  flowStepCommandsList: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  flowStepCommandPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingStart: spacing.md,
    paddingEnd: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  flowStepCommandPillText: {
    fontSize: typography.size.sm,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: typography.weight.semibold,
  },
  flowStepCopyIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  flowStepTipsSection: {
    backgroundColor: `${colors.accent.warning}15`,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  flowStepTipsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  flowStepTipsLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.accent.warning,
  },
  flowStepTipRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingStart: spacing.sm,
  },
  flowStepTipBullet: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.accent.warning,
    marginTop: 6,
  },
  flowStepTipContent: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    flex: 1,
    lineHeight: 20,
  },
  flowStepWarningSection: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.status.errorBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  flowStepWarningContent: {
    fontSize: typography.size.sm,
    color: colors.status.error,
    textAlign: "right",
    flex: 1,
    fontWeight: typography.weight.medium,
    lineHeight: 20,
  },

  // Bottom CTA
  flowBottomCTA: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  flowBottomCTAText: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textAlign: "center",
  },
  flowBottomCTAButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  flowBottomCTAButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },
});
