import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  secondaryText: string;
}

interface ThemeContextProps {
  mode: ThemeMode; // 'light' | 'dark'
  colors: ThemeColors;
  toggleTheme: () => void;
}

const defaultColors: ThemeColors = {
  background: "#f9fcff",
  text: "#111",
  card: "#ffffff",
  border: "#ddd",
  primary: "#0871da",
  secondaryText: "#666",
};

const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  colors: defaultColors,
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemTheme || "light");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored === "light" || stored === "dark") setMode(stored);
    })();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    await AsyncStorage.setItem("theme", newMode);
  };

  const colors: ThemeColors =
    mode === "dark"
      ? {
        background: "#121212",
        text: "#ffffff",
        card: "#1e1e1e",
        border: "#222",
        primary: "#0cc6e9",
        secondaryText: "#aaa",
      }
      : {
        background: "#f9fcff",
        text: "#111",
        card: "#ffffff",
        border: "#ddd",
        primary: "#0871da",
        secondaryText: "#666",
      };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
