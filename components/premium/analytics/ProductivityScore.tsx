import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";

interface ProductivityScoreProps {
  productivityScore: number;
  currentStreak: number;
}

export function ProductivityScore({
  productivityScore,
  currentStreak,
}: ProductivityScoreProps) {
  const getScoreHint = (): string => {
    if (productivityScore >= 80) {
      return "מדהים! אתה על גלגל!";
    }
    if (productivityScore >= 50) {
      return "עבודה טובה, המשך כך!";
    }
    return "קדימה, אתה יכול!";
  };

  return (
    <FadeIn delay={50} direction="up">
      <View style={styles.scoreCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreTitle}>ציון פרודוקטיביות</Text>
          <View style={styles.streakBadge}>
            <Ionicons
              name="flame"
              size={14}
              color={
                currentStreak > 0 ? colors.accent.error : colors.text.muted
              }
            />
            <Text
              style={[
                styles.streakText,
                currentStreak > 0 && styles.streakTextActive,
              ]}
            >
              {currentStreak} ימים רצופים
            </Text>
          </View>
        </View>

        <View style={styles.scoreCircle}>
          <View style={styles.scoreCircleInner}>
            <Text style={styles.scoreValue}>{productivityScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <View
            style={[
              styles.scoreProgress,
              {
                transform: [
                  { rotate: `${(productivityScore / 100) * 360}deg` },
                ],
              },
            ]}
          />
        </View>

        <Text style={styles.scoreHint}>{getScoreHint()}</Text>
      </View>
    </FadeIn>
  );
}
