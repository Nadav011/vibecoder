import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, spacing, typography } from "../../theme";

export function LoadingSplash() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VibeCoder</Text>
      <View style={styles.spinner}>
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [
                {
                  scale: new Animated.Value(1).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <Text style={styles.text}>טוען...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  logo: {
    fontSize: typography.size.xxxl,
    fontWeight: "700",
    color: colors.accent.primary,
  },
  spinner: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.primary,
  },
  text: {
    fontSize: typography.size.md,
    color: colors.text.muted,
  },
});
