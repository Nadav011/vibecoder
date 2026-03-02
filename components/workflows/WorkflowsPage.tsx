// ================================
// WORKFLOWS PAGE - Enhanced UI Version
// ================================
// Features:
// - Grouped category tabs (4 categories instead of 9 tabs)
// - Global progress tracking
// - Copy history panel (FAB)
// - Breadcrumb navigation
// - Beginner mode toggle
// - Search with results count and history
// - APEX-UI compliant (spring animations, WCAG AAA, RTL)

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { haptics } from "../../utils/haptics";
import {
  PHASES,
  HARD_STOPS,
  PLUGINS,
  BREAKPOINTS,
  DEVICES,
  TOUCH_TARGETS,
  TOTAL_COMMANDS,
  getCommandsByCategory,
  getFlutterPhases,
  getWebPhases,
} from "../../data/workflows";
import { CommandCard } from "./CommandCard";

// Modular imports
import { useWorkflowsState, ViewMode } from "./hooks";
import {
  WorkflowsHeader,
  WorkflowsSearch,
  PlatformToggle,
  CategoryTabs,
  Breadcrumb,
  GlobalProgress,
  CopyHistoryPanel,
} from "./shared";
import {
  FullFlowView,
  CategoriesView,
  PhasesView,
  UseCasesView,
  SkillsView,
  HardStopsView,
  PluginsView,
  ResponsiveView,
} from "./views";

export function WorkflowsPage() {
  const router = useRouter();

  // All state and logic extracted to custom hook
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    platformFilter,
    setPlatformFilter,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedFlowId,
    setSelectedFlowId,
    expandedSkillName,
    setExpandedSkillName,
    expandedPhaseId,
    setExpandedPhaseId,
    expandedPluginId,
    setExpandedPluginId,
    filteredPhases,
    filteredSkills,
    filteredUseCases,
    filteredProjectFlows,
    filteredCategories,
    allSearchResults,
    toggleStepComplete,
    isStepCompleted,
    getFlowProgress,
    handleCopy,
    copyUseCaseCommands,
    // NEW: Enhanced features
    recentCopies,
    clearRecentCopies,
    isBeginnerMode,
    setIsBeginnerMode,
    searchHistory,
    isProgressExpanded,
    setIsProgressExpanded,
    categoryProgress,
    totalProgress,
    breadcrumbItems,
    navigateBreadcrumb,
  } = useWorkflowsState();

  // Copy command to clipboard
  const onCopyCommand = async (command: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(command);
    }
    haptics.success();
    handleCopy(command);
  };

  // Render the appropriate view based on viewMode
  const renderContent = () => {
    // If searching, show search results
    if (searchQuery.trim()) {
      return (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {allSearchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={48}
                color={colors.text.muted}
              />
              <Text style={styles.emptyStateTitle}>לא נמצאו תוצאות</Text>
              <Text style={styles.emptyStateText}>
                נסה לחפש מילה אחרת או בדוק את האיות
              </Text>
            </View>
          ) : (
            allSearchResults.map((cmd) => (
              <CommandCard
                key={cmd.id}
                command={cmd}
                onCopy={onCopyCommand}
                isBeginnerMode={isBeginnerMode}
                searchQuery={searchQuery}
              />
            ))
          )}
        </ScrollView>
      );
    }

    // Otherwise render view-specific content
    switch (viewMode) {
      case "fullFlow":
        return (
          <FullFlowView
            phases={filteredPhases}
            expandedPhaseId={expandedPhaseId}
            onExpandPhase={setExpandedPhaseId}
            onCopyCommand={onCopyCommand}
            platformFilter={platformFilter}
          />
        );

      case "categories":
        return (
          <CategoriesView
            categories={filteredCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onCopyCommand={onCopyCommand}
            getCommandsByCategory={getCommandsByCategory}
            allCategories={filteredCategories}
            isBeginnerMode={isBeginnerMode}
            searchQuery={searchQuery}
          />
        );

      case "phases":
        return (
          <PhasesView
            projectFlows={filteredProjectFlows}
            phases={filteredPhases}
            selectedFlowId={selectedFlowId}
            onSelectFlow={setSelectedFlowId}
            isStepCompleted={isStepCompleted}
            toggleStepComplete={toggleStepComplete}
            getFlowProgress={getFlowProgress}
            onCopyCommand={onCopyCommand}
          />
        );

      case "useCases":
        return (
          <UseCasesView
            projectFlows={filteredProjectFlows}
            useCases={filteredUseCases}
            phases={filteredPhases}
            onCopyCommand={onCopyCommand}
            onCopyUseCase={copyUseCaseCommands}
          />
        );

      case "skills":
        return (
          <SkillsView
            skills={filteredSkills}
            phases={PHASES}
            expandedSkillName={expandedSkillName}
            onExpandSkill={setExpandedSkillName}
            onCopyCommand={onCopyCommand}
          />
        );

      case "hardStops":
        return (
          <HardStopsView hardStops={HARD_STOPS} onCopyCommand={onCopyCommand} />
        );

      case "plugins":
        return (
          <PluginsView
            plugins={PLUGINS}
            expandedPluginId={expandedPluginId}
            onExpandPlugin={setExpandedPluginId}
            onCopyCommand={onCopyCommand}
          />
        );

      case "responsive":
      case "components":
        return (
          <ResponsiveView
            breakpoints={BREAKPOINTS}
            devices={DEVICES}
            touchTargets={TOUCH_TARGETS}
            onCopyCommand={onCopyCommand}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <WorkflowsHeader
        onBack={() => router.back()}
        commandCount={TOTAL_COMMANDS}
      />

      {/* Search with enhanced features */}
      <WorkflowsSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        resultsCount={searchQuery.trim() ? allSearchResults.length : undefined}
        searchHistory={searchHistory}
      />

      {/* Beginner Mode Toggle - only when not searching */}
      {!searchQuery && (
        <View style={styles.toggleRow}>
          <View style={styles.toggleContent}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={isBeginnerMode ? colors.accent.warning : colors.text.muted}
            />
            <Text style={styles.toggleLabel}>מצב מתחילים</Text>
          </View>
          <Switch
            value={isBeginnerMode}
            onValueChange={(value) => {
              setIsBeginnerMode(value);
              haptics.selection();
            }}
            trackColor={{
              false: colors.bg.tertiary,
              true: colors.accent.warningGlow,
            }}
            thumbColor={
              isBeginnerMode ? colors.accent.warning : colors.text.muted
            }
          />
        </View>
      )}

      {/* Platform Filter Toggle - only when not searching */}
      {!searchQuery && (
        <PlatformToggle
          value={platformFilter}
          onChange={setPlatformFilter}
          counts={{
            all: PHASES.length,
            web: getWebPhases().length,
            flutter: getFlutterPhases().length,
          }}
        />
      )}

      {/* Global Progress - only when not searching */}
      {!searchQuery && totalProgress.total > 0 && (
        <GlobalProgress
          categories={categoryProgress}
          totalCompleted={totalProgress.completed}
          totalItems={totalProgress.total}
          isExpanded={isProgressExpanded}
          onToggleExpand={() => setIsProgressExpanded(!isProgressExpanded)}
        />
      )}

      {/* Category Tabs (grouped) - only when not searching */}
      {!searchQuery && (
        <CategoryTabs
          activeMode={viewMode}
          onModeChange={(mode) => setViewMode(mode as ViewMode)}
        />
      )}

      {/* Breadcrumb - only when in sub-views */}
      {!searchQuery && breadcrumbItems.length > 2 && (
        <Breadcrumb items={breadcrumbItems} onNavigate={navigateBreadcrumb} />
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>{renderContent()}</View>

      {/* Copy History FAB - always visible if there's history */}
      <CopyHistoryPanel
        recentCopies={recentCopies}
        onCopyAgain={onCopyCommand}
        onClear={clearRecentCopies}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  mainContent: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  toggleContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  toggleLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  emptyStateTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  emptyStateText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
