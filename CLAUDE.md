# VibeCoder - Claude Code Instructions

## Project Context

This is a React Native (Expo) project management app for vibe coders.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
npx tsc --noEmit   # Type check
```

## File Structure Conventions

- Components: `components/<feature>/<Component>.tsx`
- Stores: `stores/<name>Store.ts`
- Types: `types/index.ts`
- Theme: `theme/*.ts`

## Code Style Rules

### RTL Support (CRITICAL)

```typescript
// NEVER use:
(marginLeft, marginRight, paddingLeft, paddingRight, left, right);

// ALWAYS use:
(marginStart, marginEnd, paddingStart, paddingEnd, start, end);
```

### Component Pattern

```typescript
import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../../theme";

interface Props {
  // Typed props
}

export function Component({ prop }: Props) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    // Use theme values
    padding: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
  },
});
```

### Store Pattern (Zustand)

```typescript
import { create } from "zustand";
import { storage } from "../utils/storage";

interface Store {
  data: Data[];
  addData: (item: Data) => void;
}

export const useStore = create<Store>((set) => ({
  data: [],
  addData: (item) => {
    set((state) => {
      const newData = [...state.data, item];
      storage.setData(newData);
      return { data: newData };
    });
  },
}));
```

## Key Files

| File                    | Purpose                 |
| ----------------------- | ----------------------- |
| `app/_layout.tsx`       | Root layout, store init |
| `app/index.tsx`         | Main screen             |
| `types/index.ts`        | All TypeScript types    |
| `stores/kanbanStore.ts` | Main task store         |
| `theme/colors.ts`       | Color palette           |

## Past Mistakes Log

- [2026-01-12] Used marginLeft → Fixed to marginStart
- [2026-01-12] Missing haptic on interactions → Added haptics utility
- [2026-01-12] Type error with conditional styles → Use Boolean() wrapper

## Testing

Run TypeScript check before committing:

```bash
npx tsc --noEmit
```

## Design Principles

1. **Dark Mode First** - Deep blacks, subtle borders
2. **8pt Grid** - Consistent spacing
3. **Minimal UI** - No gradients or glows
4. **Haptic Feedback** - On all interactions
5. **Keyboard Ready** - Support for physical keyboards
