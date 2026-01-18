import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { useNotesStore } from "../../stores";
import { NoteEditor } from "./NoteEditor";
import { FadeIn, ScalePress, EmptyNotes } from "../animated";
import { haptics } from "../../utils/haptics";
import { strings } from "../../utils/strings";
import { formatRelativeTime } from "../../utils/dateFormat";

export function NotesArea() {
  const {
    notes,
    activeNoteId,
    addNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotesStore();

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <View style={styles.container}>
      <FadeIn delay={0} direction="down">
        <View style={styles.header}>
          <Text style={styles.title}>{strings.notesTitle}</Text>
          <ScalePress
            onPress={() => {
              haptics.light();
              addNote();
            }}
            style={styles.addButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="הוסף הערה חדשה"
          >
            <Ionicons name="add" size={20} color={colors.text.secondary} />
          </ScalePress>
        </View>
      </FadeIn>

      {notes.length > 0 ? (
        <View style={styles.content}>
          {/* Note tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabs}
            contentContainerStyle={styles.tabsContent}
          >
            {notes.map((note, index) => (
              <FadeIn key={note.id} delay={index * 50} direction="right">
                <ScalePress
                  onPress={() => {
                    haptics.selection();
                    setActiveNote(note.id);
                  }}
                  onLongPress={() => {
                    haptics.warning();
                    deleteNote(note.id);
                  }}
                  style={[
                    styles.tab,
                    activeNoteId === note.id && styles.tabActive,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeNoteId === note.id }}
                  accessibilityLabel={`הערה: ${note.content.split("\n")[0] || strings.untitled}`}
                  accessibilityHint="לחיצה ארוכה למחיקה"
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeNoteId === note.id && styles.tabTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {note.content.split("\n")[0] || strings.untitled}
                  </Text>
                  <Text style={styles.tabDate}>
                    {formatRelativeTime(note.updatedAt)}
                  </Text>
                </ScalePress>
              </FadeIn>
            ))}
          </ScrollView>

          {/* Editor */}
          {activeNote && (
            <View style={styles.editorContainer}>
              <NoteEditor
                content={activeNote.content}
                onChangeContent={(content) =>
                  updateNote(activeNote.id, { content })
                }
              />
            </View>
          )}
        </View>
      ) : (
        <EmptyNotes onAdd={addNote} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  addButton: {
    padding: spacing.xs,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.sm,
  },
  content: {
    flex: 1,
  },
  tabs: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  tabsContent: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    maxWidth: 120,
  },
  tabActive: {
    backgroundColor: colors.accent.primary,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: "right",
    writingDirection: "rtl",
  },
  tabTextActive: {
    color: colors.text.inverse,
  },
  tabDate: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  editorContainer: {
    flex: 1,
  },
});
