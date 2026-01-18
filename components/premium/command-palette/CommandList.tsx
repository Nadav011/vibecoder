import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { styles } from "./commandPaletteStyles";
import { CommandItem } from "./CommandItem";
import {
  CommandListProps,
  Command,
  CommandCategory,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "./types";

interface CategorySectionProps {
  category: CommandCategory;
  commands: Command[];
  allCommands: Command[];
  selectedIndex: number;
  onExecuteCommand: (command: Command) => void;
}

function CategorySection({
  category,
  commands,
  allCommands,
  selectedIndex,
  onExecuteCommand,
}: CategorySectionProps) {
  if (!commands?.length) return null;

  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryLabel}>{CATEGORY_LABELS[category]}</Text>
      {commands.map((cmd) => {
        const globalIndex = allCommands.findIndex((c) => c.id === cmd.id);
        return (
          <CommandItem
            key={cmd.id}
            command={cmd}
            isSelected={globalIndex === selectedIndex}
            onPress={() => onExecuteCommand(cmd)}
          />
        );
      })}
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={32} color={colors.text.muted} />
      <Text style={styles.emptyText}>לא נמצאו פקודות</Text>
    </View>
  );
}

export function CommandList({
  commands,
  groupedCommands,
  selectedIndex,
  onExecuteCommand,
}: CommandListProps) {
  if (commands.length === 0) {
    return (
      <View style={styles.commandsList}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.commandsList}>
      {CATEGORY_ORDER.map((category) => (
        <CategorySection
          key={category}
          category={category}
          commands={groupedCommands[category] || []}
          allCommands={commands}
          selectedIndex={selectedIndex}
          onExecuteCommand={onExecuteCommand}
        />
      ))}
    </View>
  );
}
