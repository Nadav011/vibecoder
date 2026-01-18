// ================================
// WORKFLOWS PAGE - Modular Version
// ================================
// This component has been refactored from 5,300+ lines to ~300 lines
// by extracting logic to hooks and UI to separate view components

import React from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../theme";
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
  ViewModeTabs,
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
          {allSearchResults.map((cmd) => (
            <CommandCard key={cmd.id} command={cmd} onCopy={onCopyCommand} />
          ))}
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

      {/* Search */}
      <WorkflowsSearch value={searchQuery} onChangeText={setSearchQuery} />

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

      {/* View Mode Tabs - only when not searching */}
      {!searchQuery && (
        <ViewModeTabs
          activeMode={viewMode}
          onModeChange={(mode) => setViewMode(mode as ViewMode)}
        />
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>{renderContent()}</View>
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
});
