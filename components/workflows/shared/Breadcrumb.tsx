import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (itemId: string, index: number) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbRow}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !isLast;

          const ItemContent = (
            <View style={styles.itemContent}>
              {item.icon && (
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={12}
                  color={isLast ? colors.text.primary : colors.accent.primary}
                />
              )}
              <Text
                style={[
                  styles.itemLabel,
                  isLast && styles.itemLabelActive,
                  isClickable && styles.itemLabelClickable,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          );

          return (
            <View key={item.id} style={styles.itemWrapper}>
              {isClickable ? (
                <ScalePress
                  onPress={() => onNavigate(item.id, index)}
                  style={styles.clickableItem}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={`חזור ל-${item.label}`}
                >
                  {ItemContent}
                </ScalePress>
              ) : (
                ItemContent
              )}
              {!isLast && (
                <Ionicons
                  name="chevron-back"
                  size={12}
                  color={colors.text.muted}
                  style={styles.separator}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
  },
  breadcrumbRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  itemContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  clickableItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
  },
  itemLabel: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
    writingDirection: "rtl",
  },
  itemLabelActive: {
    color: colors.text.primary,
    fontWeight: typography.weight.medium,
  },
  itemLabelClickable: {
    color: colors.accent.primary,
  },
  separator: {
    marginHorizontal: spacing.xs,
  },
});
