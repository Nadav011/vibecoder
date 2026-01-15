import React, { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { colors, spacing, radius, typography } from "../../theme";
import { useKanbanStore, useTodoStore, useNotesStore } from "../../stores";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";
import { performExport, ExportFormat, ExportOptions } from "../../utils/export";

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

const FORMAT_OPTIONS: {
  id: ExportFormat;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "json",
    label: "JSON",
    icon: "code-slash-outline",
    desc: "גיבוי מלא של הנתונים",
  },
  {
    id: "csv",
    label: "CSV",
    icon: "grid-outline",
    desc: "לייבוא לאקסל/גוגל שיטס",
  },
  {
    id: "markdown",
    label: "Markdown",
    icon: "document-text-outline",
    desc: "קריא ונוח לשיתוף",
  },
];

export function ExportModal({ visible, onClose }: ExportModalProps) {
  const { tasks } = useKanbanStore();
  const { todos } = useTodoStore();
  const { notes } = useNotesStore();

  const [format, setFormat] = useState<ExportFormat>("json");
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeTodos, setIncludeTodos] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeCompleted, setIncludeCompleted] = useState(true);

  const handleExport = () => {
    haptics.success();

    const options: ExportOptions = {
      format,
      includeTasks,
      includeTodos,
      includeNotes,
      includeCompleted,
    };

    performExport(tasks, todos, notes, options);
    onClose();
  };

  const isWebOnly = Platform.OS !== "web";

  return (
    <Modal visible={visible} onClose={onClose} title="ייצוא נתונים">
      <View style={styles.content}>
        {/* Format selection */}
        <FadeIn delay={50} direction="up">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פורמט</Text>
            <View style={styles.formatOptions}>
              {FORMAT_OPTIONS.map((option) => (
                <ScalePress
                  key={option.id}
                  onPress={() => {
                    haptics.selection();
                    setFormat(option.id);
                  }}
                  style={[
                    styles.formatOption,
                    format === option.id && styles.formatOptionActive,
                  ]}
                  haptic="none"
                >
                  <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={
                      format === option.id
                        ? colors.accent.primary
                        : colors.text.muted
                    }
                  />
                  <Text
                    style={[
                      styles.formatLabel,
                      format === option.id && styles.formatLabelActive,
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

        {/* Data selection */}
        <FadeIn delay={100} direction="up">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מה לייצא?</Text>
            <View style={styles.checkboxList}>
              <CheckboxOption
                label={`משימות (${tasks.length})`}
                checked={includeTasks}
                onToggle={() => setIncludeTasks(!includeTasks)}
              />
              <CheckboxOption
                label={`משימות מהירות (${todos.length})`}
                checked={includeTodos}
                onToggle={() => setIncludeTodos(!includeTodos)}
              />
              <CheckboxOption
                label={`הערות (${notes.length})`}
                checked={includeNotes}
                onToggle={() => setIncludeNotes(!includeNotes)}
              />
            </View>
          </View>
        </FadeIn>

        {/* Options */}
        <FadeIn delay={150} direction="up">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>אפשרויות</Text>
            <CheckboxOption
              label="כולל משימות שהושלמו"
              checked={includeCompleted}
              onToggle={() => setIncludeCompleted(!includeCompleted)}
            />
          </View>
        </FadeIn>

        {/* Web only warning */}
        {isWebOnly && (
          <FadeIn delay={200} direction="up">
            <View style={styles.warning}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.accent.warning}
              />
              <Text style={styles.warningText}>
                הורדת קבצים זמינה רק בגרסת הווב
              </Text>
            </View>
          </FadeIn>
        )}

        {/* Actions */}
        <FadeIn delay={250} direction="up">
          <View style={styles.actions}>
            <Button
              title="ביטול"
              variant="secondary"
              onPress={onClose}
              style={styles.button}
            />
            <Button
              title="ייצא"
              onPress={handleExport}
              disabled={
                (!includeTasks && !includeTodos && !includeNotes) || isWebOnly
              }
              style={styles.button}
            />
          </View>
        </FadeIn>
      </View>
    </Modal>
  );
}

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function CheckboxOption({ label, checked, onToggle }: CheckboxOptionProps) {
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

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  formatOptions: {
    gap: spacing.sm,
  },
  formatOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    gap: spacing.md,
  },
  formatOptionActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primaryGlow,
  },
  formatLabel: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    minWidth: 80,
    textAlign: "right",
    writingDirection: "rtl",
  },
  formatLabelActive: {
    color: colors.accent.primary,
  },
  formatDesc: {
    flex: 1,
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  checkboxList: {
    gap: spacing.sm,
  },
  checkboxOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  checkboxLabel: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  warning: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.accent.warningGlow,
    borderRadius: radius.md,
  },
  warningText: {
    color: colors.accent.warning,
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
