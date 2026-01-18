import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { CommandCard } from "../CommandCard";
import type { Category, Command } from "../../../data/workflows";

const { width } = Dimensions.get("window");
const isWideScreen = width > 768;

interface CategoriesViewProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onCopyCommand: (command: string) => void;
  getCommandsByCategory: (categoryId: string) => Command[];
  allCategories: Category[];
}

export function CategoriesView({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCopyCommand,
  getCommandsByCategory,
  allCategories,
}: CategoriesViewProps) {
  // Categories Grid (no category selected)
  if (!selectedCategoryId) {
    return (
      <FadeIn delay={50} direction="up">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>קטגוריות</Text>
          <Text style={styles.sectionSubtitle}>פקודות מאורגנות לפי תחום</Text>

          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => {
              const commandCount = getCommandsByCategory(category.id).length;
              return (
                <FadeIn
                  key={category.id}
                  delay={100 + index * 50}
                  direction="up"
                >
                  <ScalePress
                    onPress={() => onSelectCategory(category.id)}
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
                        name={category.icon as keyof typeof Ionicons.glyphMap}
                        size={28}
                        color={category.color}
                      />
                    </View>
                    <Text style={styles.categoryName}>{category.nameHe}</Text>
                    <Text style={styles.categoryNameEn}>{category.name}</Text>
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
    );
  }

  // Category Detail View (category selected)
  const category = allCategories.find((c) => c.id === selectedCategoryId);
  const commands = getCommandsByCategory(selectedCategoryId);
  if (!category) return null;

  return (
    <FadeIn delay={50} direction="up">
      <View style={styles.section}>
        <ScalePress
          onPress={() => onSelectCategory(null)}
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
            <Text style={styles.categoryDetailName}>{category.nameHe}</Text>
            <Text style={styles.categoryDetailNameEn}>{category.name}</Text>
            <Text style={styles.categoryDetailCount}>
              {commands.length} פקודות
            </Text>
          </View>
        </View>

        <View style={styles.commandsList}>
          {commands.map((cmd, index) => (
            <FadeIn key={cmd.id} delay={100 + index * 30} direction="up">
              <CommandCard
                command={cmd}
                phaseColor={category.color}
                onCopy={onCopyCommand}
              />
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
  commandsList: {
    gap: spacing.md,
  },
});
