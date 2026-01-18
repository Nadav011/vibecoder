import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { FadeIn, ScalePress } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { Plugin } from "../../../data/workflows";

interface PluginsViewProps {
  plugins: Plugin[];
  expandedPluginId: string | null;
  onExpandPlugin: (pluginId: string | null) => void;
  onCopyCommand: (command: string) => void;
}

export function PluginsView({
  plugins,
  expandedPluginId,
  onExpandPlugin,
  onCopyCommand,
}: PluginsViewProps) {
  const copyToClipboard = async (text: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(text);
    }
    haptics.light();
    onCopyCommand(text);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{plugins.length} פלאגינים</Text>
      <Text style={styles.sectionSubtitle}>
        תוספים לשיפור העבודה עם Claude Code
      </Text>

      <View style={styles.pluginsGrid}>
        {plugins.map((plugin, index) => (
          <FadeIn key={plugin.id} delay={100 + index * 50} direction="up">
            <View style={styles.pluginCard}>
              <View style={styles.pluginHeader}>
                <Ionicons
                  name="extension-puzzle"
                  size={24}
                  color={colors.accent.primary}
                />
                <Text style={styles.pluginName}>{plugin.name}</Text>
              </View>
              <Text style={styles.pluginDescription}>{plugin.description}</Text>
              <View style={styles.pluginCommands}>
                {(expandedPluginId === plugin.id
                  ? plugin.commands
                  : plugin.commands.slice(0, 3)
                ).map((cmd) => (
                  <ScalePress
                    key={cmd.id}
                    onPress={() => copyToClipboard(cmd.command)}
                    style={styles.pluginCommandBadge}
                    haptic="light"
                  >
                    <Text style={styles.pluginCommandText}>{cmd.command}</Text>
                  </ScalePress>
                ))}
                {plugin.commands.length > 3 && (
                  <ScalePress
                    onPress={() => {
                      haptics.light();
                      onExpandPlugin(
                        expandedPluginId === plugin.id ? null : plugin.id,
                      );
                    }}
                    style={styles.pluginMoreButton}
                    haptic="light"
                  >
                    <Text style={styles.pluginMore}>
                      {expandedPluginId === plugin.id
                        ? "הסתר"
                        : `+${plugin.commands.length - 3} עוד`}
                    </Text>
                    <Ionicons
                      name={
                        expandedPluginId === plugin.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={12}
                      color={colors.text.muted}
                    />
                  </ScalePress>
                )}
              </View>
            </View>
          </FadeIn>
        ))}
      </View>
    </View>
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
  pluginsGrid: {
    gap: spacing.md,
  },
  pluginCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  pluginHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  pluginName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  pluginDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
  },
  pluginCommands: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  pluginCommandBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  pluginCommandText: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  pluginMoreButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.tertiary,
  },
  pluginMore: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
});
