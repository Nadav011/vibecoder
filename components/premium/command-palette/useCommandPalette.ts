import { useState, useEffect, useCallback, useMemo } from "react";
import { useKeyboardShortcuts } from "../../../hooks";
import { haptics } from "../../../utils/haptics";
import { Command } from "./types";

interface UseCommandPaletteOptions {
  commands: Command[];
  visible: boolean;
  onClose: () => void;
}

interface UseCommandPaletteReturn {
  search: string;
  setSearch: (value: string) => void;
  selectedIndex: number;
  filteredCommands: Command[];
  groupedCommands: Record<string, Command[]>;
  executeCommand: (command: Command) => void;
}

export function useCommandPalette({
  commands,
  visible,
  onClose,
}: UseCommandPaletteOptions): UseCommandPaletteReturn {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const query = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.nameEn.toLowerCase().includes(query),
    );
  }, [commands, search]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    for (const cmd of filteredCommands) {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filteredCommands]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Reset search when opening
  useEffect(() => {
    if (visible) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [visible]);

  // Execute selected command
  const executeCommand = useCallback(
    (command: Command) => {
      haptics.light();
      onClose();
      // Small delay to allow modal to close
      setTimeout(() => {
        command.action();
      }, 100);
    },
    [onClose],
  );

  // Keyboard navigation (web only)
  useKeyboardShortcuts(
    [
      {
        key: "ArrowDown",
        action: () => {
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredCommands.length - 1),
          );
        },
        description: "Move down",
        descriptionHe: "למטה",
      },
      {
        key: "ArrowUp",
        action: () => {
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        },
        description: "Move up",
        descriptionHe: "למעלה",
      },
      {
        key: "Enter",
        action: () => {
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
        },
        description: "Execute",
        descriptionHe: "בצע",
      },
      {
        key: "Escape",
        action: onClose,
        description: "Close",
        descriptionHe: "סגור",
      },
    ],
    { enabled: visible },
  );

  return {
    search,
    setSearch,
    selectedIndex,
    filteredCommands,
    groupedCommands,
    executeCommand,
  };
}
