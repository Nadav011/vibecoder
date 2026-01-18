import React from "react";
import { View, TextInput, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { strings } from "../../../utils/strings";
import { styles } from "./commandPaletteStyles";
import { CommandSearchProps } from "./types";

export function CommandSearch({
  value,
  onChangeText,
  placeholder,
}: CommandSearchProps) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color={colors.text.muted}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={
          placeholder || strings.premium?.searchCommands || "חפש פקודות..."
        }
        placeholderTextColor={colors.text.muted}
        value={value}
        onChangeText={onChangeText}
        autoFocus
        textAlign="right"
      />
      {Platform.OS === "web" && (
        <View style={styles.escHint}>
          <Text style={styles.escText}>Esc</Text>
        </View>
      )}
    </View>
  );
}
