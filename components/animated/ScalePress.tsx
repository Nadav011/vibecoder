import React from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { haptics } from "../../utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  scale?: number;
  haptic?: "light" | "medium" | "selection" | "none";
  style?: StyleProp<ViewStyle>;
}

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = (e: any) => {
    scaleValue.value = withSpring(scale, {
      damping: 15,
      stiffness: 400,
    });
    if (haptic !== "none") {
      haptics[haptic]();
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
