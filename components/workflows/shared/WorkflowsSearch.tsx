import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress } from "../../animated";

interface WorkflowsSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function WorkflowsSearch({ value, onChangeText }: WorkflowsSearchProps) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.text.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="חפש פקודה..."
          placeholderTextColor={colors.text.muted}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <ScalePress
            onPress={() => onChangeText("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            haptic="light"
          >
            <Ionicons name="close-circle" size={20} color={colors.text.muted} />
          </ScalePress>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
