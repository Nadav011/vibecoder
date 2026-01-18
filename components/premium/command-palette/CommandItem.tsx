import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { ScalePress } from "../../animated";
import { formatShortcut } from "../../../hooks";
import { styles } from "./commandPaletteStyles";
import { CommandItemProps } from "./types";

export function CommandItem({
  command,
  isSelected,
  onPress,
}: CommandItemProps) {
  return (
    <ScalePress
      onPress={onPress}
      style={[styles.commandItem, isSelected && styles.commandItemSelected]}
      scale={0.98}
      haptic="light"
    >
      <View style={styles.commandIcon}>
        <Ionicons
          name={command.icon}
          size={18}
          color={isSelected ? colors.accent.primary : colors.text.secondary}
        />
      </View>
      <Text
        style={[styles.commandName, isSelected && styles.commandNameSelected]}
      >
        {command.name}
      </Text>
      {command.shortcut && (
        <View style={styles.shortcutBadge}>
          <Text style={styles.shortcutText}>
            {formatShortcut(command.shortcut)}
          </Text>
        </View>
      )}
    </ScalePress>
  );
}
