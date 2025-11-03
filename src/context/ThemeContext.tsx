import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";

type ThemeType = typeof Colors.light;

const ThemeContext = createContext<ThemeType>(Colors.light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
