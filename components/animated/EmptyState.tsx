import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../theme";
import { FadeIn } from "./FadeIn";
import { Button } from "../ui/Button";
import { strings } from "../../utils/strings";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <FadeIn delay={0} direction="up">
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Ionicons name={icon} size={48} color={colors.accent.primary} />
        </View>
      </FadeIn>

      <FadeIn delay={100} direction="up">
        <Text style={styles.title}>{title}</Text>
      </FadeIn>

      {description && (
        <FadeIn delay={200} direction="up">
          <Text style={styles.description}>{description}</Text>
        </FadeIn>
      )}

      {actionLabel && onAction && (
        <FadeIn delay={300} direction="up">
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
            size="md"
            style={styles.button}
          />
        </FadeIn>
      )}
    </View>
  );
}

// Pre-configured empty states
export function EmptyTasks({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon="layers-outline"
      title={strings.empty.tasks.title}
      description={strings.empty.tasks.description}
      actionLabel={onAdd ? strings.empty.tasks.action : undefined}
      onAction={onAdd}
    />
  );
}

export function EmptyTodos({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon="checkbox-outline"
      title={strings.empty.todos.title}
      description={strings.empty.todos.description}
      actionLabel={onAdd ? strings.empty.todos.action : undefined}
      onAction={onAdd}
    />
  );
}

export function EmptyNotes({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon="document-text-outline"
      title={strings.empty.notes.title}
      description={strings.empty.notes.description}
      actionLabel={onAdd ? strings.empty.notes.action : undefined}
      onAction={onAdd}
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon="search-outline"
      title={strings.empty.search.title}
      description={strings.empty.search.description}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  iconContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  iconGlow: {
    position: "absolute",
    top: -20,
    start: -20,
    end: -20,
    bottom: -20,
    backgroundColor: colors.accent.primaryGlow,
    borderRadius: 100,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    writingDirection: "rtl",
  },
  description: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: typography.size.md * typography.lineHeight.normal,
    writingDirection: "rtl",
  },
  button: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});
