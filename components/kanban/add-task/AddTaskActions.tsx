import React from "react";
import { View } from "react-native";
import { Button } from "../../ui/Button";
import { FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";
import { addTaskStyles as styles } from "./addTaskStyles";

interface AddTaskActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  delay?: number;
}

export function AddTaskActions({
  onCancel,
  onSubmit,
  isSubmitDisabled,
  delay = 300,
}: AddTaskActionsProps) {
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
          title={strings.createTask}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={styles.button}
        />
      </View>
    </FadeIn>
  );
}
