# VibeCoder - AI Context Document

## Project Overview

**VibeCoder** is a premium project management app designed specifically for developers who use AI assistants (Vibe Coders). Built with React Native and Expo, it features a Kanban board, quick task list, and notes area.

## Tech Stack

| Layer       | Technology                      | Version      |
| ----------- | ------------------------------- | ------------ |
| Framework   | Expo SDK                        | 54           |
| Runtime     | React Native                    | 0.81.5       |
| Language    | TypeScript                      | 5.9 (Strict) |
| Navigation  | Expo Router                     | 6.x          |
| State       | Zustand                         | 5.x          |
| Storage     | AsyncStorage                    | 2.2          |
| Drag & Drop | react-native-draggable-flatlist | 4.x          |
| Animations  | react-native-reanimated         | 4.1          |
| Gestures    | react-native-gesture-handler    | 2.28         |
| Haptics     | expo-haptics                    | 15.x         |
| Icons       | @expo/vector-icons              | 15.x         |

## Architecture

```
vibecoder/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Root layout + providers
│   └── index.tsx             # Main screen
├── components/
│   ├── kanban/               # Kanban board components
│   │   ├── Board.tsx         # Main board container
│   │   ├── Column.tsx        # Column (Todo/Progress/Done)
│   │   ├── Card.tsx          # Draggable task card
│   │   ├── SearchBar.tsx     # Search and filter bar
│   │   ├── AddTaskModal.tsx  # Create task modal
│   │   └── EditTaskModal.tsx # Edit task modal
│   ├── todo/                 # Quick tasks
│   │   ├── TodoList.tsx      # Todo list component
│   │   └── TodoItem.tsx      # Single todo item
│   ├── notes/                # Notes area
│   │   ├── NotesArea.tsx     # Notes panel
│   │   └── NoteEditor.tsx    # Note editor
│   └── ui/                   # Shared UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── stores/                   # Zustand stores
│   ├── kanbanStore.ts        # Tasks, labels, filters
│   ├── todoStore.ts          # Quick todos
│   └── notesStore.ts         # Notes
├── theme/                    # Design system
│   ├── colors.ts             # Dark mode palette
│   ├── spacing.ts            # 8pt grid
│   └── typography.ts         # Font scales
├── types/                    # TypeScript definitions
│   └── index.ts              # All types
└── utils/                    # Utilities
    ├── storage.ts            # AsyncStorage helpers
    └── haptics.ts            # Haptic feedback
```

## Key Features

### Kanban Board

- 3 columns: Todo, In Progress, Complete
- Drag & drop reordering
- Priority levels (P0-P3) with color coding
- Labels system (Bug, Feature, Refactor, AI Generated, Tech Debt, Docs)
- Subtasks support
- Due date tracking with overdue highlighting
- AI Generated task marking

### Search & Filter

- Full text search across tasks
- Filter by priority
- Filter by AI generated tasks
- Quick filter chips

### Quick Tasks

- Simple todo list for fast capture
- Check/uncheck completion
- Clear completed option

### Notes

- Multiple notes with tabs
- Pin important notes
- Rich text editing

## Design System

### Colors (Dark Mode)

```typescript
bg.primary:    #0D0D0F  // Main background
bg.secondary:  #161618  // Cards
bg.tertiary:   #1E1E21  // Elevated
accent.primary: #6366F1 // Indigo
status.todo:    #71717A // Gray
status.inProgress: #F59E0B // Amber
status.complete: #22C55E // Green
```

### Spacing (8pt Grid)

xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32

### RTL Support

All margin/padding use `marginStart`/`marginEnd` (ms-/me-) logical properties

## State Management

### Zustand Stores

- **kanbanStore**: Tasks array, labels array, filter state
- **todoStore**: Todos array
- **notesStore**: Notes array, activeNoteId

### Persistence

All stores auto-persist to AsyncStorage with keys:

- `@vibecoder/kanban`
- `@vibecoder/todos`
- `@vibecoder/notes`

## Running the App

```bash
# Development
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Code Conventions

1. **TypeScript Strict Mode** - No `any` types
2. **Functional Components** - With hooks
3. **RTL Support** - Use logical properties (ms-, me-, start-, end-)
4. **Haptic Feedback** - On all interactions
5. **8pt Grid** - Consistent spacing

## Future Enhancements

- [ ] Cloud sync (Firebase/Supabase)
- [ ] Multiple boards/projects
- [ ] Team collaboration
- [ ] Calendar integration
- [ ] Time tracking
- [ ] GitHub integration
