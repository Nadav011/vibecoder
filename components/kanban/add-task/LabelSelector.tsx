import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "../../../types";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";
import { addTaskStyles as styles } from "./addTaskStyles";

interface LabelSelectorProps {
  labels: Label[];
  selectedLabels: string[];
  onToggleLabel: (labelId: string) => void;
  delay?: number;
}

export function LabelSelector({
  labels,
  selectedLabels,
  onToggleLabel,
  delay = 200,
}: LabelSelectorProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>{strings.labels}</Text>
        <View style={styles.labelsGrid}>
          {labels.map((label) => {
            const isActive = selectedLabels.includes(label.id);

            return (
              <ScalePress
                key={label.id}
                onPress={() => onToggleLabel(label.id)}
                style={[
                  styles.labelButton,
                  isActive && { backgroundColor: label.color + "30" },
                ]}
                haptic="none"
              >
                <View
                  style={[styles.labelDot, { backgroundColor: label.color }]}
                />
                <Text
                  style={[styles.labelText, isActive && { color: label.color }]}
                >
                  {label.name}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={14} color={label.color} />
                )}
              </ScalePress>
            );
          })}
        </View>
      </View>
    </FadeIn>
  );
}
