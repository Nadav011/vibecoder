import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { colors, spacing, typography, fonts } from "../../theme";
import { FadeIn } from "../animated";
import { strings } from "../../utils/strings";

interface NoteEditorProps {
  content: string;
  onChangeContent: (content: string) => void;
}

export function NoteEditor({ content, onChangeContent }: NoteEditorProps) {
  return (
    <FadeIn delay={100} direction="up" style={styles.container}>
      <View style={styles.editorWrapper}>
        <TextInput
          style={styles.editor}
          value={content}
          onChangeText={onChangeContent}
          placeholder={strings.startWriting}
          placeholderTextColor={colors.text.muted}
          multiline
          textAlignVertical="top"
          autoCorrect={false}
          spellCheck={false}
          textAlign="right"
        />
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: colors.bg.tertiary,
  },
  editor: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    padding: spacing.lg,
    fontFamily: fonts.mono,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
