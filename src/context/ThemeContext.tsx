import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export type ThemeMode = keyof typeof Colors;

type ThemeValue = {
  mode: ThemeMode;                              // which theme is active
  colors: (typeof Colors)[ThemeMode];           // its palette
  toggle: () => void;                           // light <-> dark
  setMode: (mode: ThemeMode) => void;           // choose one
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(system === "dark" ? "dark" : "light");

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      colors: Colors[mode],
      toggle: () => setMode((current) => (current === "dark" ? "light" : "dark")),
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }

  return value;
}
