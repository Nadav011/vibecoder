import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { colors, radius, spacing } from "../../theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = radius.md,
  style,
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width={120} height={16} />
        <Skeleton width={24} height={24} borderRadius={radius.sm} />
      </View>
      <Skeleton width="80%" height={14} style={{ marginTop: spacing.sm }} />
      <View style={styles.cardFooter}>
        <Skeleton width={60} height={20} borderRadius={radius.full} />
        <Skeleton width={60} height={20} borderRadius={radius.full} />
      </View>
    </View>
  );
}

export function SkeletonColumn() {
  return (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <Skeleton width={100} height={18} />
        <Skeleton width={32} height={24} borderRadius={radius.full} />
      </View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

export function SkeletonTodo() {
  return (
    <View style={styles.todo}>
      <Skeleton width={20} height={20} borderRadius={radius.sm} />
      <Skeleton width="70%" height={14} />
      <Skeleton width={14} height={14} borderRadius={radius.sm} />
    </View>
  );
}

export function SkeletonBoard() {
  return (
    <View style={styles.board}>
      <SkeletonColumn />
      <SkeletonColumn />
      <SkeletonColumn />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.bg.tertiary,
  },
  card: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row-reverse",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  column: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    minWidth: 280,
    maxWidth: 320,
    marginHorizontal: spacing.sm,
  },
  columnHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  todo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  board: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
});
