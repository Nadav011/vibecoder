import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TaskPriority, PRIORITY_CONFIG } from "../../../types";
import { colors } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";
import { addTaskStyles as styles } from "./addTaskStyles";

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  delay?: number;
}

export function PrioritySelector({
  value,
  onChange,
  delay = 150,
}: PrioritySelectorProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.section}>
        <Text style={styles.label}>{strings.priority}</Text>
        <View style={styles.priorityRow}>
          {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => {
            const config = PRIORITY_CONFIG[p];
            const isActive = value === p;

            return (
              <ScalePress
                key={p}
                onPress={() => onChange(p)}
                style={[
                  styles.priorityButton,
                  isActive && { backgroundColor: config.color + "30" },
                ]}
                haptic="none"
              >
                <Ionicons
                  name={config.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={isActive ? config.color : colors.text.muted}
                />
                <Text
                  style={[
                    styles.priorityText,
                    isActive && { color: config.color },
                  ]}
                >
                  {strings.priorities[p as keyof typeof strings.priorities]}
                </Text>
              </ScalePress>
            );
          })}
        </View>
      </View>
    </FadeIn>
  );
}
