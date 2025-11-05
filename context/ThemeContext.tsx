import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

interface ThemeColors {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  secondaryText: string;
}

interface ThemeContextProps {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  colors: {
    background: "#f9fcff",
    text: "#111",
    card: "#ffffff",
    border: "#ddd",
    primary: "#0871da",
    secondaryText: "#666",
  },
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemTheme || "light");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored) setTheme(stored as ThemeType);
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const colors: ThemeColors =
    theme === "dark"
      ? {
          background: "#121212",
          text: "#fff",
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
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
