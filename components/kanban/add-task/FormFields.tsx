import React from "react";
import { View, Text } from "react-native";
import { Input } from "../../ui/Input";
import { FadeIn } from "../../animated";
import { strings } from "../../../utils/strings";
import { addTaskStyles as styles } from "./addTaskStyles";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "./useAddTask";

interface FormFieldsProps {
  title: string;
  description: string;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
}

export function FormFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: FormFieldsProps) {
  return (
    <>
      {/* Title */}
      <FadeIn delay={50} direction="up">
        <View style={styles.inputWithCounter}>
          <Input
            label={strings.taskTitle}
            placeholder={strings.taskTitlePlaceholder}
            value={title}
            onChangeText={onTitleChange}
            autoFocus
            textAlign="right"
            maxLength={MAX_TITLE_LENGTH}
          />
          <Text style={styles.charCounter}>
            {title.length}/{MAX_TITLE_LENGTH}
          </Text>
        </View>
      </FadeIn>

      {/* Description */}
      <FadeIn delay={100} direction="up">
        <View style={styles.inputWithCounter}>
          <Input
            label={strings.taskDescription}
            placeholder={strings.taskDescriptionPlaceholder}
            value={description}
            onChangeText={onDescriptionChange}
            multiline
            numberOfLines={3}
            style={styles.textarea}
            textAlign="right"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          <Text style={styles.charCounter}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </View>
      </FadeIn>
    </>
  );
}
