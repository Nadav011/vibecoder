import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "../ui/Modal";
import { colors, spacing, radius, typography } from "../../theme";
import { useTemplateStore, TaskTemplate } from "../../stores/templateStore";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";
import { Task } from "../../types";
import { generateId } from "../../utils/generateId";

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (taskData: Partial<Task>) => void;
}

export function TemplateModal({
  visible,
  onClose,
  onSelectTemplate,
}: TemplateModalProps) {
  const { templates } = useTemplateStore();

  const handleSelectTemplate = (template: TaskTemplate) => {
    haptics.light();

    // Convert template to task data
    const taskData: Partial<Task> = {
      title: template.task.title,
      description: template.task.description,
      priority: template.task.priority,
      labels: template.task.labels,
      subtasks: template.task.subtasks.map((text) => ({
        id: generateId(),
        text,
        completed: false,
      })),
      estimatedMinutes: template.task.estimatedMinutes,
    };

    onSelectTemplate(taskData);
    onClose();
  };

  const defaultTemplates = templates.filter((t) => t.isDefault);
  const customTemplates = templates.filter((t) => !t.isDefault);

  return (
    <Modal visible={visible} onClose={onClose} title="בחר תבנית">
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Default templates */}
          <FadeIn delay={50} direction="up">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>תבניות מובנות</Text>
              <View style={styles.templateGrid}>
                {defaultTemplates.map((template, index) => (
                  <FadeIn
                    key={template.id}
                    delay={100 + index * 50}
                    direction="up"
                  >
                    <TemplateCard
                      template={template}
                      onPress={() => handleSelectTemplate(template)}
                    />
                  </FadeIn>
                ))}
              </View>
            </View>
          </FadeIn>

          {/* Custom templates */}
          {customTemplates.length > 0 && (
            <FadeIn delay={200} direction="up">
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>התבניות שלי</Text>
                <View style={styles.templateGrid}>
                  {customTemplates.map((template, index) => (
                    <FadeIn
                      key={template.id}
                      delay={250 + index * 50}
                      direction="up"
                    >
                      <TemplateCard
                        template={template}
                        onPress={() => handleSelectTemplate(template)}
                        showDelete
                      />
                    </FadeIn>
                  ))}
                </View>
              </View>
            </FadeIn>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}

interface TemplateCardProps {
  template: TaskTemplate;
  onPress: () => void;
  showDelete?: boolean;
}

function TemplateCard({ template, onPress, showDelete }: TemplateCardProps) {
  const { deleteTemplate } = useTemplateStore();

  const handleDelete = () => {
    haptics.warning();
    deleteTemplate(template.id);
  };

  return (
    <ScalePress onPress={onPress} style={styles.templateCard} haptic="light">
      <View style={styles.templateHeader}>
        <View style={styles.templateIcon}>
          <Ionicons
            name={template.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={colors.accent.primary}
          />
        </View>
        {showDelete && (
          <ScalePress
            onPress={handleDelete}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            scale={0.9}
            haptic="none"
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color={colors.text.muted}
            />
          </ScalePress>
        )}
      </View>

      <Text style={styles.templateName}>{template.name}</Text>

      {template.task.subtasks.length > 0 && (
        <View style={styles.templateMeta}>
          <Ionicons
            name="checkbox-outline"
            size={12}
            color={colors.text.muted}
          />
          <Text style={styles.templateMetaText}>
            {template.task.subtasks.length} תתי-משימות
          </Text>
        </View>
      )}

      {template.task.estimatedMinutes && (
        <View style={styles.templateMeta}>
          <Ionicons name="time-outline" size={12} color={colors.text.muted} />
          <Text style={styles.templateMetaText}>
            {template.task.estimatedMinutes} דקות
          </Text>
        </View>
      )}
    </ScalePress>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 500,
  },
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
  templateGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  templateCard: {
    width: 140,
    padding: spacing.md,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  templateHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accent.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    padding: spacing.xs,
  },
  templateName: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  templateMeta: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
  },
  templateMetaText: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
