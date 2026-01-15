import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";
import { strings } from "../../utils/strings";
import {
  useKeyboardShortcuts,
  formatShortcut,
  KeyboardShortcut,
} from "../../hooks";

export interface Command {
  id: string;
  name: string;
  nameEn: string;
  icon: keyof typeof Ionicons.glyphMap;
  category: "navigation" | "tasks" | "actions" | "settings";
  shortcut?: KeyboardShortcut;
  action: () => void;
}

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  commands?: Command[];
}

const CATEGORY_LABELS: Record<Command["category"], string> = {
  navigation: "ניווט",
  tasks: "משימות",
  actions: "פעולות",
  settings: "הגדרות",
};

export function CommandPalette({
  visible,
  onClose,
  commands = [],
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const query = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.nameEn.toLowerCase().includes(query),
    );
  }, [commands, search]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    for (const cmd of filteredCommands) {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filteredCommands]);

  // Flat list of commands for keyboard navigation
  const flatCommands = useMemo(() => filteredCommands, [filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when opening
  useEffect(() => {
    if (visible) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [visible]);

  // Execute selected command
  const executeCommand = useCallback(
    (command: Command) => {
      haptics.light();
      onClose();
      // Small delay to allow modal to close
      setTimeout(() => {
        command.action();
      }, 100);
    },
    [onClose],
  );

  // Keyboard navigation (web only)
  useKeyboardShortcuts(
    [
      {
        key: "ArrowDown",
        action: () => {
          setSelectedIndex((prev) =>
            Math.min(prev + 1, flatCommands.length - 1),
          );
        },
        description: "Move down",
        descriptionHe: "למטה",
      },
      {
        key: "ArrowUp",
        action: () => {
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        },
        description: "Move up",
        descriptionHe: "למעלה",
      },
      {
        key: "Enter",
        action: () => {
          if (flatCommands[selectedIndex]) {
            executeCommand(flatCommands[selectedIndex]);
          }
        },
        description: "Execute",
        descriptionHe: "בצע",
      },
      {
        key: "Escape",
        action: onClose,
        description: "Close",
        descriptionHe: "סגור",
      },
    ],
    { enabled: visible },
  );

  const renderCommand = useCallback(
    ({ item, index }: { item: Command; index: number }) => {
      const isSelected = index === selectedIndex;

      return (
        <ScalePress
          onPress={() => executeCommand(item)}
          style={[styles.commandItem, isSelected && styles.commandItemSelected]}
          scale={0.98}
          haptic="light"
        >
          <View style={styles.commandIcon}>
            <Ionicons
              name={item.icon}
              size={18}
              color={isSelected ? colors.accent.primary : colors.text.secondary}
            />
          </View>
          <Text
            style={[
              styles.commandName,
              isSelected && styles.commandNameSelected,
            ]}
          >
            {item.name}
          </Text>
          {item.shortcut && (
            <View style={styles.shortcutBadge}>
              <Text style={styles.shortcutText}>
                {formatShortcut(item.shortcut)}
              </Text>
            </View>
          )}
        </ScalePress>
      );
    },
    [selectedIndex, executeCommand],
  );

  const renderCategory = useCallback(
    (category: Command["category"]) => {
      const categoryCommands = groupedCommands[category];
      if (!categoryCommands?.length) return null;

      return (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryLabel}>{CATEGORY_LABELS[category]}</Text>
          {categoryCommands.map((cmd, idx) => {
            const globalIndex = flatCommands.findIndex((c) => c.id === cmd.id);
            return renderCommand({ item: cmd, index: globalIndex });
          })}
        </View>
      );
    },
    [groupedCommands, flatCommands, renderCommand],
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ScalePress
        onPress={onClose}
        style={styles.overlay}
        haptic="none"
        scale={1}
      >
        <View />
      </ScalePress>

      <View style={styles.container}>
        <FadeIn delay={0} direction="down">
          <View style={styles.palette}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={colors.text.muted}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={strings.premium?.searchCommands || "חפש פקודות..."}
                placeholderTextColor={colors.text.muted}
                value={search}
                onChangeText={setSearch}
                autoFocus
                textAlign="right"
              />
              {Platform.OS === "web" && (
                <View style={styles.escHint}>
                  <Text style={styles.escText}>Esc</Text>
                </View>
              )}
            </View>

            {/* Commands List */}
            <View style={styles.commandsList}>
              {filteredCommands.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="search-outline"
                    size={32}
                    color={colors.text.muted}
                  />
                  <Text style={styles.emptyText}>לא נמצאו פקודות</Text>
                </View>
              ) : (
                <>
                  {(
                    ["navigation", "tasks", "actions", "settings"] as const
                  ).map(renderCategory)}
                </>
              )}
            </View>

            {/* Footer hint */}
            <View style={styles.footer}>
              <View style={styles.footerHint}>
                <Text style={styles.footerKey}>↑↓</Text>
                <Text style={styles.footerText}>לניווט</Text>
              </View>
              <View style={styles.footerHint}>
                <Text style={styles.footerKey}>Enter</Text>
                <Text style={styles.footerText}>לבחירה</Text>
              </View>
              <View style={styles.footerHint}>
                <Text style={styles.footerKey}>Esc</Text>
                <Text style={styles.footerText}>לסגירה</Text>
              </View>
            </View>
          </View>
        </FadeIn>
      </View>
    </Modal>
  );
}

// Default commands factory
export function createDefaultCommands(actions: {
  goToBoard: () => void;
  goToTodos: () => void;
  goToNotes: () => void;
  goToWorkflows: () => void;
  createTask: () => void;
  createTodo: () => void;
  startPomodoro: () => void;
  toggleTheme: () => void;
  openExport: () => void;
  openSettings: () => void;
  openTemplates: () => void;
}): Command[] {
  return [
    // Navigation
    {
      id: "go-board",
      name: "עבור ללוח",
      nameEn: "Go to Board",
      icon: "grid-outline",
      category: "navigation",
      action: actions.goToBoard,
    },
    {
      id: "go-todos",
      name: "עבור למשימות מהירות",
      nameEn: "Go to Quick Tasks",
      icon: "checkbox-outline",
      category: "navigation",
      action: actions.goToTodos,
    },
    {
      id: "go-notes",
      name: "עבור להערות",
      nameEn: "Go to Notes",
      icon: "document-text-outline",
      category: "navigation",
      action: actions.goToNotes,
    },
    {
      id: "go-workflows",
      name: "מרכז הפיקוד",
      nameEn: "Command Center",
      icon: "terminal-outline",
      category: "navigation",
      action: actions.goToWorkflows,
    },

    // Tasks
    {
      id: "create-task",
      name: "צור משימה חדשה",
      nameEn: "Create New Task",
      icon: "add-circle-outline",
      category: "tasks",
      action: actions.createTask,
    },
    {
      id: "create-todo",
      name: "הוסף משימה מהירה",
      nameEn: "Add Quick Task",
      icon: "flash-outline",
      category: "tasks",
      action: actions.createTodo,
    },
    {
      id: "templates",
      name: "השתמש בתבנית",
      nameEn: "Use Template",
      icon: "copy-outline",
      category: "tasks",
      action: actions.openTemplates,
    },

    // Actions
    {
      id: "pomodoro",
      name: "התחל פומודורו",
      nameEn: "Start Pomodoro",
      icon: "timer-outline",
      category: "actions",
      action: actions.startPomodoro,
    },
    {
      id: "export",
      name: "ייצא נתונים",
      nameEn: "Export Data",
      icon: "download-outline",
      category: "actions",
      action: actions.openExport,
    },

    // Settings
    {
      id: "theme",
      name: "החלף ערכת נושא",
      nameEn: "Toggle Theme",
      icon: "contrast-outline",
      category: "settings",
      action: actions.toggleTheme,
    },
    {
      id: "settings",
      name: "הגדרות",
      nameEn: "Settings",
      icon: "settings-outline",
      category: "settings",
      action: actions.openSettings,
    },
  ];
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.modal,
  },
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: spacing.lg,
  },
  palette: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  searchIcon: {
    marginEnd: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.lg,
    paddingVertical: spacing.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  escHint: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  escText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  commandsList: {
    maxHeight: 400,
    paddingVertical: spacing.sm,
  },
  categorySection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  commandItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginVertical: 1,
  },
  commandItemSelected: {
    backgroundColor: colors.bg.tertiary,
  },
  commandIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: spacing.md,
  },
  commandName: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.md,
  },
  commandNameSelected: {
    color: colors.accent.primary,
  },
  shortcutBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  shortcutText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: typography.size.md,
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
  },
  footerHint: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerKey: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
  },
});
