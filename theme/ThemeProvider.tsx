import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { colors as darkColors } from "./colors";
import { lightColors } from "./lightColors";
import { useSettingsStore, ThemeMode } from "../stores/settingsStore";

type Colors = typeof darkColors;

interface ThemeContextType {
  colors: Colors;
  isDark: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { settings, toggleTheme } = useSettingsStore();
  const [colors, setColors] = useState<Colors>(darkColors);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let shouldBeDark: boolean;

    if (settings.theme === "system") {
      shouldBeDark = systemColorScheme !== "light";
    } else {
      shouldBeDark = settings.theme === "dark";
    }

    setIsDark(shouldBeDark);
    // lightColors has same structure as darkColors but different literal values
    // Cast through unknown is safe because structure matches
    setColors(shouldBeDark ? darkColors : (lightColors as unknown as Colors));
  }, [settings.theme, systemColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        themeMode: settings.theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Hook for getting current colors (shorthand)
export function useColors(): Colors {
  const { colors } = useTheme();
  return colors;
}
