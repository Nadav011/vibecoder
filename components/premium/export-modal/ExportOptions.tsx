import React from "react";
import { View, Text } from "react-native";
import { FadeIn } from "../../animated";
import { styles } from "./exportStyles";
import { CheckboxOption } from "./CheckboxOption";
import { ExportOptionsProps } from "./types";

export function ExportOptions({
  includeCompleted,
  onToggleCompleted,
}: ExportOptionsProps) {
  return (
    <FadeIn delay={150} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>אפשרויות</Text>
        <CheckboxOption
          label="כולל משימות שהושלמו"
          checked={includeCompleted}
          onToggle={onToggleCompleted}
        />
      </View>
    </FadeIn>
  );
}
