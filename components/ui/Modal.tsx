import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
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
  const { width, height } = useWindowDimensions();
  const isMobile = width < 500;

  const handleClose = () => {
    haptics.light();
    onClose();
  };

  // Responsive modal width
  const modalWidth = isMobile
    ? width - spacing.lg * 2
    : Math.min(400, width - spacing.xl * 2);
  const modalMaxHeight = height * 0.85;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        onPress={handleClose}
        style={styles.overlay}
        accessibilityRole="button"
        accessibilityLabel="סגור מודאל"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.innerPressable}
          accessibilityRole="none"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <FadeIn delay={0} direction="up">
              <View
                style={[
                  styles.content,
                  { width: modalWidth, maxHeight: modalMaxHeight },
                ]}
                accessibilityRole="alert"
                accessibilityLabel={title || "מודאל"}
                accessibilityViewIsModal={true}
                accessibilityLiveRegion="polite"
              >
                <View style={styles.header}>
                  {title && <Text style={styles.title}>{title}</Text>}
                  <ScalePress
                    onPress={handleClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    scale={0.9}
                    accessibilityRole="button"
                    accessibilityLabel="סגור"
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={colors.text.secondary}
                    />
                  </ScalePress>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {children}
                </ScrollView>
              </View>
            </FadeIn>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.modal,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  innerPressable: {
    width: "100%",
    alignItems: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 24,
          elevation: 16,
        }),
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "right",
    writingDirection: "rtl",
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
});
