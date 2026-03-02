import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

export type ViewMode =
  | "fullFlow"
  | "categories"
  | "phases"
  | "useCases"
  | "skills"
  | "components"
  | "hardStops"
  | "plugins"
  | "responsive";

interface CategoryTabsProps {
  activeMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

// Grouped categories with their view modes
const CATEGORIES = [
  {
    id: "start",
    label: "התחלה",
    icon: "rocket-outline" as const,
    color: colors.accent.success,
    views: [
      {
        id: "phases" as const,
        label: "שלבים",
        icon: "layers-outline" as const,
      },
      {
        id: "useCases" as const,
        label: "תבניות",
        icon: "document-text-outline" as const,
      },
    ],
  },
  {
    id: "learn",
    label: "למידה",
    icon: "book-outline" as const,
    color: colors.accent.primary,
    views: [
      {
        id: "fullFlow" as const,
        label: "זרימה",
        icon: "git-network-outline" as const,
      },
      {
        id: "skills" as const,
        label: "סקילים",
        icon: "flash-outline" as const,
      },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    icon: "library-outline" as const,
    color: colors.accent.info,
    views: [
      {
        id: "categories" as const,
        label: "קטגוריות",
        icon: "grid-outline" as const,
      },
      {
        id: "hardStops" as const,
        label: "Hard Stops",
        icon: "warning-outline" as const,
      },
    ],
  },
  {
    id: "tools",
    label: "כלים",
    icon: "construct-outline" as const,
    color: colors.accent.warning,
    views: [
      {
        id: "plugins" as const,
        label: "פלאגינים",
        icon: "extension-puzzle-outline" as const,
      },
      {
        id: "responsive" as const,
        label: "רספונסיב",
        icon: "phone-portrait-outline" as const,
      },
      {
        id: "components" as const,
        label: "קומפוננטות",
        icon: "cube-outline" as const,
      },
    ],
  },
];

// Find which category contains the active view
function findActiveCategory(viewMode: ViewMode): string {
  for (const category of CATEGORIES) {
    if (category.views.some((v) => v.id === viewMode)) {
      return category.id;
    }
  }
  return "start";
}

export function CategoryTabs({ activeMode, onModeChange }: CategoryTabsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    findActiveCategory(activeMode),
  );

  const handleCategoryPress = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // Collapse if already expanded
      setExpandedCategory(null);
    } else {
      // Expand and auto-select first view in category
      setExpandedCategory(categoryId);
      const category = CATEGORIES.find((c) => c.id === categoryId);
      if (category && category.views.length > 0) {
        // Only auto-select if current view is not in this category
        const currentInCategory = category.views.some(
          (v) => v.id === activeMode,
        );
        if (!currentInCategory) {
          onModeChange(category.views[0].id);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Main category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const hasActiveView = category.views.some((v) => v.id === activeMode);

          return (
            <ScalePress
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={[
                styles.categoryTab,
                isExpanded && styles.categoryTabExpanded,
                hasActiveView && { borderColor: category.color },
              ]}
              haptic="light"
              accessibilityRole="tab"
              accessibilityState={{ selected: isExpanded }}
              accessibilityLabel={`קטגוריה: ${category.label}`}
            >
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={hasActiveView ? category.color : colors.text.secondary}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  hasActiveView && { color: category.color },
                ]}
              >
                {category.label}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={14}
                color={colors.text.muted}
              />
            </ScalePress>
          );
        })}
      </ScrollView>

      {/* Sub-views for expanded category */}
      {expandedCategory && (
        <View style={styles.subViewsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subViewsContent}
          >
            {CATEGORIES.find((c) => c.id === expandedCategory)?.views.map(
              (view) => {
                const isActive = activeMode === view.id;
                const categoryColor =
                  CATEGORIES.find((c) => c.id === expandedCategory)?.color ||
                  colors.accent.primary;

                return (
                  <ScalePress
                    key={view.id}
                    onPress={() => onModeChange(view.id)}
                    style={[
                      styles.subViewTab,
                      isActive && styles.subViewTabActive,
                      isActive && {
                        borderColor: categoryColor,
                        backgroundColor: `${categoryColor}15`,
                      },
                    ]}
                    haptic="selection"
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={view.label}
                  >
                    <Ionicons
                      name={view.icon as keyof typeof Ionicons.glyphMap}
                      size={14}
                      color={isActive ? categoryColor : colors.text.secondary}
                    />
                    <Text
                      style={[
                        styles.subViewLabel,
                        isActive && {
                          color: categoryColor,
                          fontWeight: typography.weight.semibold,
                        },
                      ]}
                    >
                      {view.label}
                    </Text>
                  </ScalePress>
                );
              },
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  categoriesContainer: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryTab: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  categoryTabExpanded: {
    backgroundColor: colors.bg.tertiary,
    borderColor: colors.border.hover,
  },
  categoryLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  subViewsContainer: {
    backgroundColor: colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  subViewsContent: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  subViewTab: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  subViewTabActive: {
    borderWidth: 1,
  },
  subViewLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
});
