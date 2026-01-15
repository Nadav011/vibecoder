import React, { useEffect, useState, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  StyleSheet,
  I18nManager,
  Platform,
  View,
  Text,
  Animated,
} from "react-native";
import {
  initKanbanStore,
  initTodoStore,
  initNotesStore,
  initSettingsStore,
  initPomodoroStore,
  initAnalyticsStore,
  initTemplateStore,
  useSettingsStore,
  usePomodoroStore,
  useKanbanStore,
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
} from "../components/premium";
import {
  useKeyboardShortcuts,
  createShortcuts,
} from "../hooks/useKeyboardShortcuts";
import { ScalePress } from "../components/animated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

// Register service worker for PWA (web only)
function registerServiceWorker(onUpdate: (version: string) => void) {
  if (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    "serviceWorker" in navigator
  ) {
    // Listen for update messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        console.log("PWA Update available:", event.data.version);
        onUpdate(event.data.version);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);

          // Check for updates periodically (every 30 minutes)
          setInterval(
            () => {
              registration.update();
            },
            30 * 60 * 1000,
          );
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    });

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }
  return undefined;
}

function AppContent() {
  const router = useRouter();
  const { colors: themeColors, isDark, toggleTheme } = useTheme();
  const { phase, isRunning } = usePomodoroStore();
  const { addTask } = useKanbanStore();

  // Modal states
  const [commandPaletteVisible, setCommandPaletteVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [pomodoroVisible, setPomodoroVisible] = useState(false);

  // Navigation (will be connected to router)
  const goToBoard = useCallback(() => {
    // Navigation handled by tabs in index.tsx
  }, []);

  const goToTodos = useCallback(() => {
    // Navigation handled by tabs in index.tsx
  }, []);

  const goToNotes = useCallback(() => {
    // Navigation handled by tabs in index.tsx
  }, []);

  const goToWorkflows = useCallback(() => {
    setCommandPaletteVisible(false);
    router.push("/workflows");
  }, [router]);

  // Handle template selection - creates a new task from template
  const handleSelectTemplate = useCallback(
    (taskData: Partial<Task>) => {
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
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
    goToBoard,
    goToTodos,
    goToNotes,
    goToWorkflows,
    createTask: () => {}, // Will be connected via context
    createTodo: () => {},
    startPomodoro: () => {
      setPomodoroVisible(true);
      usePomodoroStore.getState().start();
    },
    toggleTheme,
    openExport: () => setExportModalVisible(true),
    openSettings: () => setAnalyticsVisible(true), // Analytics doubles as stats
    openTemplates: () => setTemplatesVisible(true),
  });

  // Setup keyboard shortcuts (web only)
  const shortcuts = createShortcuts({
    openCommandPalette: () => setCommandPaletteVisible(true),
    startPomodoro: () => {
      setPomodoroVisible(true);
      usePomodoroStore.getState().start();
    },
    toggleTheme,
    exportData: () => setExportModalVisible(true),
    closeModal: () => {
      setCommandPaletteVisible(false);
      setExportModalVisible(false);
      setAnalyticsVisible(false);
      setTemplatesVisible(false);
      setPomodoroVisible(false);
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
            onPress={() => setPomodoroVisible(true)}
            style={styles.pomodoroMini}
            haptic="light"
          >
            <PomodoroTimer compact />
          </ScalePress>
        )}

        {/* Command Palette trigger */}
        {Platform.OS === "web" && (
          <ScalePress
            onPress={() => setCommandPaletteVisible(true)}
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
          onPress={() => setPomodoroVisible(true)}
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
          onPress={() => setAnalyticsVisible(true)}
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

      {/* Command Palette Modal */}
      <CommandPalette
        visible={commandPaletteVisible}
        onClose={() => setCommandPaletteVisible(false)}
        commands={commands}
      />

      {/* Export Modal */}
      <ExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
      />

      {/* Analytics Modal */}
      <Analytics
        visible={analyticsVisible}
        onClose={() => setAnalyticsVisible(false)}
      />

      {/* Templates Modal */}
      <TemplateModal
        visible={templatesVisible}
        onClose={() => setTemplatesVisible(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Pomodoro Full View */}
      {pomodoroVisible && (
        <View style={styles.pomodoroOverlay}>
          <ScalePress
            onPress={() => setPomodoroVisible(false)}
            style={styles.pomodoroBackdrop}
            haptic="none"
            scale={1}
          >
            <View />
          </ScalePress>
          <View style={styles.pomodoroContainer}>
            <PomodoroTimer onClose={() => setPomodoroVisible(false)} />
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

// Update Banner Component
function UpdateBanner({
  visible,
  version,
  onUpdate,
  onDismiss,
}: {
  visible: boolean;
  version: string;
  onUpdate: () => void;
  onDismiss: () => void;
}) {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.updateBanner, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.updateContent}>
        <Ionicons
          name="refresh-circle"
          size={24}
          color={colors.accent.primary}
        />
        <View style={styles.updateTextContainer}>
          <Text style={styles.updateTitle}>עדכון חדש זמין!</Text>
          <Text style={styles.updateVersion}>גרסה {version}</Text>
        </View>
      </View>
      <View style={styles.updateButtons}>
        <ScalePress
          onPress={onDismiss}
          style={styles.updateDismissButton}
          haptic="light"
        >
          <Text style={styles.updateDismissText}>אחר כך</Text>
        </ScalePress>
        <ScalePress
          onPress={onUpdate}
          style={styles.updateButton}
          haptic="medium"
        >
          <Text style={styles.updateButtonText}>עדכן עכשיו</Text>
        </ScalePress>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("");

  const handleUpdate = useCallback(() => {
    // Send message to SW to skip waiting and activate new version
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    // Reload the page to get the new version
    window.location.reload();
  }, []);

  const handleDismiss = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    // Initialize all stores from storage
    Promise.all([
      initKanbanStore(),
      initTodoStore(),
      initNotesStore(),
      initSettingsStore(),
      initPomodoroStore(),
      initAnalyticsStore(),
      initTemplateStore(),
    ]);

    // Register service worker for PWA with update callback
    const cleanup = registerServiceWorker((version) => {
      setUpdateVersion(version);
      setUpdateAvailable(true);
    });

    return cleanup;
  }, []);

  return (
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
  // Update Banner Styles
  updateBanner: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    backgroundColor: colors.bg.elevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  updateContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  updateTextContainer: {
    alignItems: "flex-end",
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  updateVersion: {
    fontSize: 12,
    color: colors.text.muted,
  },
  updateButtons: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  updateButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  updateButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  updateDismissButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  updateDismissText: {
    fontSize: 13,
    color: colors.text.muted,
  },
});
