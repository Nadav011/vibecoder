import React from "react";
import { View, Text } from "react-native";
import { styles } from "./commandPaletteStyles";

interface FooterHintProps {
  keyLabel: string;
  text: string;
}

function FooterHint({ keyLabel, text }: FooterHintProps) {
  return (
    <View style={styles.footerHint}>
      <Text style={styles.footerKey}>{keyLabel}</Text>
      <Text style={styles.footerText}>{text}</Text>
    </View>
  );
}

export function CommandPaletteFooter() {
  return (
    <View style={styles.footer}>
      <FooterHint keyLabel="↑↓" text="לניווט" />
      <FooterHint keyLabel="Enter" text="לבחירה" />
      <FooterHint keyLabel="Esc" text="לסגירה" />
    </View>
  );
}
