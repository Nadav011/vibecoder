import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TextInput, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../../theme";
import { ScalePress, FadeIn } from "../../animated";
import { haptics } from "../../../utils/haptics";

interface WorkflowsSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  resultsCount?: number;
  searchHistory?: string[];
  onSelectHistory?: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function WorkflowsSearch({
  value,
  onChangeText,
  resultsCount,
  searchHistory = [],
  onSelectHistory,
  placeholder = "חפש פקודה...",
  debounceMs = 300,
}: WorkflowsSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  const handleChange = useCallback(
    (text: string) => {
      setLocalValue(text);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onChangeText(text);
      }, debounceMs);
    },
    [onChangeText, debounceMs],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleClear = () => {
    setLocalValue("");
    onChangeText("");
    haptics.light();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchHistory.length > 0 && !value) {
      setShowHistory(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding to allow tap on history items
    setTimeout(() => setShowHistory(false), 150);
  };

  const handleSelectHistory = (query: string) => {
    setLocalValue(query);
    onChangeText(query);
    onSelectHistory?.(query);
    setShowHistory(false);
    haptics.selection();
  };

  const recentHistory = searchHistory.slice(0, 5);

  return (
    <View style={styles.searchWrapper}>
      <View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isFocused ? colors.accent.primary : colors.text.muted}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          value={localValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityRole="search"
          accessibilityLabel="חיפוש פקודות"
        />

        {/* Results count */}
        {value.length > 0 && typeof resultsCount === "number" && (
          <View style={styles.resultsCountBadge}>
            <Text style={styles.resultsCountText}>{resultsCount}</Text>
          </View>
        )}

        {/* Clear button */}
        {localValue.length > 0 && (
          <ScalePress
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel="נקה חיפוש"
          >
            <Ionicons name="close-circle" size={20} color={colors.text.muted} />
          </ScalePress>
        )}
      </View>

      {/* Results info */}
      {value.length > 0 && typeof resultsCount === "number" && (
        <FadeIn direction="down" distance={10} delay={0}>
          <View style={styles.resultsInfo}>
            <Ionicons
              name={resultsCount > 0 ? "checkmark-circle" : "alert-circle"}
              size={14}
              color={
                resultsCount > 0 ? colors.accent.success : colors.accent.warning
              }
            />
            <Text style={styles.resultsInfoText}>
              {resultsCount > 0
                ? `נמצאו ${resultsCount} פקודות`
                : "לא נמצאו תוצאות"}
            </Text>
          </View>
        </FadeIn>
      )}

      {/* Search history dropdown */}
      {showHistory && recentHistory.length > 0 && !value && (
        <FadeIn direction="down" distance={10} delay={0}>
          <View style={styles.historyDropdown}>
            <View style={styles.historyHeader}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.text.muted}
              />
              <Text style={styles.historyTitle}>חיפושים אחרונים</Text>
            </View>
            <ScrollView style={styles.historyList} nestedScrollEnabled>
              {recentHistory.map((query, index) => (
                <ScalePress
                  key={`${query}-${index}`}
                  onPress={() => handleSelectHistory(query)}
                  style={styles.historyItem}
                  haptic="selection"
                >
                  <Text style={styles.historyItemText} numberOfLines={1}>
                    {query}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.text.muted}
                  />
                </ScalePress>
              ))}
            </ScrollView>
          </View>
        </FadeIn>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchContainerFocused: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.bg.tertiary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  resultsCountBadge: {
    backgroundColor: colors.accent.primaryGlow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    minWidth: 28,
    alignItems: "center",
  },
  resultsCountText: {
    fontSize: typography.size.xs,
    color: colors.accent.primary,
    fontWeight: typography.weight.semibold,
  },
  resultsInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingStart: spacing.xs,
  },
  resultsInfoText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  historyDropdown: {
    position: "absolute",
    top: "100%",
    start: spacing.md,
    end: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginTop: spacing.xs,
    maxHeight: 200,
    shadowColor: colors.shadow.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  historyHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  historyTitle: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontWeight: typography.weight.medium,
  },
  historyList: {
    maxHeight: 150,
  },
  historyItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  historyItemText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
