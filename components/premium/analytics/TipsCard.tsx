import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./analyticsStyles";

export function TipsCard() {
  return (
    <FadeIn delay={350} direction="up">
      <View style={styles.tipsCard}>
        <Ionicons name="bulb-outline" size={20} color={colors.accent.warning} />
        <Text style={styles.tipsText}>
          טיפ: השתמש בפומודורו לשמירה על מיקוד וקבלת ציון פרודוקטיביות גבוה
          יותר!
        </Text>
      </View>
    </FadeIn>
  );
}
