import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress } from "../animated";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  haptic?: "light" | "medium" | "selection" | "none";
}

export function Button({
  onPress,
  title,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  haptic = "light",
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primary;
      case "secondary":
        return styles.secondary;
      case "ghost":
        return styles.ghost;
      case "danger":
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.size_sm;
      case "md":
        return styles.size_md;
      case "lg":
        return styles.size_lg;
      default:
        return styles.size_md;
    }
  };

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.base,
    getVariantStyle(),
    getSizeStyle(),
    disabled && styles.disabled,
    style,
  ];

  const getTextVariantStyle = () => {
    switch (variant) {
      case "primary":
        return styles.text_primary;
      case "secondary":
        return styles.text_secondary;
      case "ghost":
        return styles.text_ghost;
      case "danger":
        return styles.text_danger;
      default:
        return styles.text_primary;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.text_sm;
      case "md":
        return styles.text_md;
      case "lg":
        return styles.text_lg;
      default:
        return styles.text_md;
    }
  };

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    getTextVariantStyle(),
    getTextSizeStyle(),
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <ScalePress
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      scale={0.97}
      haptic={disabled || loading ? "none" : haptic}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? colors.text.inverse : colors.text.primary
          }
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </ScalePress>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.accent.primary,
  },
  secondary: {
    backgroundColor: colors.bg.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.accent.error,
  },
  size_sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  size_md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 40,
  },
  size_lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  text_primary: {
    color: colors.text.inverse,
  },
  text_secondary: {
    color: colors.text.primary,
  },
  text_ghost: {
    color: colors.accent.primary,
  },
  text_danger: {
    color: colors.text.inverse,
  },
  text_sm: {
    fontSize: typography.size.sm,
    textAlign: "right",
    writingDirection: "rtl",
  },
  text_md: {
    fontSize: typography.size.md,
    textAlign: "right",
    writingDirection: "rtl",
  },
  text_lg: {
    fontSize: typography.size.lg,
    textAlign: "right",
    writingDirection: "rtl",
  },
  textDisabled: {
    color: colors.text.muted,
  },
});
