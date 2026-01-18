import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../../ui/Button";
import { FadeIn } from "../../animated";
import { spacing } from "../../../theme";
import { strings } from "../../../utils/strings";

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  delay?: number;
}

export function ActionButtons({
  onCancel,
  onSubmit,
  isSubmitDisabled,
  delay = 400,
}: ActionButtonsProps) {
  return (
    <FadeIn delay={delay} direction="up">
      <View style={styles.actions}>
        <Button
          title={strings.cancel}
          variant="secondary"
          onPress={onCancel}
          style={styles.button}
        />
        <Button
          title={strings.saveChanges}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={styles.button}
        />
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row-reverse",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
