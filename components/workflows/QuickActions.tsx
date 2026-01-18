import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated";
import { haptics } from "../../utils/haptics";
import { Command, buildFullCommand } from "../../data/workflows";

interface QuickActionsProps {
  commands: Command[];
  onCopy?: (text: string) => void;
}

const QUICK_ACTION_CONFIG: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  boot: { icon: "power", color: "#F43F5E" },
  scan: { icon: "search", color: "#818CF8" },
  audit: { icon: "checkmark-circle", color: "#F97316" },
  fix: { icon: "hammer", color: "#EF4444" },
  god: { icon: "flash", color: "#EF4444" },
  "verify-app": { icon: "eye", color: "#10B981" },
  "git-commit": { icon: "git-commit", color: "#14B8A6" },
  // New skills (Phase 5.5, 6, EMERGENCY)
  "deploy-staging": { icon: "cloud-upload", color: "#10B981" },
  "monitor-status": { icon: "analytics", color: "#3B82F6" },
  "hotfix-start": { icon: "flame", color: "#EF4444" },
};

export function QuickActions({ commands, onCopy }: QuickActionsProps) {
  const copyToClipboard = async (cmd: Command) => {
    const text = buildFullCommand(cmd, true);
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.light();
    onCopy?.(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>פעולות מהירות</Text>
      <View style={styles.grid}>
        {commands.map((cmd) => {
          const config = QUICK_ACTION_CONFIG[cmd.id] || {
            icon: "terminal-outline",
            color: colors.accent.primary,
          };

          return (
            <ScalePress
              key={cmd.id}
              onPress={() => copyToClipboard(cmd)}
              style={[
                styles.quickAction,
                {
                  borderColor: `${config.color}30`,
                  ...(Platform.OS === "web"
                    ? { boxShadow: `0px 2px 8px ${config.color}26` }
                    : {
                        shadowColor: config.color,
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                      }),
                },
              ]}
              haptic="light"
            >
              <View
                style={[
                  styles.iconWrapper,
                  {
                    backgroundColor: `${config.color}20`,
                    borderWidth: 1,
                    borderColor: `${config.color}40`,
                  },
                ]}
              >
                <Ionicons name={config.icon} size={22} color={config.color} />
              </View>
              <Text style={[styles.commandText, { color: config.color }]}>
                {cmd.command}
              </Text>
              <Text style={styles.descriptionText} numberOfLines={1}>
                {cmd.description}
              </Text>
            </ScalePress>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  quickAction: {
    backgroundColor: colors.glass.bg,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 100,
    flex: 1,
    maxWidth: 150,
    borderWidth: 1,
    borderColor: colors.glass.border,
    // Glass morphism effect
    ...(Platform.OS === "web" && {
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "all 0.2s ease",
    }),
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  commandText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  descriptionText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
