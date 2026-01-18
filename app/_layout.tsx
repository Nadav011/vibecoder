import React, { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, I18nManager, Platform, View } from "react-native";
import {
  initKanbanStore,
  initTodoStore,
  initNotesStore,
  initSettingsStore,
  initPomodoroStore,
  initAnalyticsStore,
  initTemplateStore,
  usePomodoroStore,
  useKanbanStore,
  useTodoStore,
} from "../stores";
import { Task } from "../types";
import { colors, spacing, radius } from "../theme";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import {
  CommandPalette,
  createDefaultCommands,
  PomodoroTimer,
  ExportModal,
  Analytics,
  TemplateModal,
  KeyboardShortcutsModal,
} from "../components/premium";
import {
  useKeyboardShortcuts,
  createShortcuts,
} from "../hooks/useKeyboardShortcuts";
import { ScalePress } from "../components/animated/ScalePress";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { generateId } from "../utils/generateId";
import { registerServiceWorker } from "../utils/registerServiceWorker";
import {
  ErrorBoundary,
  LoadingSplash,
  UpdateBanner,
} from "../components/layout";

// Modal types for consolidated state
type ActiveModal =
  | "none"
  | "command"
  | "export"
  | "analytics"
  | "templates"
  | "pomodoro"
  | "shortcuts";

// Force RTL for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Force RTL on web
// IMPORTANT: Do NOT set dir="rtl" on document - it conflicts with flexDirection: "row-reverse"!
// React Native uses row-reverse for RTL layouts, CSS dir="rtl" would reverse it back to LTR
if (Platform.OS === "web" && typeof document !== "undefined") {
  document.documentElement.lang = "he";
  document.body.style.textAlign = "right";
}

function AppContent() {
  const router = useRouter();
  const { colors: themeColors, isDark, toggleTheme } = useTheme();
  const { phase, isRunning } = usePomodoroStore();
  const { addTask } = useKanbanStore();

  // Consolidated modal state (only one modal can be open at a time)
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");

  // Modal helpers
  const openModal = useCallback(
    (modal: ActiveModal) => setActiveModal(modal),
    [],
  );
  const closeModal = useCallback(() => setActiveModal("none"), []);

  const goToWorkflows = useCallback(() => {
    closeModal();
    router.push("/workflows");
  }, [router, closeModal]);

  // Handle template selection - creates a new task from template
  const handleSelectTemplate = useCallback(
    (taskData: Partial<Task>) => {
      const newTask: Task = {
        id: generateId(),
        title: taskData.title || "",
        description: taskData.description || "",
        status: "todo",
        priority: taskData.priority || "p2",
        labels: taskData.labels || [],
        subtasks: taskData.subtasks || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addTask(newTask);
    },
    [addTask],
  );

  // Create commands for Command Palette
  const commands = createDefaultCommands({
    goToBoard: () => {}, // Navigation handled by tabs
    goToTodos: () => {},
    goToNotes: () => {},
    goToWorkflows,
    createTask: () => {},
    createTodo: () => {},
    startPomodoro: () => {
      openModal("pomodoro");
      usePomodoroStore.getState().start();
    },
    toggleTheme,
    openExport: () => openModal("export"),
    openSettings: () => openModal("analytics"),
    openTemplates: () => openModal("templates"),
  });

  // Setup keyboard shortcuts (web only)
  const shortcuts = createShortcuts({
    openCommandPalette: () => openModal("command"),
    startPomodoro: () => {
      openModal("pomodoro");
      usePomodoroStore.getState().start();
    },
    toggleTheme,
    exportData: () => openModal("export"),
    closeModal,
    showShortcuts: () => openModal("shortcuts"),
    undo: () => {
      // Try kanban first, then todos
      const kanbanUndone = useKanbanStore.getState().undo();
      if (!kanbanUndone) {
        useTodoStore.getState().undo();
      }
    },
    redo: () => {
      // Try kanban first, then todos
      const kanbanRedone = useKanbanStore.getState().redo();
      if (!kanbanRedone) {
        useTodoStore.getState().redo();
      }
    },
  });
  useKeyboardShortcuts(shortcuts);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.bg.primary },
        }}
      />

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        {/* Pomodoro mini timer (when running) */}
        {(phase !== "idle" || isRunning) && (
          <ScalePress
            onPress={() => openModal("pomodoro")}
            style={styles.pomodoroMini}
            haptic="light"
          >
            <PomodoroTimer compact />
          </ScalePress>
        )}

        {/* Command Palette trigger */}
        {Platform.OS === "web" && (
          <ScalePress
            onPress={() => openModal("command")}
            style={styles.fabButton}
            haptic="light"
          >
            <Ionicons
              name="search"
              size={22}
              color={themeColors.text.primary}
            />
          </ScalePress>
        )}

        {/* Quick actions menu */}
        <ScalePress
          onPress={() => openModal("pomodoro")}
          style={styles.fabButton}
          haptic="light"
        >
          <Ionicons
            name="timer-outline"
            size={22}
            color={themeColors.text.primary}
          />
        </ScalePress>

        <ScalePress
          onPress={() => openModal("analytics")}
          style={styles.fabButton}
          haptic="light"
        >
          <Ionicons
            name="stats-chart-outline"
            size={22}
            color={themeColors.text.primary}
          />
        </ScalePress>
      </View>

      {/* Command Palette Modal - wrapped in error boundary */}
      {activeModal === "command" && (
        <CommandPalette
          visible={true}
          onClose={closeModal}
          commands={commands}
        />
      )}

      {/* Export Modal */}
      {activeModal === "export" && (
        <ExportModal visible={true} onClose={closeModal} />
      )}

      {/* Analytics Modal */}
      {activeModal === "analytics" && (
        <Analytics visible={true} onClose={closeModal} />
      )}

      {/* Templates Modal */}
      {activeModal === "templates" && (
        <TemplateModal
          visible={true}
          onClose={closeModal}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {activeModal === "shortcuts" && (
        <KeyboardShortcutsModal
          visible={true}
          onClose={closeModal}
          shortcuts={shortcuts}
        />
      )}

      {/* Pomodoro Full View */}
      {activeModal === "pomodoro" && (
        <View style={styles.pomodoroOverlay}>
          <ScalePress
            onPress={closeModal}
            style={styles.pomodoroBackdrop}
            haptic="none"
            scale={1}
          >
            <View />
          </ScalePress>
          <View style={styles.pomodoroContainer}>
            <PomodoroTimer onClose={closeModal} />
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("");

  const handleUpdate = useCallback(() => {
    // Send message to SW to skip waiting and activate new version
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      navigator.serviceWorker?.controller
    ) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    // Reload the page to get the new version
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    // Initialize all stores from storage with individual error handling
    const initStores = async () => {
      const storeInits = [
        { name: "kanban", init: initKanbanStore },
        { name: "todo", init: initTodoStore },
        { name: "notes", init: initNotesStore },
        { name: "settings", init: initSettingsStore },
        { name: "pomodoro", init: initPomodoroStore },
        { name: "analytics", init: initAnalyticsStore },
        { name: "template", init: initTemplateStore },
      ];

      const results = await Promise.allSettled(
        storeInits.map(async ({ name, init }) => {
          try {
            await init();
            return { name, success: true };
          } catch (error) {
            if (__DEV__) {
              console.warn(`[Store] ${name} initialization failed:`, error);
            }
            return { name, success: false, error };
          }
        }),
      );

      // Log failed stores in development only
      if (__DEV__) {
        const failed = results.filter(
          (r) => r.status === "fulfilled" && !r.value.success,
        );
        if (failed.length > 0) {
          console.warn("[RootLayout] Some stores failed to initialize");
        }
      }

      setIsLoading(false);
    };

    initStores();

    // Register service worker for PWA with update callback
    const cleanup = registerServiceWorker((version) => {
      setUpdateVersion(version);
      setUpdateAvailable(true);
    });

    return cleanup;
  }, []);

  if (isLoading) {
    return <LoadingSplash />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
        {Platform.OS === "web" && (
          <UpdateBanner
            visible={updateAvailable}
            version={updateVersion}
            onUpdate={handleUpdate}
            onDismiss={handleDismiss}
          />
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  floatingButtons: {
    position: "absolute",
    bottom: 100,
    end: spacing.lg,
    gap: spacing.md,
    alignItems: "center",
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.bg.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }),
  },
  pomodoroMini: {
    marginBottom: spacing.sm,
  },
  pomodoroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.modal,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  pomodoroBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pomodoroContainer: {
    width: "90%",
    maxWidth: 400,
  },
});
