import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated";
import { haptics } from "../../utils/haptics";
import { Command, buildFullCommand } from "../../data/workflows";

interface CommandCardProps {
  command: Command;
  phaseColor?: string;
  onCopy?: (text: string) => void;
}

export function CommandCard({
  command,
  phaseColor = colors.accent.primary,
  onCopy,
}: CommandCardProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const copyToClipboard = async (text: string) => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        // Fallback for older browsers or permission denied
        console.warn("[Clipboard] Failed to copy:", error);
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        } catch {
          // Silent fail - clipboard copy not critical
        }
      }
    }
    haptics.light();
    setCopied(true);
    onCopy?.(text);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = () => {
    const fullCommand = buildFullCommand(command, true);
    copyToClipboard(fullCommand);
  };

  const handleCopyWithDescription = () => {
    const text = `${command.description}\n${buildFullCommand(command, true)}`;
    copyToClipboard(text);
    setShowOptions(false);
  };

  const handleCopyAsCodeBlock = () => {
    const text = `\`\`\`bash\n${buildFullCommand(command, true)}\n\`\`\``;
    copyToClipboard(text);
    setShowOptions(false);
  };

  const handleCopyCommandOnly = () => {
    copyToClipboard(command.command);
    setShowOptions(false);
  };

  const handleCopyWithAllFlags = () => {
    let text = command.command;
    if (command.flags?.length) {
      text += " " + command.flags.join(" ");
    }
    if (command.params) {
      text += " " + command.params;
    }
    copyToClipboard(text);
    setShowOptions(false);
  };

  return (
    <View
      style={[
        styles.container,
        { borderStartColor: phaseColor, borderStartWidth: 3 },
      ]}
    >
      {/* Command Header */}
      <View style={styles.header}>
        <View style={styles.commandWrapper}>
          <Text style={[styles.command, { color: phaseColor }]}>
            {command.command}
          </Text>
          {command.flags?.map((flag) => (
            <ScalePress
              key={flag}
              onPress={() => copyToClipboard(`${command.command} ${flag}`)}
              style={styles.flagBadge}
              haptic="light"
            >
              <Text style={styles.flag}>{flag}</Text>
            </ScalePress>
          ))}
          {command.params && (
            <Text style={styles.params}>{command.params}</Text>
          )}
        </View>

        {/* Copy Button */}
        <ScalePress
          onPress={handleCopyCommand}
          style={[styles.copyButton, copied && styles.copyButtonCopied]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={copied ? "הועתק" : "העתק פקודה"}
        >
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={18}
            color={copied ? colors.status.success : colors.text.secondary}
          />
        </ScalePress>
      </View>

      {/* Description */}
      <Text style={styles.description}>{command.description}</Text>

      {/* Meta Info Row */}
      <View style={styles.metaRow}>
        {/* Output if exists */}
        {command.output && (
          <View style={styles.outputWrapper}>
            <Ionicons
              name="arrow-forward-outline"
              size={12}
              color={colors.text.muted}
            />
            <Text style={styles.output}>{command.output}</Text>
          </View>
        )}

        {/* Requirement if exists */}
        {command.requirement && (
          <View style={styles.requirementWrapper}>
            <Ionicons
              name="checkmark-circle-outline"
              size={12}
              color={colors.accent.success}
            />
            <Text style={styles.requirement}>{command.requirement}</Text>
          </View>
        )}

        {/* Time Estimate if exists */}
        {command.timeEstimate && (
          <View style={styles.timeWrapper}>
            <Ionicons name="time-outline" size={12} color={colors.text.muted} />
            <Text style={styles.timeText}>{command.timeEstimate}</Text>
          </View>
        )}

        {/* Autonomous badge */}
        {command.isAutonomous && (
          <View style={styles.autonomousBadge}>
            <Ionicons name="flash" size={10} color={colors.accent.warning} />
            <Text style={styles.autonomousText}>אוטונומי</Text>
          </View>
        )}
      </View>

      {/* Shortcut if exists */}
      {command.shortcut && (
        <ScalePress
          onPress={() => copyToClipboard(command.shortcut!)}
          style={styles.shortcutWrapper}
          haptic="light"
        >
          <Ionicons name="link-outline" size={12} color={colors.text.muted} />
          <Text style={styles.shortcut}>קיצור: {command.shortcut}</Text>
          <Ionicons
            name="copy-outline"
            size={10}
            color={colors.text.muted}
            style={styles.shortcutCopyIcon}
          />
        </ScalePress>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <ScalePress
          onPress={handleCopyCommand}
          style={[styles.actionButton, styles.primaryAction]}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel="העתק פקודה"
        >
          <Ionicons name="copy-outline" size={14} color={colors.text.primary} />
          <Text style={[styles.actionText, styles.primaryActionText]}>
            העתק
          </Text>
        </ScalePress>

        <ScalePress
          onPress={() => setShowOptions(!showOptions)}
          style={styles.actionButton}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={showOptions ? "סגור אפשרויות" : "פתח אפשרויות"}
        >
          <Ionicons
            name={showOptions ? "chevron-up" : "options-outline"}
            size={14}
            color={colors.text.secondary}
          />
          <Text style={styles.actionText}>אפשרויות</Text>
        </ScalePress>

        {command.flags && command.flags.length > 0 && (
          <ScalePress
            onPress={handleCopyWithAllFlags}
            style={styles.actionButton}
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel="העתק עם כל הפלאגים"
          >
            <Ionicons
              name="code-slash-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.actionText}>עם פלאגים</Text>
          </ScalePress>
        )}
      </View>

      {/* Copy Options */}
      {showOptions && (
        <View style={styles.optionsMenu}>
          <ScalePress
            onPress={handleCopyCommandOnly}
            style={styles.optionItem}
            haptic="light"
          >
            <Ionicons
              name="terminal-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.optionText}>העתק רק פקודה</Text>
            <Text style={styles.optionPreview}>{command.command}</Text>
          </ScalePress>

          <ScalePress
            onPress={handleCopyWithDescription}
            style={styles.optionItem}
            haptic="light"
          >
            <Ionicons
              name="document-text-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.optionText}>העתק עם תיאור</Text>
          </ScalePress>

          <ScalePress
            onPress={handleCopyAsCodeBlock}
            style={styles.optionItem}
            haptic="light"
          >
            <Ionicons
              name="code-slash-outline"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.optionText}>העתק כ-code block</Text>
          </ScalePress>

          {command.flags && command.flags.length > 1 && (
            <>
              <View style={styles.optionDivider} />
              <Text style={styles.optionSectionTitle}>פלאגים נפרדים:</Text>
              {command.flags.map((flag) => (
                <ScalePress
                  key={flag}
                  onPress={() => {
                    copyToClipboard(`${command.command} ${flag}`);
                    setShowOptions(false);
                  }}
                  style={styles.optionItem}
                  haptic="light"
                >
                  <Ionicons name="flag-outline" size={14} color={phaseColor} />
                  <Text style={[styles.optionText, { color: phaseColor }]}>
                    {command.command} {flag}
                  </Text>
                </ScalePress>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.bg,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    gap: spacing.sm,
    // Glass morphism effect
    ...(Platform.OS === "web" && {
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }),
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  commandWrapper: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  command: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  flagBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  flag: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  params: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontStyle: "italic",
    textAlign: "right",
    writingDirection: "rtl",
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.bg.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonCopied: {
    backgroundColor: colors.status.successBg,
  },
  description: {
    fontSize: typography.size.md,
    color: colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  metaRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
  },
  outputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  output: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  requirementWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.status.successBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  requirement: {
    fontSize: typography.size.xs,
    color: colors.accent.success,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  timeWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  timeText: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
    writingDirection: "rtl",
  },
  autonomousBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.accent.warningGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  autonomousText: {
    fontSize: typography.size.xs,
    color: colors.accent.warning,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  shortcutWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },
  shortcut: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: "right",
    writingDirection: "rtl",
  },
  shortcutCopyIcon: {
    marginStart: spacing.xs,
  },
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingTop: spacing.sm,
  },
  actionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
  },
  primaryAction: {
    backgroundColor: colors.accent.primaryGlow,
    borderWidth: 1,
    borderColor: colors.accent.primaryMuted,
  },
  actionText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  primaryActionText: {
    color: colors.accent.primary,
    fontWeight: typography.weight.medium,
  },
  optionsMenu: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  optionItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  optionText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    flex: 1,
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionPreview: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  optionSectionTitle: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
