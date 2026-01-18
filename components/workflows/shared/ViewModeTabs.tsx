import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

type ViewMode =
  | "fullFlow"
  | "categories"
  | "phases"
  | "useCases"
  | "skills"
  | "components"
  | "hardStops"
  | "plugins"
  | "responsive";

interface ViewModeTabsProps {
  activeMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const VIEW_MODE_TABS = [
  {
    id: "fullFlow" as const,
    label: "הזרימה המלאה",
    icon: "git-network-outline" as const,
  },
  {
    id: "categories" as const,
    label: "קטגוריות",
    icon: "grid-outline" as const,
  },
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
  {
    id: "skills" as const,
    label: "סקילים",
    icon: "flash-outline" as const,
  },
  {
    id: "components" as const,
    label: "קומפוננטות",
    icon: "cube-outline" as const,
  },
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
    id: "hardStops" as const,
    label: "Hard Stops",
    icon: "warning-outline" as const,
  },
];

export function ViewModeTabs({ activeMode, onModeChange }: ViewModeTabsProps) {
  return (
    <View style={styles.viewModeTabs}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.viewModeContent}
      >
        {VIEW_MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;

          return (
            <ScalePress
              key={tab.id}
              onPress={() => onModeChange(tab.id)}
              style={[styles.viewModeTab, isActive && styles.viewModeTabActive]}
              haptic="light"
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={16}
                color={isActive ? colors.accent.primary : colors.text.secondary}
              />
              <Text
                style={[
                  styles.viewModeTabText,
                  isActive && styles.viewModeTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </ScalePress>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
