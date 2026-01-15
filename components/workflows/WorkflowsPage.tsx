import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";
import {
  PHASES,
  QUICK_ACTIONS,
  USE_CASES,
  HARD_STOPS,
  SKILLS_SUMMARY,
  PLUGINS,
  BREAKPOINTS,
  DEVICES,
  TOUCH_TARGETS,
  CATEGORIES,
  PROJECT_FLOWS,
  TOTAL_COMMANDS,
  searchCommands,
  getCommandsByCategory,
  Phase,
  Command,
  UseCase,
  Plugin,
  Breakpoint,
  Device,
  TouchTarget,
  Category,
  ProjectFlow,
  ProjectFlowStep,
} from "../../data/workflows";
import { CommandCard } from "./CommandCard";
import { PhaseTabs } from "./PhaseTabs";
import { QuickActions } from "./QuickActions";

const { width } = Dimensions.get("window");
const isWideScreen = width > 768;

type ViewMode =
  | "fullFlow"
  | "categories"
  | "phases"
  | "useCases"
  | "skills"
  | "hardStops"
  | "plugins"
  | "responsive";

export function WorkflowsPage() {
  const router = useRouter();
  const [selectedPhaseId, setSelectedPhaseId] = useState(PHASES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("fullFlow");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [recentCopies, setRecentCopies] = useState<string[]>([]);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(
    null,
  );
  const [expandedSkillName, setExpandedSkillName] = useState<string | null>(
    null,
  );
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [expandedPluginId, setExpandedPluginId] = useState<string | null>(null);

  // Track completed steps per flow (flowId-stepNumber format)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Toggle step completion
  const toggleStepComplete = useCallback(
    (flowId: string, stepNumber: number) => {
      const key = `${flowId}-${stepNumber}`;
      setCompletedSteps((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        // Save to localStorage for web
        if (Platform.OS === "web" && typeof localStorage !== "undefined") {
          localStorage.setItem(
            "vibecoder-completed-steps",
            JSON.stringify([...newSet]),
          );
        }
        return newSet;
      });
      haptics.light();
    },
    [],
  );

  // Check if step is completed
  const isStepCompleted = useCallback(
    (flowId: string, stepNumber: number) => {
      return completedSteps.has(`${flowId}-${stepNumber}`);
    },
    [completedSteps],
  );

  // Get progress for a flow
  const getFlowProgress = useCallback(
    (flow: ProjectFlow) => {
      const completed = flow.steps.filter((step) =>
        isStepCompleted(flow.id, step.stepNumber),
      ).length;
      return {
        completed,
        total: flow.steps.length,
        percent: Math.round((completed / flow.steps.length) * 100),
      };
    },
    [isStepCompleted],
  );

  // Load saved progress on mount
  React.useEffect(() => {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("vibecoder-completed-steps");
      if (saved) {
        try {
          setCompletedSteps(new Set(JSON.parse(saved)));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  // Get selected phase
  const selectedPhase = useMemo(
    () => PHASES.find((p) => p.id === selectedPhaseId) || PHASES[0],
    [selectedPhaseId],
  );

  // Filter commands by search
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedPhase.commands;
    }
    return searchCommands(searchQuery).filter(
      (cmd) =>
        (cmd as Command & { phaseId?: string }).phaseId === selectedPhaseId ||
        !searchQuery,
    );
  }, [searchQuery, selectedPhase]);

  // All search results (across all phases)
  const allSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCommands(searchQuery);
  }, [searchQuery]);

  // Handle copy tracking
  const handleCopy = useCallback((text: string) => {
    setRecentCopies((prev) => [text, ...prev.slice(0, 9)]);
  }, []);

  // Copy use case commands
  const copyUseCaseCommands = async (useCase: UseCase) => {
    const text = useCase.commands.join("\n");
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.success();
    handleCopy(text);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <ScalePress
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          haptic="light"
        >
          <Ionicons
            name="arrow-forward"
            size={24}
            color={colors.text.primary}
          />
        </ScalePress>

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>מרכז הפיקוד</Text>
          <Text style={styles.subtitle}>
            v17.3.0 OMEGA • {TOTAL_COMMANDS} פקודות
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="חפש פקודה..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <ScalePress
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              haptic="light"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.text.muted}
              />
            </ScalePress>
          )}
        </View>
      </View>

      {/* View Mode Tabs */}
      {!searchQuery && (
        <View style={styles.viewModeTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.viewModeContent}
          >
            {[
              {
                id: "fullFlow",
                label: "הזרימה המלאה",
                icon: "git-network-outline",
              },
              { id: "categories", label: "קטגוריות", icon: "grid-outline" },
              { id: "phases", label: "שלבים", icon: "layers-outline" },
              {
                id: "useCases",
                label: "תבניות",
                icon: "document-text-outline",
              },
              { id: "skills", label: "סקילים", icon: "flash-outline" },
              {
                id: "plugins",
                label: "פלאגינים",
                icon: "extension-puzzle-outline",
              },
              {
                id: "responsive",
                label: "רספונסיב",
                icon: "phone-portrait-outline",
              },
              { id: "hardStops", label: "Hard Stops", icon: "warning-outline" },
            ].map((tab) => (
              <ScalePress
                key={tab.id}
                onPress={() => setViewMode(tab.id as ViewMode)}
                style={[
                  styles.viewModeTab,
                  viewMode === tab.id && styles.viewModeTabActive,
                ]}
                haptic="light"
              >
                <Ionicons
                  name={tab.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={
                    viewMode === tab.id
                      ? colors.accent.primary
                      : colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.viewModeTabText,
                    viewMode === tab.id && styles.viewModeTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* FULL FLOW VIEW - All phases in order */}
        {!searchQuery && viewMode === "fullFlow" && (
          <FadeIn delay={50} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>הזרימה המלאה</Text>
              <Text style={styles.sectionSubtitle}>
                כל 16 השלבים בסדר הנכון - מ-BOOT עד MONITOR + EMERGENCY
              </Text>

              <View style={styles.fullFlowContainer}>
                {PHASES.map((phase, phaseIndex) => (
                  <FadeIn
                    key={phase.id}
                    delay={100 + phaseIndex * 50}
                    direction="up"
                  >
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
                          <Text style={styles.fullFlowPhaseName}>
                            {phase.name}
                          </Text>
                          <Text style={styles.fullFlowPhaseSkill}>
                            {phase.skill}
                          </Text>
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
                            onPress={async () => {
                              if (
                                Platform.OS === "web" &&
                                typeof navigator !== "undefined"
                              ) {
                                await navigator.clipboard.writeText(
                                  cmd.command,
                                );
                              }
                              haptics.light();
                              handleCopy(cmd.command);
                            }}
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
                              setExpandedPhaseId(
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
                      {phaseIndex < PHASES.length - 1 && (
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
        )}

        {/* CATEGORIES VIEW */}
        {!searchQuery && viewMode === "categories" && !selectedCategoryId && (
          <FadeIn delay={50} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>קטגוריות</Text>
              <Text style={styles.sectionSubtitle}>
                פקודות מאורגנות לפי תחום
              </Text>

              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((category, index) => {
                  const commandCount = getCommandsByCategory(
                    category.id,
                  ).length;
                  return (
                    <FadeIn
                      key={category.id}
                      delay={100 + index * 50}
                      direction="up"
                    >
                      <ScalePress
                        onPress={() => setSelectedCategoryId(category.id)}
                        style={styles.categoryCard}
                        haptic="medium"
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: `${category.color}20` },
                          ]}
                        >
                          <Ionicons
                            name={
                              category.icon as keyof typeof Ionicons.glyphMap
                            }
                            size={28}
                            color={category.color}
                          />
                        </View>
                        <Text style={styles.categoryName}>
                          {category.nameHe}
                        </Text>
                        <Text style={styles.categoryNameEn}>
                          {category.name}
                        </Text>
                        <View style={styles.categoryCount}>
                          <Text style={styles.categoryCountText}>
                            {commandCount} פקודות
                          </Text>
                        </View>
                      </ScalePress>
                    </FadeIn>
                  );
                })}
              </View>
            </View>
          </FadeIn>
        )}

        {/* CATEGORY DETAIL VIEW */}
        {!searchQuery && viewMode === "categories" && selectedCategoryId && (
          <FadeIn delay={50} direction="up">
            <View style={styles.section}>
              <ScalePress
                onPress={() => setSelectedCategoryId(null)}
                style={styles.backToCategories}
                haptic="light"
              >
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.accent.primary}
                />
                <Text style={styles.backToCategoriesText}>חזרה לקטגוריות</Text>
              </ScalePress>

              {(() => {
                const category = CATEGORIES.find(
                  (c) => c.id === selectedCategoryId,
                );
                const commands = getCommandsByCategory(selectedCategoryId);
                if (!category) return null;

                return (
                  <>
                    <View style={styles.categoryDetailHeader}>
                      <View
                        style={[
                          styles.categoryDetailIcon,
                          { backgroundColor: `${category.color}20` },
                        ]}
                      >
                        <Ionicons
                          name={category.icon as keyof typeof Ionicons.glyphMap}
                          size={32}
                          color={category.color}
                        />
                      </View>
                      <View style={styles.categoryDetailInfo}>
                        <Text style={styles.categoryDetailName}>
                          {category.nameHe}
                        </Text>
                        <Text style={styles.categoryDetailNameEn}>
                          {category.name}
                        </Text>
                        <Text style={styles.categoryDetailCount}>
                          {commands.length} פקודות
                        </Text>
                      </View>
                    </View>

                    <View style={styles.commandsList}>
                      {commands.map((cmd, index) => (
                        <FadeIn
                          key={cmd.id}
                          delay={100 + index * 30}
                          direction="up"
                        >
                          <CommandCard
                            command={cmd}
                            phaseColor={category.color}
                            onCopy={handleCopy}
                          />
                        </FadeIn>
                      ))}
                    </View>
                  </>
                );
              })()}
            </View>
          </FadeIn>
        )}

        {/* PROJECT FLOWS - Premium Step by step guide (phases view) */}
        {!searchQuery && viewMode === "phases" && !selectedFlowId && (
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
              {PROJECT_FLOWS.map((flow, index) => {
                const requiredSteps = flow.steps.filter(
                  (s) => s.isRequired,
                ).length;
                const optionalSteps = flow.steps.length - requiredSteps;

                return (
                  <FadeIn
                    key={flow.id}
                    delay={150 + index * 100}
                    direction="up"
                  >
                    <ScalePress
                      onPress={() => setSelectedFlowId(flow.id)}
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
                        {(() => {
                          const progress = getFlowProgress(flow);
                          return progress.completed > 0 ? (
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
                          ) : null;
                        })()}

                        {/* Preview of first 3 steps */}
                        <View style={styles.flowCardPreview}>
                          <Text style={styles.flowCardPreviewTitle}>
                            השלבים:
                          </Text>
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
                                  <Text
                                    style={styles.flowCardPreviewRequiredText}
                                  >
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
                          <Text style={styles.flowCardCTAText}>
                            התחל את המדריך
                          </Text>
                          <Ionicons name="arrow-back" size={18} color="#fff" />
                        </View>
                      </View>
                    </ScalePress>
                  </FadeIn>
                );
              })}
            </View>
          </FadeIn>
        )}

        {/* SELECTED PROJECT FLOW - Premium Step by step guide */}
        {!searchQuery && viewMode === "phases" && selectedFlowId && (
          <FadeIn delay={50} direction="up">
            {(() => {
              const flow = PROJECT_FLOWS.find((f) => f.id === selectedFlowId);
              if (!flow) return null;

              const requiredSteps = flow.steps.filter(
                (s) => s.isRequired,
              ).length;

              return (
                <View style={styles.flowDetailContainer}>
                  {/* Premium Header */}
                  <View
                    style={[
                      styles.flowDetailHero,
                      { backgroundColor: `${flow.color}10` },
                    ]}
                  >
                    <ScalePress
                      onPress={() => setSelectedFlowId(null)}
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
                      <Text style={styles.flowDetailSubtitle}>
                        {flow.description}
                      </Text>

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
                      // Get phase info for this step
                      const phase = PHASES.find((p) => p.id === step.phase);
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
                                hitSlop={{
                                  top: 8,
                                  bottom: 8,
                                  left: 8,
                                  right: 8,
                                }}
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
                                    borderColor: isStepCompleted(
                                      flow.id,
                                      step.stepNumber,
                                    )
                                      ? colors.accent.success
                                      : phaseColor,
                                  },
                                ]}
                              >
                                {isStepCompleted(flow.id, step.stepNumber) ? (
                                  <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#fff"
                                  />
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
                                      onPress={async () => {
                                        if (
                                          Platform.OS === "web" &&
                                          typeof navigator !== "undefined"
                                        ) {
                                          await navigator.clipboard.writeText(
                                            cmd,
                                          );
                                        }
                                        haptics.success();
                                        handleCopy(cmd);
                                      }}
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
                                        <Ionicons
                                          name="copy"
                                          size={10}
                                          color="#fff"
                                        />
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
                                    <View
                                      key={tipIndex}
                                      style={styles.flowStepTipRow}
                                    >
                                      <View style={styles.flowStepTipBullet} />
                                      <Text style={styles.flowStepTipContent}>
                                        {tip}
                                      </Text>
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
                      onPress={() => setSelectedFlowId(null)}
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
              );
            })()}
          </FadeIn>
        )}

        {/* Quick Actions (when no search and no selected flow) */}
        {!searchQuery && viewMode === "phases" && !selectedFlowId && (
          <FadeIn delay={150} direction="up">
            <QuickActions commands={QUICK_ACTIONS} onCopy={handleCopy} />
          </FadeIn>
        )}

        {/* Phase Tabs (when no search and phases mode and no flow selected) */}
        {!searchQuery && viewMode === "phases" && !selectedFlowId && (
          <FadeIn delay={200} direction="up">
            <PhaseTabs
              phases={PHASES}
              selectedPhaseId={selectedPhaseId}
              onSelectPhase={setSelectedPhaseId}
            />
          </FadeIn>
        )}

        {/* Search Results */}
        {searchQuery && allSearchResults.length > 0 && (
          <FadeIn delay={50} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {allSearchResults.length} תוצאות עבור "{searchQuery}"
              </Text>
              <View style={styles.commandsList}>
                {allSearchResults.map((cmd, index) => (
                  <FadeIn key={cmd.id} delay={50 + index * 30} direction="up">
                    <CommandCard
                      command={cmd}
                      phaseColor={colors.accent.primary}
                      onCopy={handleCopy}
                    />
                  </FadeIn>
                ))}
              </View>
            </View>
          </FadeIn>
        )}

        {/* No Search Results */}
        {searchQuery && allSearchResults.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.text.muted}
            />
            <Text style={styles.emptyText}>לא נמצאו פקודות</Text>
            <Text style={styles.emptySubtext}>נסה חיפוש אחר</Text>
          </View>
        )}

        {/* USE CASES VIEW - Full Project Flows */}
        {!searchQuery && viewMode === "useCases" && (
          <FadeIn delay={100} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>מדריכי פרויקט מלאים</Text>
              <Text style={styles.sectionSubtitle}>
                זרימות עבודה מפורטות שלב אחר שלב
              </Text>

              {/* Main Project Flows */}
              <View style={styles.projectFlowsContainer}>
                {PROJECT_FLOWS.map((flow, flowIndex) => (
                  <FadeIn
                    key={flow.id}
                    delay={100 + flowIndex * 100}
                    direction="up"
                  >
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
                          <Text style={styles.projectFlowTitle}>
                            {flow.nameHe}
                          </Text>
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
                          const phase = PHASES.find((p) => p.id === step.phase);
                          const phaseColor = phase?.color || flow.color;

                          return (
                            <View
                              key={stepIndex}
                              style={styles.projectFlowStep}
                            >
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
                                      <Text
                                        style={styles.stepRequiredBadgeText}
                                      >
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
                                      onPress={async () => {
                                        if (
                                          Platform.OS === "web" &&
                                          typeof navigator !== "undefined"
                                        ) {
                                          await navigator.clipboard.writeText(
                                            cmd,
                                          );
                                        }
                                        haptics.success();
                                        handleCopy(cmd);
                                      }}
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
                                    <Text
                                      style={styles.projectFlowStepWarningText}
                                    >
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
              <Text style={styles.sectionSubtitle}>
                לחץ להעתקת כל הפקודות בסדר
              </Text>
              <View style={styles.useCasesGrid}>
                {USE_CASES.filter(
                  (uc) =>
                    uc.id !== "new-project" && uc.id !== "existing-project",
                ).map((useCase, index) => (
                  <FadeIn
                    key={useCase.id}
                    delay={300 + index * 50}
                    direction="up"
                  >
                    <ScalePress
                      onPress={() => copyUseCaseCommands(useCase)}
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
        )}

        {/* SKILLS VIEW */}
        {!searchQuery && viewMode === "skills" && (
          <FadeIn delay={100} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>14 Skills</Text>
              <Text style={styles.sectionSubtitle}>
                המנועים שמריצים את כל המערכת • לחץ לפירוט מלא
              </Text>

              <View style={styles.skillsGrid}>
                {SKILLS_SUMMARY.map((skill, index) => {
                  const phase = PHASES.find(
                    (p) => p.skill.toUpperCase() === skill.name.toUpperCase(),
                  );
                  const phaseColor = phase?.color || colors.accent.primary;
                  const isExpanded = expandedSkillName === skill.name;

                  return (
                    <FadeIn
                      key={skill.name}
                      delay={100 + index * 50}
                      direction="up"
                    >
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
                            setExpandedSkillName(
                              isExpanded ? null : skill.name,
                            );
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
                                style={[
                                  styles.skillNumberText,
                                  { color: phaseColor },
                                ]}
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
                          <Text
                            style={[
                              styles.skillPhaseValue,
                              { color: phaseColor },
                            ]}
                          >
                            {skill.phase}
                          </Text>
                        </View>

                        {/* Key Commands (always visible) */}
                        <View style={styles.skillCommands}>
                          {skill.keyCommands.map((cmd, i) => (
                            <ScalePress
                              key={i}
                              onPress={async () => {
                                if (
                                  Platform.OS === "web" &&
                                  typeof navigator !== "undefined"
                                ) {
                                  await navigator.clipboard.writeText(cmd);
                                }
                                haptics.light();
                                handleCopy(cmd);
                              }}
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
                              style={[
                                styles.skillExpandedTitle,
                                { color: phaseColor },
                              ]}
                            >
                              כל הפקודות ({phase.commands.length})
                            </Text>
                            {phase.description && (
                              <Text style={styles.skillExpandedDescription}>
                                {phase.description}
                              </Text>
                            )}
                            <View style={styles.skillExpandedCommands}>
                              {phase.commands.map((cmd, cmdIndex) => (
                                <ScalePress
                                  key={cmd.id}
                                  onPress={async () => {
                                    const fullCommand = cmd.params
                                      ? `${cmd.command} ${cmd.params}`
                                      : cmd.command;
                                    if (
                                      Platform.OS === "web" &&
                                      typeof navigator !== "undefined"
                                    ) {
                                      await navigator.clipboard.writeText(
                                        fullCommand,
                                      );
                                    }
                                    haptics.light();
                                    handleCopy(fullCommand);
                                  }}
                                  style={styles.skillExpandedCommandCard}
                                  haptic="light"
                                >
                                  <View
                                    style={styles.skillExpandedCommandHeader}
                                  >
                                    <Text
                                      style={[
                                        styles.skillExpandedCommandText,
                                        { color: phaseColor },
                                      ]}
                                    >
                                      {cmd.command}
                                    </Text>
                                    {cmd.params && (
                                      <Text
                                        style={
                                          styles.skillExpandedCommandParams
                                        }
                                      >
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
                                    <Text
                                      style={styles.skillExpandedCommandOutput}
                                    >
                                      → {cmd.output}
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
                                    <Text style={styles.skillHardStopText}>
                                      {stop}
                                    </Text>
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
          </FadeIn>
        )}

        {/* HARD STOPS VIEW */}
        {!searchQuery && viewMode === "hardStops" && (
          <FadeIn delay={100} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hard Stops</Text>
              <Text style={styles.sectionSubtitle}>
                תנאי מעבר קריטיים - אסור לדלג!
              </Text>

              <View style={styles.hardStopsTable}>
                {/* Header */}
                <View style={styles.hardStopHeader}>
                  <Text style={[styles.hardStopHeaderText, { flex: 1.5 }]}>
                    אחרי
                  </Text>
                  <Text style={[styles.hardStopHeaderText, { flex: 1 }]}>
                    בדיקה
                  </Text>
                  <Text style={[styles.hardStopHeaderText, { flex: 1 }]}>
                    תנאי
                  </Text>
                  <Text style={[styles.hardStopHeaderText, { flex: 1.5 }]}>
                    אם נכשל
                  </Text>
                </View>

                {/* Rows */}
                {HARD_STOPS.map((stop, index) => (
                  <FadeIn key={index} delay={100 + index * 30} direction="up">
                    <View style={styles.hardStopRow}>
                      <ScalePress
                        onPress={async () => {
                          if (
                            Platform.OS === "web" &&
                            typeof navigator !== "undefined"
                          ) {
                            await navigator.clipboard.writeText(stop.after);
                          }
                          haptics.light();
                          handleCopy(stop.after);
                        }}
                        style={[styles.hardStopCellView, { flex: 1.5 }]}
                        haptic="light"
                      >
                        <Text style={styles.hardStopCommand}>{stop.after}</Text>
                      </ScalePress>
                      <View style={[styles.hardStopCellView, { flex: 1 }]}>
                        <Text style={styles.hardStopCellText}>
                          {stop.check}
                        </Text>
                      </View>
                      <View style={[styles.hardStopCellView, { flex: 1 }]}>
                        <Text style={styles.hardStopCellText}>
                          {stop.condition}
                        </Text>
                      </View>
                      <ScalePress
                        onPress={async () => {
                          if (
                            Platform.OS === "web" &&
                            typeof navigator !== "undefined"
                          ) {
                            await navigator.clipboard.writeText(stop.ifFailed);
                          }
                          haptics.light();
                          handleCopy(stop.ifFailed);
                        }}
                        style={[styles.hardStopCellView, { flex: 1.5 }]}
                        haptic="light"
                      >
                        <Text
                          style={[
                            styles.hardStopCommand,
                            stop.ifFailed === "DO NOT COMMIT" &&
                              styles.hardStopDanger,
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
          </FadeIn>
        )}

        {/* PLUGINS VIEW */}
        {!searchQuery && viewMode === "plugins" && (
          <FadeIn delay={100} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9 פלאגינים</Text>
              <Text style={styles.sectionSubtitle}>
                תוספים לשיפור העבודה עם Claude Code
              </Text>

              <View style={styles.pluginsGrid}>
                {PLUGINS.map((plugin, index) => (
                  <FadeIn
                    key={plugin.id}
                    delay={100 + index * 50}
                    direction="up"
                  >
                    <View style={styles.pluginCard}>
                      <View style={styles.pluginHeader}>
                        <Ionicons
                          name="extension-puzzle"
                          size={24}
                          color={colors.accent.primary}
                        />
                        <Text style={styles.pluginName}>{plugin.name}</Text>
                      </View>
                      <Text style={styles.pluginDescription}>
                        {plugin.description}
                      </Text>
                      <View style={styles.pluginCommands}>
                        {(expandedPluginId === plugin.id
                          ? plugin.commands
                          : plugin.commands.slice(0, 3)
                        ).map((cmd) => (
                          <ScalePress
                            key={cmd.id}
                            onPress={async () => {
                              if (
                                Platform.OS === "web" &&
                                typeof navigator !== "undefined"
                              ) {
                                await navigator.clipboard.writeText(
                                  cmd.command,
                                );
                              }
                              haptics.light();
                              handleCopy(cmd.command);
                            }}
                            style={styles.pluginCommandBadge}
                            haptic="light"
                          >
                            <Text style={styles.pluginCommandText}>
                              {cmd.command}
                            </Text>
                          </ScalePress>
                        ))}
                        {plugin.commands.length > 3 && (
                          <ScalePress
                            onPress={() => {
                              haptics.light();
                              setExpandedPluginId(
                                expandedPluginId === plugin.id
                                  ? null
                                  : plugin.id,
                              );
                            }}
                            style={styles.pluginMoreButton}
                            haptic="light"
                          >
                            <Text style={styles.pluginMore}>
                              {expandedPluginId === plugin.id
                                ? "הסתר"
                                : `+${plugin.commands.length - 3} עוד`}
                            </Text>
                            <Ionicons
                              name={
                                expandedPluginId === plugin.id
                                  ? "chevron-up"
                                  : "chevron-down"
                              }
                              size={12}
                              color={colors.text.muted}
                            />
                          </ScalePress>
                        )}
                      </View>
                    </View>
                  </FadeIn>
                ))}
              </View>
            </View>
          </FadeIn>
        )}

        {/* RESPONSIVE VIEW */}
        {!searchQuery && viewMode === "responsive" && (
          <FadeIn delay={100} direction="up">
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
                    <Text style={[styles.breakpointHeaderText, { flex: 1 }]}>
                      שם
                    </Text>
                    <Text style={[styles.breakpointHeaderText, { flex: 1 }]}>
                      טווח
                    </Text>
                    <Text style={[styles.breakpointHeaderText, { flex: 0.5 }]}>
                      Class
                    </Text>
                  </View>
                  {BREAKPOINTS.map((bp, index) => (
                    <View key={bp.name} style={styles.breakpointRow}>
                      <Text style={[styles.breakpointCell, { flex: 1 }]}>
                        {bp.name}
                      </Text>
                      <Text style={[styles.breakpointCell, { flex: 1 }]}>
                        {bp.minWidth}px
                        {bp.maxWidth ? ` - ${bp.maxWidth}px` : "+"}
                      </Text>
                      <ScalePress
                        onPress={async () => {
                          if (
                            Platform.OS === "web" &&
                            typeof navigator !== "undefined"
                          ) {
                            await navigator.clipboard.writeText(
                              `${bp.tailwindClass}:`,
                            );
                          }
                          haptics.light();
                          handleCopy(`${bp.tailwindClass}:`);
                        }}
                        style={[styles.breakpointClassBadge]}
                        haptic="light"
                      >
                        <Text style={styles.breakpointClass}>
                          {bp.tailwindClass}:
                        </Text>
                      </ScalePress>
                    </View>
                  ))}
                </View>
              </View>

              {/* Devices */}
              <View style={styles.responsiveSection}>
                <Text style={styles.responsiveSectionTitle}>
                  מכשירים לבדיקה
                </Text>
                <View style={styles.devicesGrid}>
                  {DEVICES.filter((d) => d.required).map((device) => (
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
                          device.required
                            ? colors.accent.success
                            : colors.text.muted
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
                  {TOUCH_TARGETS.map((tt) => (
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
          </FadeIn>
        )}

        {/* Selected Phase Commands (when no search and phases mode and no flow selected) */}
        {!searchQuery && viewMode === "phases" && !selectedFlowId && (
          <FadeIn delay={250} direction="up">
            <View style={styles.section}>
              <View style={styles.phaseHeader}>
                <View
                  style={[
                    styles.phaseIcon,
                    { backgroundColor: `${selectedPhase.color}20` },
                  ]}
                >
                  <Ionicons
                    name={selectedPhase.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={selectedPhase.color}
                  />
                </View>
                <View style={styles.phaseInfo}>
                  <Text style={styles.phaseName}>
                    Phase {selectedPhase.number}: {selectedPhase.name}
                  </Text>
                  <Text style={styles.phaseSkill}>{selectedPhase.skill}</Text>
                  {selectedPhase.description && (
                    <Text style={styles.phaseDescription}>
                      {selectedPhase.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Hard Stops */}
              {selectedPhase.hardStops &&
                selectedPhase.hardStops.length > 0 && (
                  <View style={styles.hardStops}>
                    <View style={styles.hardStopsHeader}>
                      <Ionicons
                        name="warning"
                        size={16}
                        color={colors.status.error}
                      />
                      <Text style={styles.hardStopsTitle}>Hard Stops</Text>
                    </View>
                    {selectedPhase.hardStops.map((stop, i) => (
                      <Text key={i} style={styles.hardStopText}>
                        • {stop}
                      </Text>
                    ))}
                  </View>
                )}

              {/* Commands Count */}
              <View style={styles.commandsCountBadge}>
                <Text style={styles.commandsCountText}>
                  {filteredCommands.length} פקודות
                </Text>
              </View>

              {/* Commands */}
              <View style={styles.commandsList}>
                {filteredCommands.map((cmd, index) => (
                  <FadeIn key={cmd.id} delay={200 + index * 30} direction="up">
                    <CommandCard
                      command={cmd}
                      phaseColor={selectedPhase.color}
                      onCopy={handleCopy}
                    />
                  </FadeIn>
                ))}
              </View>
            </View>
          </FadeIn>
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Help Button */}
      <ScalePress
        onPress={() => {
          haptics.medium();
          setShowHelpPopup(true);
          setSelectedHelpTopic(null);
        }}
        style={styles.floatingHelpButton}
        haptic="none"
      >
        <Ionicons name="help-circle" size={28} color="#fff" />
      </ScalePress>

      {/* Help Popup */}
      {showHelpPopup && (
        <View style={styles.helpPopupOverlay}>
          <ScalePress
            onPress={() => setShowHelpPopup(false)}
            style={styles.helpPopupBackdrop}
            haptic="none"
            scale={1}
          >
            <View />
          </ScalePress>

          <FadeIn delay={0} direction="up">
            <View style={styles.helpPopupContainer}>
              {/* Header */}
              <View style={styles.helpPopupHeader}>
                <ScalePress
                  onPress={() => {
                    if (selectedHelpTopic) {
                      setSelectedHelpTopic(null);
                    } else {
                      setShowHelpPopup(false);
                    }
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  haptic="light"
                >
                  <Ionicons
                    name={selectedHelpTopic ? "arrow-forward" : "close"}
                    size={24}
                    color={colors.text.secondary}
                  />
                </ScalePress>
                <View style={styles.helpPopupTitleRow}>
                  <Ionicons
                    name="sparkles"
                    size={24}
                    color={colors.accent.primary}
                  />
                  <Text style={styles.helpPopupTitle}>
                    {selectedHelpTopic ? "התשובה שלך" : "איך אפשר לעזור?"}
                  </Text>
                </View>
                <View style={{ width: 24 }} />
              </View>

              {/* Content */}
              <ScrollView
                style={styles.helpPopupContent}
                showsVerticalScrollIndicator={false}
              >
                {!selectedHelpTopic ? (
                  <>
                    {/* Quick Questions */}
                    <View style={styles.helpQuestionsSection}>
                      {[
                        {
                          id: "where-am-i",
                          icon: "location",
                          question: "באיזה שלב אני?",
                          color: colors.accent.primary,
                        },
                        {
                          id: "what-next",
                          icon: "arrow-forward-circle",
                          question: "מה הפקודה הבאה?",
                          color: colors.accent.success,
                        },
                        {
                          id: "new-project",
                          icon: "rocket",
                          question: "איך מתחילים פרויקט חדש?",
                          color: "#10B981",
                        },
                        {
                          id: "existing-project",
                          icon: "folder-open",
                          question: "איך מצטרפים לפרויקט קיים?",
                          color: "#3B82F6",
                        },
                        {
                          id: "stuck",
                          icon: "warning",
                          question: "אני תקוע - מה לעשות?",
                          color: colors.status.error,
                        },
                        {
                          id: "best-practices",
                          icon: "shield-checkmark",
                          question: "מה הפרקטיקות הטובות?",
                          color: "#8B5CF6",
                        },
                      ].map((item) => (
                        <ScalePress
                          key={item.id}
                          onPress={() => {
                            haptics.light();
                            setSelectedHelpTopic(item.id);
                          }}
                          style={styles.helpQuestionCard}
                          haptic="none"
                        >
                          <View
                            style={[
                              styles.helpQuestionIcon,
                              { backgroundColor: `${item.color}20` },
                            ]}
                          >
                            <Ionicons
                              name={item.icon as keyof typeof Ionicons.glyphMap}
                              size={20}
                              color={item.color}
                            />
                          </View>
                          <Text style={styles.helpQuestionText}>
                            {item.question}
                          </Text>
                          <Ionicons
                            name="chevron-back"
                            size={18}
                            color={colors.text.muted}
                          />
                        </ScalePress>
                      ))}
                    </View>

                    {/* Current Phase Indicator */}
                    <View style={styles.helpCurrentPhase}>
                      <Text style={styles.helpCurrentPhaseLabel}>
                        השלב הנוכחי שלך:
                      </Text>
                      <View
                        style={[
                          styles.helpCurrentPhaseBadge,
                          { backgroundColor: `${selectedPhase.color}20` },
                        ]}
                      >
                        <Ionicons
                          name={
                            selectedPhase.icon as keyof typeof Ionicons.glyphMap
                          }
                          size={16}
                          color={selectedPhase.color}
                        />
                        <Text
                          style={[
                            styles.helpCurrentPhaseText,
                            { color: selectedPhase.color },
                          ]}
                        >
                          Phase {selectedPhase.number}: {selectedPhase.name}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.helpAnswerSection}>
                    {selectedHelpTopic === "where-am-i" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons
                            name="location"
                            size={32}
                            color={colors.accent.primary}
                          />
                          <Text style={styles.helpAnswerTitle}>
                            המיקום שלך בזרימה
                          </Text>
                        </View>
                        <View style={styles.helpAnswerCard}>
                          <Text style={styles.helpAnswerText}>
                            אתה נמצא כרגע ב:
                          </Text>
                          <View
                            style={[
                              styles.helpPhaseBig,
                              { backgroundColor: `${selectedPhase.color}15` },
                            ]}
                          >
                            <Ionicons
                              name={
                                selectedPhase.icon as keyof typeof Ionicons.glyphMap
                              }
                              size={32}
                              color={selectedPhase.color}
                            />
                            <Text
                              style={[
                                styles.helpPhaseBigText,
                                { color: selectedPhase.color },
                              ]}
                            >
                              Phase {selectedPhase.number}
                            </Text>
                            <Text style={styles.helpPhaseBigName}>
                              {selectedPhase.name}
                            </Text>
                          </View>
                          <Text style={styles.helpAnswerDesc}>
                            {selectedPhase.description}
                          </Text>
                        </View>
                        <View style={styles.helpTip}>
                          <Ionicons
                            name="bulb"
                            size={16}
                            color={colors.accent.warning}
                          />
                          <Text style={styles.helpTipText}>
                            לחץ על הטאבים למעלה כדי לעבור בין השלבים
                          </Text>
                        </View>
                      </>
                    )}

                    {selectedHelpTopic === "what-next" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons
                            name="arrow-forward-circle"
                            size={32}
                            color={colors.accent.success}
                          />
                          <Text style={styles.helpAnswerTitle}>
                            הפקודה הבאה שלך
                          </Text>
                        </View>
                        <View style={styles.helpAnswerCard}>
                          <Text style={styles.helpAnswerText}>
                            בהתבסס על השלב הנוכחי, הפקודה המומלצת:
                          </Text>
                          <ScalePress
                            onPress={async () => {
                              const cmd =
                                selectedPhase.commands[0]?.command || "/boot";
                              if (
                                Platform.OS === "web" &&
                                typeof navigator !== "undefined"
                              ) {
                                await navigator.clipboard.writeText(cmd);
                              }
                              haptics.success();
                              handleCopy(cmd);
                            }}
                            style={[
                              styles.helpCommandBig,
                              { backgroundColor: `${selectedPhase.color}15` },
                            ]}
                            haptic="none"
                          >
                            <Text
                              style={[
                                styles.helpCommandBigText,
                                { color: selectedPhase.color },
                              ]}
                            >
                              {selectedPhase.commands[0]?.command || "/boot"}
                            </Text>
                            <Ionicons
                              name="copy"
                              size={20}
                              color={selectedPhase.color}
                            />
                          </ScalePress>
                          <Text style={styles.helpAnswerDesc}>
                            {selectedPhase.commands[0]?.description ||
                              "הרץ פקודה זו להתחלה"}
                          </Text>
                        </View>
                      </>
                    )}

                    {selectedHelpTopic === "new-project" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons name="rocket" size={32} color="#10B981" />
                          <Text style={styles.helpAnswerTitle}>
                            התחלת פרויקט חדש
                          </Text>
                        </View>
                        <Text style={styles.helpSubtitle}>
                          8 שלבים מ-BOOT עד DEPLOY
                        </Text>
                        <ScrollView
                          style={styles.helpStepsScroll}
                          showsVerticalScrollIndicator={false}
                        >
                          <View style={styles.helpStepsList}>
                            {[
                              {
                                cmd: "/boot",
                                desc: "אתחול Session חובה",
                                phase: "Phase -1: BOOT",
                                color: "#F43F5E",
                              },
                              {
                                cmd: "/scan",
                                desc: "סריקת והבנת התיקייה",
                                phase: "Phase 0: DISCOVERY",
                                color: "#8B5CF6",
                              },
                              {
                                cmd: "/init new [name]",
                                desc: "יצירת DNA של הפרויקט",
                                phase: "Phase 1: GENESIS",
                                color: "#3B82F6",
                              },
                              {
                                cmd: "/tpa audit",
                                desc: "בדיקת טייפים וסכמות",
                                phase: "Phase 2: STRUCTURE",
                                color: "#F59E0B",
                              },
                              {
                                cmd: "/ui dna",
                                desc: "יצירת זהות ויזואלית",
                                phase: "Phase 2.6: DESIGN",
                                color: "#EC4899",
                              },
                              {
                                cmd: "/qa run",
                                desc: "בדיקות וטסטים",
                                phase: "Phase 3: QA",
                                color: "#06B6D4",
                              },
                              {
                                cmd: "/prime audit",
                                desc: "אישור איכות 49-Gate",
                                phase: "Phase 4: CERTIFICATION",
                                color: "#8B5CF6",
                              },
                              {
                                cmd: "/commit-push-pr",
                                desc: "פריסה ו-commit",
                                phase: "Phase 5: DEPLOY",
                                color: "#14B8A6",
                              },
                            ].map((step, i) => (
                              <ScalePress
                                key={i}
                                onPress={async () => {
                                  if (
                                    Platform.OS === "web" &&
                                    typeof navigator !== "undefined"
                                  ) {
                                    await navigator.clipboard.writeText(
                                      step.cmd,
                                    );
                                  }
                                  haptics.success();
                                  handleCopy(step.cmd);
                                }}
                                style={styles.helpStepItemFull}
                                haptic="none"
                              >
                                <View
                                  style={[
                                    styles.helpStepNumber,
                                    { backgroundColor: `${step.color}20` },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.helpStepNumberText,
                                      { color: step.color },
                                    ]}
                                  >
                                    {i + 1}
                                  </Text>
                                </View>
                                <View style={styles.helpStepContentFull}>
                                  <Text
                                    style={[
                                      styles.helpStepPhase,
                                      { color: step.color },
                                    ]}
                                  >
                                    {step.phase}
                                  </Text>
                                  <Text style={styles.helpStepCmd}>
                                    {step.cmd}
                                  </Text>
                                  <Text style={styles.helpStepDesc}>
                                    {step.desc}
                                  </Text>
                                </View>
                                <Ionicons
                                  name="copy-outline"
                                  size={16}
                                  color={colors.text.muted}
                                />
                              </ScalePress>
                            ))}
                          </View>
                        </ScrollView>
                        <ScalePress
                          onPress={() => {
                            setShowHelpPopup(false);
                            setSelectedFlowId("new-project");
                          }}
                          style={styles.helpCTAButton}
                          haptic="medium"
                        >
                          <Text style={styles.helpCTAText}>
                            פתח את המדריך המלא
                          </Text>
                          <Ionicons name="arrow-back" size={18} color="#fff" />
                        </ScalePress>
                      </>
                    )}

                    {selectedHelpTopic === "existing-project" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons
                            name="folder-open"
                            size={32}
                            color="#3B82F6"
                          />
                          <Text style={styles.helpAnswerTitle}>
                            הצטרפות לפרויקט קיים
                          </Text>
                        </View>
                        <Text style={styles.helpSubtitle}>
                          7 שלבים להבנה ויישור הקוד
                        </Text>
                        <ScrollView
                          style={styles.helpStepsScroll}
                          showsVerticalScrollIndicator={false}
                        >
                          <View style={styles.helpStepsList}>
                            {[
                              {
                                cmd: "/boot",
                                desc: "אתחול Session חובה",
                                phase: "Phase -1: BOOT",
                                color: "#F43F5E",
                              },
                              {
                                cmd: "/scan --deep",
                                desc: "סריקה עמוקה להבנת הקוד",
                                phase: "Phase 0: DISCOVERY",
                                color: "#8B5CF6",
                              },
                              {
                                cmd: "/init align --force",
                                desc: "יישור הפרויקט לתקנים",
                                phase: "Phase 1: GENESIS",
                                color: "#3B82F6",
                              },
                              {
                                cmd: "/tpa audit",
                                desc: "בדיקת טייפים קיימים",
                                phase: "Phase 2: STRUCTURE",
                                color: "#F59E0B",
                              },
                              {
                                cmd: "/cld forensic",
                                desc: "ניתוח עומק וחובות טכניים",
                                phase: "Phase 2.5: FORENSICS",
                                color: "#EF4444",
                              },
                              {
                                cmd: "/prime audit",
                                desc: "אישור איכות 49-Gate",
                                phase: "Phase 4: CERTIFICATION",
                                color: "#8B5CF6",
                              },
                              {
                                cmd: "/commit",
                                desc: "שמירה ופריסה",
                                phase: "Phase 5: DEPLOY",
                                color: "#14B8A6",
                              },
                            ].map((step, i) => (
                              <ScalePress
                                key={i}
                                onPress={async () => {
                                  if (
                                    Platform.OS === "web" &&
                                    typeof navigator !== "undefined"
                                  ) {
                                    await navigator.clipboard.writeText(
                                      step.cmd,
                                    );
                                  }
                                  haptics.success();
                                  handleCopy(step.cmd);
                                }}
                                style={styles.helpStepItemFull}
                                haptic="none"
                              >
                                <View
                                  style={[
                                    styles.helpStepNumber,
                                    { backgroundColor: `${step.color}20` },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.helpStepNumberText,
                                      { color: step.color },
                                    ]}
                                  >
                                    {i + 1}
                                  </Text>
                                </View>
                                <View style={styles.helpStepContentFull}>
                                  <Text
                                    style={[
                                      styles.helpStepPhase,
                                      { color: step.color },
                                    ]}
                                  >
                                    {step.phase}
                                  </Text>
                                  <Text style={styles.helpStepCmd}>
                                    {step.cmd}
                                  </Text>
                                  <Text style={styles.helpStepDesc}>
                                    {step.desc}
                                  </Text>
                                </View>
                                <Ionicons
                                  name="copy-outline"
                                  size={16}
                                  color={colors.text.muted}
                                />
                              </ScalePress>
                            ))}
                          </View>
                        </ScrollView>
                        <ScalePress
                          onPress={() => {
                            setShowHelpPopup(false);
                            setSelectedFlowId("existing-project");
                          }}
                          style={[
                            styles.helpCTAButton,
                            { backgroundColor: "#3B82F6" },
                          ]}
                          haptic="medium"
                        >
                          <Text style={styles.helpCTAText}>
                            פתח את המדריך המלא
                          </Text>
                          <Ionicons name="arrow-back" size={18} color="#fff" />
                        </ScalePress>
                      </>
                    )}

                    {selectedHelpTopic === "stuck" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons
                            name="warning"
                            size={32}
                            color={colors.status.error}
                          />
                          <Text style={styles.helpAnswerTitle}>
                            תקוע? אל דאגה!
                          </Text>
                        </View>
                        <View style={styles.helpAnswerCard}>
                          <Text style={styles.helpAnswerText}>
                            נסה את הפקודות הבאות לפי הסדר:
                          </Text>
                        </View>
                        <View style={styles.helpStepsList}>
                          {[
                            { cmd: "/boot", desc: "איפוס והתחלה מחדש" },
                            { cmd: "/cld shred", desc: "ניקוי הקשר" },
                            { cmd: "/fix", desc: "תיקון אוטומטי" },
                            { cmd: "/god", desc: "מצב God Mode" },
                          ].map((step, i) => (
                            <ScalePress
                              key={i}
                              onPress={async () => {
                                if (
                                  Platform.OS === "web" &&
                                  typeof navigator !== "undefined"
                                ) {
                                  await navigator.clipboard.writeText(step.cmd);
                                }
                                haptics.success();
                                handleCopy(step.cmd);
                              }}
                              style={styles.helpStepItemClickable}
                              haptic="none"
                            >
                              <View
                                style={[
                                  styles.helpStepNumber,
                                  { backgroundColor: colors.status.errorBg },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.helpStepNumberText,
                                    { color: colors.status.error },
                                  ]}
                                >
                                  {i + 1}
                                </Text>
                              </View>
                              <View style={styles.helpStepContent}>
                                <Text style={styles.helpStepCmd}>
                                  {step.cmd}
                                </Text>
                                <Text style={styles.helpStepDesc}>
                                  {step.desc}
                                </Text>
                              </View>
                              <Ionicons
                                name="copy"
                                size={16}
                                color={colors.text.muted}
                              />
                            </ScalePress>
                          ))}
                        </View>
                      </>
                    )}

                    {selectedHelpTopic === "best-practices" && (
                      <>
                        <View style={styles.helpAnswerHeader}>
                          <Ionicons
                            name="shield-checkmark"
                            size={32}
                            color="#8B5CF6"
                          />
                          <Text style={styles.helpAnswerTitle}>
                            פרקטיקות מומלצות
                          </Text>
                        </View>
                        <View style={styles.helpBestPractices}>
                          {[
                            {
                              icon: "refresh",
                              title: "הרץ /boot בכל Session",
                              desc: "זה מוודא שהמערכת מסונכרנת",
                            },
                            {
                              icon: "checkmark-done",
                              title: "בדוק עם /audit לפני commit",
                              desc: "49-Gate Matrix מוודא איכות",
                            },
                            {
                              icon: "code-slash",
                              title: "אפס any types",
                              desc: "הרץ /tpa fix --any",
                            },
                            {
                              icon: "eye",
                              title: "אמת עם /verify-app",
                              desc: "בדיקה ויזואלית בדפדפן",
                            },
                          ].map((item, i) => (
                            <View key={i} style={styles.helpBestPracticeItem}>
                              <View style={styles.helpBestPracticeIcon}>
                                <Ionicons
                                  name={
                                    item.icon as keyof typeof Ionicons.glyphMap
                                  }
                                  size={20}
                                  color="#8B5CF6"
                                />
                              </View>
                              <View style={styles.helpBestPracticeContent}>
                                <Text style={styles.helpBestPracticeTitle}>
                                  {item.title}
                                </Text>
                                <Text style={styles.helpBestPracticeDesc}>
                                  {item.desc}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          </FadeIn>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  placeholder: {
    width: 40,
  },
  searchWrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  viewModeTabs: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  viewModeContent: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  viewModeTab: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
  },
  viewModeTabActive: {
    backgroundColor: colors.accent.primaryGlow,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  viewModeTabText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  viewModeTabTextActive: {
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    gap: spacing.lg,
  },
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
  phaseHeader: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  phaseIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  phaseSkill: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
  },
  phaseDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  hardStops: {
    backgroundColor: colors.status.errorBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  hardStopsHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  hardStopsTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.status.error,
  },
  hardStopText: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    textAlign: "right",
  },
  commandsCountBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: "flex-end",
  },
  commandsCountText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  commandsList: {
    gap: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
  bottomPadding: {
    height: 100,
  },

  // Project Flows (Full Guides)
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
  useCaseMore: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    textAlign: "right",
    marginTop: spacing.xs,
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

  // Skills
  skillsGrid: {
    gap: spacing.md,
  },
  skillCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  skillHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  skillNumber: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  skillCommandText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  // Expanded skill styles
  skillCardExpanded: {
    borderWidth: 2,
  },
  skillHeaderClickable: {
    width: "100%",
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
    gap: spacing.sm,
  },
  skillExpandedCommandCard: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: "flex-end",
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

  // Hard Stops Table
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

  // Plugins
  pluginsGrid: {
    gap: spacing.md,
  },
  pluginCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  pluginHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  pluginName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  pluginDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  pluginCommands: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pluginCommandBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  pluginCommandText: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  pluginMoreButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
  },
  pluginMore: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },

  // Responsive
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

  // Full Flow View
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

  // Categories View
  categoriesGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    width: isWideScreen ? "30%" : "47%",
    alignItems: "center",
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  categoryNameEn: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  categoryCount: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  categoryCountText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  backToCategories: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backToCategoriesText: {
    fontSize: typography.size.sm,
    color: colors.accent.primary,
  },
  categoryDetailHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryDetailIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryDetailInfo: {
    flex: 1,
  },
  categoryDetailName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  categoryDetailNameEn: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  categoryDetailCount: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // Premium Flow Hero Section
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

  // Premium Flow Cards Container
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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

  // Progress Bar Styles
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

  // Premium Flow Detail Container
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

  // Premium Flow Steps Timeline
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

  // ========== FLOATING HELP BUTTON ==========
  floatingHelpButton: {
    position: "absolute",
    bottom: spacing.xl + 160,
    start: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },

  // ========== HELP POPUP ==========
  helpPopupOverlay: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    zIndex: 200,
  },
  helpPopupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.modal,
  },
  helpPopupContainer: {
    position: "absolute",
    top: 150,
    start: spacing.lg,
    maxWidth: 400,
    maxHeight: 450,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  helpPopupHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
  },
  helpPopupTitleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  helpPopupTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  helpPopupContent: {
    padding: spacing.md,
    maxHeight: 380,
  },

  // Questions Section
  helpQuestionsSection: {
    gap: spacing.sm,
  },
  helpQuestionCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  helpQuestionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  helpQuestionText: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: "right",
  },

  // Current Phase
  helpCurrentPhase: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  helpCurrentPhaseLabel: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  helpCurrentPhaseBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  helpCurrentPhaseText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },

  // Answer Section
  helpAnswerSection: {
    gap: spacing.md,
  },
  helpAnswerHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  helpAnswerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: "right",
  },
  helpAnswerCard: {
    padding: spacing.lg,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  helpAnswerText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "right",
    lineHeight: 24,
  },
  helpAnswerDesc: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textAlign: "right",
    marginTop: spacing.sm,
  },

  // Phase Big Display
  helpPhaseBig: {
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  helpPhaseBigText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  helpPhaseBigName: {
    fontSize: typography.size.lg,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },

  // Command Big Display
  helpCommandBig: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  helpCommandBigText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },

  // Help Tip
  helpTip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.accent.warning}15`,
    borderRadius: radius.md,
  },
  helpTipText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.accent.warning,
    textAlign: "right",
  },

  // Steps List
  helpStepsList: {
    gap: spacing.sm,
  },
  helpStepItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
  },
  helpStepItemClickable: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  helpStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  helpStepNumberText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },
  helpStepContent: {
    flex: 1,
    gap: 2,
  },
  helpStepCmd: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  helpStepDesc: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
  },

  // Expanded Steps (New/Existing Project)
  helpSubtitle: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    marginBottom: spacing.sm,
  },
  helpStepsScroll: {
    maxHeight: 220,
  },
  helpStepItemFull: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  helpStepContentFull: {
    flex: 1,
    gap: 2,
  },
  helpStepPhase: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
  },

  // CTA Button
  helpCTAButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: "#10B981",
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  helpCTAText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: "#fff",
  },

  // Best Practices
  helpBestPractices: {
    gap: spacing.sm,
  },
  helpBestPracticeItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
  },
  helpBestPracticeIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "#8B5CF620",
    alignItems: "center",
    justifyContent: "center",
  },
  helpBestPracticeContent: {
    flex: 1,
    gap: 2,
  },
  helpBestPracticeTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "right",
  },
  helpBestPracticeDesc: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
  },
});
