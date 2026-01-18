import React, { useState, useCallback } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { haptics } from "../../utils/haptics";
import { colors } from "../../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  scale?: number;
  haptic?: "light" | "medium" | "selection" | "none";
  style?: StyleProp<ViewStyle>;
}

// Focus style for web accessibility
const focusStyle: ViewStyle =
  Platform.OS === "web"
    ? {
        outlineWidth: 2,
        outlineColor: colors.border.focus,
        outlineStyle: "solid",
        outlineOffset: 2,
      }
    : {};

export function ScalePress({
  children,
  scale = 0.97,
  haptic = "light",
  style,
  onPressIn,
  onPressOut,
  ...props
}: ScalePressProps) {
  const scaleValue = useSharedValue(1);
  const [isFocused, setIsFocused] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scaleValue.value = withSpring(scale, {
      damping: 15,
      stiffness: 400,
    });
    if (haptic !== "none") {
      haptics[haptic]();
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    onPressOut?.(e);
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[style, animatedStyle, isFocused && focusStyle]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
