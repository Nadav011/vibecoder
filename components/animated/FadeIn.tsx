import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";
import { SPRING_CONFIG } from "../../theme";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  style?: ViewStyle;
  springConfig?: keyof typeof SPRING_CONFIG;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  style,
  springConfig = "default",
}: FadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(
    direction === "up" ? distance : direction === "down" ? -distance : 0,
  );
  const translateX = useSharedValue(
    direction === "left" ? distance : direction === "right" ? -distance : 0,
  );

  const config = SPRING_CONFIG[springConfig];

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, config));
    translateY.value = withDelay(delay, withSpring(0, config));
    translateX.value = withDelay(delay, withSpring(0, config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, config]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
