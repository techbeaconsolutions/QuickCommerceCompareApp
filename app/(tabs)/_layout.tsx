import React, { useEffect } from "react";
import { View, Platform  } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 👈 important

// 🎨 Themed Tabs using global theme
function ThemedTabs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets(); // 👈 get device safe area

  // 🧠 Log theme changes for debugging
  useEffect(() => {
    console.log("🎨 Current Theme:", theme);
  }, [theme]);

  // 🌗 Build a custom navigation theme
  const navigationTheme = isDark
    ? {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          background: "#121212",
          card: "#1e1e1e",
          text: "#fff",
          border: "#222",
          primary: "#0cc6e9",
        },
      }
    : {
        ...NavigationLightTheme,
        colors: {
          ...NavigationLightTheme.colors,
          background: "#f9fcff",
          card: "#ffffff",
          text: "#111",
          border: "#ddd",
          primary: "#0871da",
        },
      };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: navigationTheme.colors.background, paddingBottom: insets.bottom }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Tabs
          key={theme} // 👈 Forces Tabs to re-render when theme changes
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
              backgroundColor: navigationTheme.colors.card,
              borderTopWidth: 0,
              elevation: 10,
              height: 80 + (Platform.OS === "android" ? insets.bottom : 0), // 👈 add extra height
              borderRadius: 10,
              position: "absolute",
              marginHorizontal: 0,
              marginBottom: -10,
              paddingBottom: insets.bottom, // 👈 ensure it stays above navbar
              paddingTop: 10,
            },
            tabBarActiveTintColor: navigationTheme.colors.primary,
            tabBarInactiveTintColor: isDark ? "#aaa" : "#666",
          }}
        >
          {/* 🏠 HOME */}
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
              ),
            }}
          />

          {/* 🔁 COMPARE */}
          <Tabs.Screen
            name="compare"
            options={{
              title: "Compare",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "git-compare" : "git-compare-outline"}
                  size={26}
                  color={color}
                />
              ),
            }}
          />

          {/* ❤️ SAVED */}
          <Tabs.Screen
            name="saved"
            options={{
              title: "Saved",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />
              ),
            }}
          />

          {/* 👤 PROFILE */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </NavigationThemeProvider>
  );
}

// 🌍 Wrap your ThemedTabs in the global ThemeProvider
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedTabs />
    </ThemeProvider>
  );
}
