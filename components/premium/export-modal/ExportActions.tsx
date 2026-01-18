import React from "react";
import { View } from "react-native";
import { Button } from "../../ui/Button";
import { FadeIn } from "../../animated";
import { styles } from "./exportStyles";
import { ExportActionsProps } from "./types";

export function ExportActions({
  onClose,
  onExport,
  isExporting,
  isDisabled,
  exportSuccess,
}: ExportActionsProps) {
  return (
    <FadeIn delay={250} direction="up">
      <View style={styles.actions}>
        <Button
          title="ביטול"
          variant="secondary"
          onPress={onClose}
          style={styles.button}
          disabled={isExporting}
        />
        <Button
          title={isExporting ? "מייצא..." : "ייצא"}
          onPress={onExport}
          disabled={isDisabled || isExporting || exportSuccess}
          loading={isExporting}
          style={styles.button}
        />
      </View>
    </FadeIn>
  );
}
