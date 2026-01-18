import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { ScalePress } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { styles } from "./exportStyles";
import { CheckboxOptionProps } from "./types";

export function CheckboxOption({
  label,
  checked,
  onToggle,
}: CheckboxOptionProps) {
  return (
    <ScalePress
      onPress={() => {
        haptics.selection();
        onToggle();
      }}
      style={styles.checkboxOption}
      scale={0.98}
      haptic="none"
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={14} color={colors.text.inverse} />
        )}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </ScalePress>
  );
}
