import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

type PlatformFilter = "all" | "web" | "flutter";

interface PlatformCounts {
  all: number;
  web: number;
  flutter: number;
}

interface PlatformToggleProps {
  value: PlatformFilter;
  onChange: (platform: PlatformFilter) => void;
  counts: PlatformCounts;
}

const PLATFORMS = [
  {
    id: "all" as const,
    label: "הכל",
    icon: "apps-outline" as const,
  },
  {
    id: "web" as const,
    label: "Web",
    icon: "globe-outline" as const,
  },
  {
    id: "flutter" as const,
    label: "Flutter",
    icon: "phone-portrait-outline" as const,
  },
];

export function PlatformToggle({
  value,
  onChange,
  counts,
}: PlatformToggleProps) {
  return (
    <View style={styles.platformToggle}>
      {PLATFORMS.map((platform) => {
        const isActive = value === platform.id;
        const isFlutterActive = platform.id === "flutter" && isActive;

        return (
          <ScalePress
            key={platform.id}
            onPress={() => onChange(platform.id)}
            style={[
              styles.platformButton,
              isActive && styles.platformButtonActive,
              isFlutterActive && styles.platformButtonFlutter,
            ]}
            haptic="light"
          >
            <Ionicons
              name={platform.icon as keyof typeof Ionicons.glyphMap}
              size={14}
              color={
                isActive
                  ? isFlutterActive
                    ? "#02D7F2"
                    : colors.accent.primary
                  : colors.text.secondary
              }
            />
            <Text
              style={[
                styles.platformButtonText,
                isActive && styles.platformButtonTextActive,
                isFlutterActive && styles.platformButtonTextFlutter,
              ]}
            >
              {platform.label}
            </Text>
            <View
              style={[
                styles.platformBadge,
                isActive && styles.platformBadgeActive,
                isFlutterActive && styles.platformBadgeFlutter,
              ]}
            >
              <Text
                style={[
                  styles.platformBadgeText,
                  isActive && styles.platformBadgeTextActive,
                ]}
              >
                {counts[platform.id]}
              </Text>
            </View>
          </ScalePress>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  platformToggle: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  platformButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  platformButtonActive: {
    backgroundColor: colors.accent.primaryGlow,
    borderColor: colors.accent.primary,
  },
  platformButtonFlutter: {
    backgroundColor: "rgba(2, 215, 242, 0.1)",
    borderColor: "#02D7F2",
  },
  platformButtonText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  platformButtonTextActive: {
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },
  platformButtonTextFlutter: {
    color: "#02D7F2",
  },
  platformBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.bg.primary,
  },
  platformBadgeActive: {
    backgroundColor: colors.accent.primary,
  },
  platformBadgeFlutter: {
    backgroundColor: "#02D7F2",
  },
  platformBadgeText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontWeight: typography.weight.medium,
  },
  platformBadgeTextActive: {
    color: colors.text.inverse,
  },
});
