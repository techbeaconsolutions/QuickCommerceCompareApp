/**
 * QuickCommerce Compare Theme
 * ----------------------------
 * Centralized light/dark mode colors and font configuration
 * Used throughout the app for consistent branding.
 */

import { Platform } from "react-native";

const gradientPrimary = ["#0871da", "#0cc6e9"];
const accentColor = "#a855f7";

export const Colors = {
  light: {
    text: "#111827", // near black
    background: "#ffffff",
    surface: "#f5f7fa",
    tint: gradientPrimary[0],
    accent: accentColor,
    tabIconDefault: "#9ca3af",
    tabIconSelected: gradientPrimary[0],
    border: "#e5e7eb",
  },
  dark: {
    text: "#f9fafb",
    background: "#111827",
    surface: "#1f2937",
    tint: gradientPrimary[1],
    accent: accentColor,
    tabIconDefault: "#9ba1a6",
    tabIconSelected: gradientPrimary[1],
    border: "#374151",
  },
};

// Optional gradient colors for buttons and headers
export const Gradients = {
  primary: gradientPrimary,
  accent: [accentColor, gradientPrimary[1]],
};

// Font system
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "Roboto",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Export theme type helper
export type ThemeMode = "light" | "dark";
