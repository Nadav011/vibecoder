import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated";

interface Props {
  children: ReactNode;
  sectionName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for individual sections/panels
 * Allows other parts of the app to continue working if one section fails
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[SectionErrorBoundary] Error in ${this.props.sectionName}:`,
      error,
      errorInfo,
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="warning-outline"
            size={32}
            color={colors.accent.warning}
          />
          <Text style={styles.title}>שגיאה ב{this.props.sectionName}</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "משהו השתבש"}
          </Text>
          <ScalePress
            onPress={this.handleRetry}
            style={styles.retryButton}
            haptic="medium"
          >
            <Ionicons name="refresh" size={16} color={colors.text.primary} />
            <Text style={styles.retryText}>נסה שוב</Text>
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
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    writingDirection: "rtl",
  },
  message: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    textAlign: "center",
    maxWidth: 250,
    writingDirection: "rtl",
  },
  retryButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  retryText: {
    color: colors.text.primary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
