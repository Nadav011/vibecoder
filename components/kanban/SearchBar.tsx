import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { useKanbanStore } from "../../stores";
import { TaskPriority, PRIORITY_CONFIG } from "../../types";
import { FadeIn, ScalePress } from "../animated";
import { haptics } from "../../utils/haptics";
import { strings } from "../../utils/strings";

export function SearchBar() {
  const { filter, setFilter, clearFilter } = useKanbanStore();
  const hasActiveFilters =
    filter.searchQuery ||
    filter.priorities.length > 0 ||
    filter.labels.length > 0;

  return (
    <FadeIn delay={0} direction="down">
      <View style={styles.container}>
        {/* Search input */}
        <View style={styles.searchRow}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={18} color={colors.text.muted} />
            <TextInput
              style={styles.input}
              placeholder={strings.searchTasks}
              placeholderTextColor={colors.text.muted}
              value={filter.searchQuery}
              onChangeText={(text) => setFilter({ searchQuery: text })}
              textAlign="right"
            />
            {filter.searchQuery && (
              <ScalePress
                onPress={() => {
                  haptics.light();
                  setFilter({ searchQuery: "" });
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                scale={0.9}
                haptic="none"
                accessibilityRole="button"
                accessibilityLabel="נקה חיפוש"
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.text.muted}
                />
              </ScalePress>
            )}
          </View>

          {hasActiveFilters && (
            <ScalePress
              onPress={() => {
                haptics.light();
                clearFilter();
              }}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="נקה את כל הפילטרים"
            >
              <Text style={styles.clearText}>{strings.clear}</Text>
            </ScalePress>
          )}
        </View>

        {/* Quick filters */}
        <View style={styles.filtersRow}>
          {/* Priority filters */}
          {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(
            (priority, index) => {
              const config = PRIORITY_CONFIG[priority];
              const isActive = filter.priorities.includes(priority);
              const hebrewLabel =
                strings.priorities[priority as keyof typeof strings.priorities];

              return (
                <FadeIn key={priority} delay={index * 30} direction="right">
                  <ScalePress
                    onPress={() => {
                      haptics.selection();
                      const newPriorities = isActive
                        ? filter.priorities.filter((p) => p !== priority)
                        : [...filter.priorities, priority];
                      setFilter({ priorities: newPriorities });
                    }}
                    style={[
                      styles.filterChip,
                      isActive && { backgroundColor: config.color + "30" },
                    ]}
                    haptic="none"
                  >
                    <Ionicons
                      name={config.icon as keyof typeof Ionicons.glyphMap}
                      size={12}
                      color={isActive ? config.color : colors.text.muted}
                    />
                    <Text
                      style={[
                        styles.filterText,
                        isActive && { color: config.color },
                      ]}
                    >
                      {hebrewLabel}
                    </Text>
                  </ScalePress>
                </FadeIn>
              );
            },
          )}

          {/* AI filter */}
          <FadeIn delay={120} direction="right">
            <ScalePress
              onPress={() => {
                haptics.selection();
                const current = filter.showAiGenerated;
                const next = current === null ? true : current ? false : null;
                setFilter({ showAiGenerated: next });
              }}
              style={[
                styles.filterChip,
                filter.showAiGenerated !== null && {
                  backgroundColor: colors.accent.primary + "30",
                },
              ]}
              haptic="none"
            >
              <Ionicons
                name="sparkles"
                size={12}
                color={
                  filter.showAiGenerated !== null
                    ? colors.accent.primary
                    : colors.text.muted
                }
              />
              <Text
                style={[
                  styles.filterText,
                  filter.showAiGenerated !== null && {
                    color: colors.accent.primary,
                  },
                ]}
              >
                {filter.showAiGenerated === null
                  ? strings.ai
                  : filter.showAiGenerated
                    ? strings.aiOnly
                    : strings.noAi}
              </Text>
            </ScalePress>
          </FadeIn>
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  searchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.md,
    paddingVertical: spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearText: {
    color: colors.accent.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  filtersRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.full,
  },
  filterText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
