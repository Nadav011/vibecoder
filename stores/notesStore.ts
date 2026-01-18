import { create } from "zustand";
import { Note, NotesStore } from "../types";
import { storage } from "../utils/storage";
import { generateId } from "../utils/generateId";

export const useNotesStore = create<NotesStore>((set, _get) => ({
  notes: [],
  activeNoteId: null,

  addNote: (title) => {
    const newNote: Note = {
      id: generateId(),
      title,
      content: "",
      pinned: false,
      updatedAt: Date.now(),
    };

    set((state) => {
      const newNotes = [newNote, ...state.notes];
      storage.setNotes(newNotes);
      return { notes: newNotes, activeNoteId: newNote.id };
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const newNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      );
      storage.setNotes(newNotes);
      return { notes: newNotes };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = state.notes.filter((note) => note.id !== id);
      const newActiveId =
        state.activeNoteId === id
          ? newNotes.length > 0
            ? newNotes[0].id
            : null
          : state.activeNoteId;
      storage.setNotes(newNotes);
      return { notes: newNotes, activeNoteId: newActiveId };
    });
  },

  setActiveNote: (id) => {
    set({ activeNoteId: id });
  },

  togglePinned: (id) => {
    set((state) => {
      const newNotes = state.notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note,
      );
      // Sort: pinned first
      newNotes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
      storage.setNotes(newNotes);
      return { notes: newNotes };
    });
  },
}));

// Initialize store from storage
export const initNotesStore = async () => {
  const saved = await storage.getNotes<Note[]>();
  if (saved) {
    useNotesStore.setState({
      notes: saved,
      activeNoteId: saved.length > 0 ? saved[0].id : null,
    });
  }
};
