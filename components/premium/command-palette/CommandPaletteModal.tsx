import React from "react";
import { View, Modal } from "react-native";
import { ScalePress, FadeIn } from "../../animated";
import { styles } from "./commandPaletteStyles";
import { CommandSearch } from "./CommandSearch";
import { CommandList } from "./CommandList";
import { CommandPaletteFooter } from "./CommandPaletteFooter";
import { useCommandPalette } from "./useCommandPalette";
import { CommandPaletteProps } from "./types";

export function CommandPaletteModal({
  visible,
  onClose,
  commands = [],
}: CommandPaletteProps) {
  const {
    search,
    setSearch,
    selectedIndex,
    filteredCommands,
    groupedCommands,
    executeCommand,
  } = useCommandPalette({ commands, visible, onClose });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ScalePress
        onPress={onClose}
        style={styles.overlay}
        haptic="none"
        scale={1}
      >
        <View />
      </ScalePress>

      <View style={styles.container}>
        <FadeIn delay={0} direction="down">
          <View style={styles.palette}>
            <CommandSearch value={search} onChangeText={setSearch} />
            <CommandList
              commands={filteredCommands}
              groupedCommands={groupedCommands}
              selectedIndex={selectedIndex}
              onExecuteCommand={executeCommand}
            />
            <CommandPaletteFooter />
          </View>
        </FadeIn>
      </View>
    </Modal>
  );
}
