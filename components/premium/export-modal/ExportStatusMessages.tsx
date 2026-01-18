import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme";
import { FadeIn } from "../../animated";
import { styles } from "./exportStyles";
import { ExportStatusMessagesProps } from "./types";

export function ExportStatusMessages({
  isWebOnly,
  exportSuccess,
  exportError,
}: ExportStatusMessagesProps) {
  return (
    <>
      {/* Web only warning */}
      {isWebOnly && (
        <FadeIn delay={200} direction="up">
          <View style={styles.warning}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.accent.warning}
            />
            <Text style={styles.warningText}>
              הורדת קבצים זמינה רק בגרסת הווב
            </Text>
          </View>
        </FadeIn>
      )}

      {/* Success message */}
      {exportSuccess && (
        <FadeIn delay={0} direction="up">
          <View style={styles.successMessage}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.accent.success}
            />
            <Text style={styles.successText}>הייצוא הושלם בהצלחה!</Text>
          </View>
        </FadeIn>
      )}

      {/* Error message */}
      {exportError && (
        <FadeIn delay={0} direction="up">
          <View style={styles.errorMessage}>
            <Ionicons
              name="alert-circle"
              size={24}
              color={colors.priority.critical}
            />
            <Text style={styles.errorText}>{exportError}</Text>
          </View>
        </FadeIn>
      )}
    </>
  );
}
