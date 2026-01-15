import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import { ScalePress, FadeIn } from "../animated";
import { haptics } from "../../utils/haptics";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const handleClose = () => {
    haptics.light();
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <FadeIn delay={0} direction="up">
                <View style={styles.content}>
                  <View style={styles.header}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <ScalePress
                      onPress={handleClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      scale={0.9}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={colors.text.secondary}
                      />
                    </ScalePress>
                  </View>
                  {children}
                </View>
              </FadeIn>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.modal,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
});
