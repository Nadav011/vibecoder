import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated/ScalePress";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="alert-circle"
            size={64}
            color={colors.priority.critical}
          />
          <Text style={styles.title}>אופס! משהו השתבש</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "שגיאה לא צפויה"}
          </Text>
          <ScalePress
            onPress={() => this.setState({ hasError: false, error: null })}
            style={styles.button}
            haptic="medium"
          >
            <Text style={styles.buttonText}>נסה שוב</Text>
          </ScalePress>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
  },
  message: {
    fontSize: typography.size.md,
    color: colors.text.muted,
    textAlign: "center",
    maxWidth: 300,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  buttonText: {
    fontSize: typography.size.md,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
