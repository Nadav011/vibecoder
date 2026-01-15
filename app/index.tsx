import React, { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../theme";
import { Board } from "../components/kanban";
import { TodoList } from "../components/todo";
import { NotesArea } from "../components/notes";
import { FadeIn, ScalePress } from "../components/animated";
import { haptics } from "../utils/haptics";
import { strings } from "../utils/strings";

type Panel = "kanban" | "todos" | "notes";

export default function HomeScreen() {
  const [activePanel, setActivePanel] = useState<Panel>("kanban");
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1400;

  // Calculate sidebar width based on screen size
  const sidebarWidth = isLargeDesktop ? 400 : isDesktop ? 350 : 300;

  // On tablet/desktop, show all panels. On phone, show one at a time
  if (isTablet) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeIn delay={0} direction="down">
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>{strings.appName}</Text>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>{strings.pro}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>{strings.appSubtitle}</Text>
          </View>
        </FadeIn>

        <View style={styles.tabletContent}>
          <FadeIn delay={100} direction="right" style={styles.mainPanel}>
            <Board />
          </FadeIn>
          <FadeIn delay={200} direction="left">
            <View
              style={[
                styles.sidebar,
                { width: sidebarWidth, minWidth: sidebarWidth },
              ]}
            >
              <View style={styles.sidebarSection}>
                <TodoList />
              </View>
              <View style={styles.sidebarSection}>
                <NotesArea />
              </View>
            </View>
          </FadeIn>
        </View>
      </SafeAreaView>
    );
  }

  // Mobile layout - tab navigation
  const handleTabPress = (panel: Panel) => {
    haptics.selection();
    setActivePanel(panel);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FadeIn delay={0} direction="down">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>{strings.appName}</Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>{strings.pro}</Text>
            </View>
          </View>
        </View>
      </FadeIn>

      <View style={styles.mobileContent}>
        {activePanel === "kanban" && (
          <FadeIn delay={50} direction="up">
            <Board />
          </FadeIn>
        )}
        {activePanel === "todos" && (
          <FadeIn delay={50} direction="up" style={styles.mobilePanelContainer}>
            <TodoList />
          </FadeIn>
        )}
        {activePanel === "notes" && (
          <FadeIn delay={50} direction="up" style={styles.mobilePanelContainer}>
            <NotesArea />
          </FadeIn>
        )}
      </View>

      <FadeIn delay={100} direction="up">
        <View style={styles.tabBar}>
          <ScalePress
            onPress={() => handleTabPress("kanban")}
            style={[styles.tab, activePanel === "kanban" && styles.tabActive]}
            haptic="none"
          >
            <View
              style={[
                styles.tabIconContainer,
                activePanel === "kanban" && styles.tabIconContainerActive,
              ]}
            >
              <Ionicons
                name={activePanel === "kanban" ? "grid" : "grid-outline"}
                size={22}
                color={
                  activePanel === "kanban"
                    ? colors.accent.primary
                    : colors.text.muted
                }
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activePanel === "kanban" && styles.tabLabelActive,
              ]}
            >
              {strings.board}
            </Text>
          </ScalePress>

          <ScalePress
            onPress={() => handleTabPress("todos")}
            style={[styles.tab, activePanel === "todos" && styles.tabActive]}
            haptic="none"
          >
            <View
              style={[
                styles.tabIconContainer,
                activePanel === "todos" && styles.tabIconContainerActive,
              ]}
            >
              <Ionicons
                name={activePanel === "todos" ? "checkbox" : "checkbox-outline"}
                size={22}
                color={
                  activePanel === "todos"
                    ? colors.accent.primary
                    : colors.text.muted
                }
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activePanel === "todos" && styles.tabLabelActive,
              ]}
            >
              {strings.tasks}
            </Text>
          </ScalePress>

          <ScalePress
            onPress={() => handleTabPress("notes")}
            style={[styles.tab, activePanel === "notes" && styles.tabActive]}
            haptic="none"
          >
            <View
              style={[
                styles.tabIconContainer,
                activePanel === "notes" && styles.tabIconContainerActive,
              ]}
            >
              <Ionicons
                name={
                  activePanel === "notes"
                    ? "document-text"
                    : "document-text-outline"
                }
                size={22}
                color={
                  activePanel === "notes"
                    ? colors.accent.primary
                    : colors.text.muted
                }
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                activePanel === "notes" && styles.tabLabelActive,
              ]}
            >
              {strings.notes}
            </Text>
          </ScalePress>
        </View>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  logoContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  logo: {
    color: colors.text.primary,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.tight,
    writingDirection: "rtl",
  },
  logoBadge: {
    backgroundColor: colors.accent.primaryGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  logoBadgeText: {
    color: colors.accent.primary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wide,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    marginTop: spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },

  // Tablet layout
  tabletContent: {
    flex: 1,
    flexDirection: "row-reverse",
  },
  mainPanel: {
    flex: 1,
  },
  sidebar: {
    borderStartWidth: 1,
    borderStartColor: colors.border.subtle,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sidebarSection: {
    flex: 1,
  },

  // Mobile layout
  mobileContent: {
    flex: 1,
  },
  mobilePanelContainer: {
    flex: 1,
    padding: spacing.lg,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row-reverse",
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.bg.secondary,
    paddingBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  tabActive: {},
  tabIconContainer: {
    width: 40,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  tabIconContainerActive: {
    backgroundColor: colors.accent.primaryGlow,
  },
  tabLabel: {
    color: colors.text.muted,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  tabLabelActive: {
    color: colors.accent.primary,
  },
});
