import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

interface CategoryProgress {
  id: string;
  label: string;
  icon: string;
  completed: number;
  total: number;
  color: string;
}

interface GlobalProgressProps {
  categories: CategoryProgress[];
  totalCompleted: number;
  totalItems: number;
  onCategoryPress?: (categoryId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function GlobalProgress({
  categories,
  totalCompleted,
  totalItems,
  onCategoryPress,
  isExpanded = false,
  onToggleExpand,
}: GlobalProgressProps) {
  const totalPercent =
    totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Main progress header */}
      <ScalePress
        onPress={onToggleExpand}
        style={styles.header}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={`התקדמות כללית: ${totalPercent}%`}
      >
        <View style={styles.headerContent}>
          <Ionicons
            name="stats-chart"
            size={16}
            color={colors.accent.primary}
          />
          <Text style={styles.headerText}>
            התקדמות כללית: {totalCompleted}/{totalItems}
          </Text>
          <Text style={styles.percentText}>({totalPercent}%)</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.text.muted}
        />
      </ScalePress>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBarFill, { width: `${totalPercent}%` }]}
        />
      </View>

      {/* Expanded category details */}
      {isExpanded && categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {categories.map((category) => {
            const categoryPercent =
              category.total > 0
                ? Math.round((category.completed / category.total) * 100)
                : 0;

            return (
              <ScalePress
                key={category.id}
                onPress={() => onCategoryPress?.(category.id)}
                style={styles.categoryItem}
                haptic="selection"
                accessibilityRole="button"
                accessibilityLabel={`${category.label}: ${categoryPercent}%`}
              >
                <View style={styles.categoryHeader}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: `${category.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={category.icon as keyof typeof Ionicons.glyphMap}
                      size={12}
                      color={category.color}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <Text
                    style={[styles.categoryPercent, { color: category.color }]}
                  >
                    {category.completed}/{category.total}
                  </Text>
                </View>
                <View style={styles.categoryProgressBar}>
                  <View
                    style={[
                      styles.categoryProgressFill,
                      {
                        width: `${categoryPercent}%`,
                        backgroundColor: category.color,
                      },
                    ]}
                  />
                </View>
              </ScalePress>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  headerContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerText: {
    fontSize: typography.size.sm,
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  percentText: {
    fontSize: typography.size.sm,
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
  },
  categoriesContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  categoryItem: {
    padding: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  categoryHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  categoryPercent: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
});
