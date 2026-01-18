import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";
import { styles } from "./exportStyles";
import { FormatSelectorProps, FORMAT_OPTIONS } from "./types";

export function FormatSelector({
  selectedFormat,
  onSelectFormat,
}: FormatSelectorProps) {
  return (
    <FadeIn delay={50} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>פורמט</Text>
        <View style={styles.formatOptions}>
          {FORMAT_OPTIONS.map((option) => (
            <ScalePress
              key={option.id}
              onPress={() => {
                haptics.selection();
                onSelectFormat(option.id);
              }}
              style={[
                styles.formatOption,
                selectedFormat === option.id && styles.formatOptionActive,
              ]}
              haptic="none"
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={
                  selectedFormat === option.id
                    ? colors.accent.primary
                    : colors.text.muted
                }
              />
              <Text
                style={[
                  styles.formatLabel,
                  selectedFormat === option.id && styles.formatLabelActive,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.formatDesc}>{option.desc}</Text>
            </ScalePress>
          ))}
        </View>
      </View>
    </FadeIn>
  );
}
