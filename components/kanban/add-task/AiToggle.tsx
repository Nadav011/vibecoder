import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";
import { addTaskStyles as styles } from "./addTaskStyles";

interface AiToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  delay?: number;
}

export function AiToggle({ value, onChange, delay = 250 }: AiToggleProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <ScalePress
        onPress={() => onChange(!value)}
        style={styles.aiToggle}
        scale={0.99}
        haptic="none"
      >
        <View style={styles.aiToggleContent}>
          <Ionicons
            name="sparkles"
            size={18}
            color={value ? colors.accent.primary : colors.text.muted}
          />
          <View>
            <Text style={styles.aiToggleTitle}>{strings.aiGenerated}</Text>
            <Text style={styles.aiToggleSubtitle}>
              {strings.aiGeneratedDesc}
            </Text>
          </View>
        </View>
        <View style={[styles.toggle, value && styles.toggleActive]}>
          <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
        </View>
      </ScalePress>
    </FadeIn>
  );
}
