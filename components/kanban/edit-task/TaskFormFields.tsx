import React from "react";
import { StyleSheet } from "react-native";
import { Input } from "../../ui/Input";
import { FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";

interface TaskFormFieldsProps {
  title: string;
  description: string;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
}

export function TaskFormFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: TaskFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <FadeIn delay={50} direction="up">
        <Input
          label={strings.taskTitle}
          placeholder={strings.taskTitlePlaceholder}
          value={title}
          onChangeText={onTitleChange}
          textAlign="right"
        />
      </FadeIn>

      {/* Description */}
      <FadeIn delay={100} direction="up">
        <Input
          label={strings.taskDescription}
          placeholder={strings.taskDescriptionPlaceholder}
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={3}
          style={styles.textarea}
          textAlign="right"
        />
      </FadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
