import React from "react";
import { View, Text } from "react-native";
import { FadeIn } from "../../animated";
import { styles } from "./exportStyles";
import { CheckboxOption } from "./CheckboxOption";
import { DataSelectorProps } from "./types";

export function DataSelector({
  includeTasks,
  includeTodos,
  includeNotes,
  tasksCount,
  todosCount,
  notesCount,
  onToggleTasks,
  onToggleTodos,
  onToggleNotes,
}: DataSelectorProps) {
  return (
    <FadeIn delay={100} direction="up">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>מה לייצא?</Text>
        <View style={styles.checkboxList}>
          <CheckboxOption
            label={`משימות (${tasksCount})`}
            checked={includeTasks}
            onToggle={onToggleTasks}
          />
          <CheckboxOption
            label={`משימות מהירות (${todosCount})`}
            checked={includeTodos}
            onToggle={onToggleTodos}
          />
          <CheckboxOption
            label={`הערות (${notesCount})`}
            checked={includeNotes}
            onToggle={onToggleNotes}
          />
        </View>
      </View>
    </FadeIn>
  );
}
