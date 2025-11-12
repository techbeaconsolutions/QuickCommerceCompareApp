import React, { useEffect } from "react";
import { View, Platform, Dimensions } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize"; // 👈 for responsive font scaling

// 🎨 Themed Tabs using global theme
function ThemedTabs() {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  // 🧠 Debug theme change
  useEffect(() => {
    console.log("🎨 Current Theme:", mode);
  }, [mode]);

  // 🌗 Custom navigation theme
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
      <View
        style={{
          flex: 1,
          backgroundColor: navigationTheme.colors.background,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <Tabs
          key={mode} // 👈 re-render tabs when theme changes
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
              backgroundColor: navigationTheme.colors.card,
              borderTopWidth: 0,
              elevation: 10,
              height: Math.max(60, height * 0.09) + insets.bottom, // ✅ responsive height
              paddingBottom: insets.bottom,
              paddingTop: 6,
              borderRadius: 5,
              position: "absolute",
              left: width * 0.05, // ✅ responsive horizontal margin
              right: width * 0.05,
              bottom: insets.bottom > 0 ? insets.bottom / 2 : -15, // ✅ sits above nav bar
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
            },
            tabBarActiveTintColor: navigationTheme.colors.primary,
            tabBarInactiveTintColor: isDark ? "#aaa" : "#666",
            tabBarLabelStyle: {
              fontSize: RFValue(11), // ✅ scales with screen size
              fontWeight: "600",
              marginBottom: 4,
            },
            tabBarIconStyle: {
              marginBottom: -4,
            },
          }}
        >
          {/* 🏠 HOME */}
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={26}
                  color={color}
                />
              ),
            }}
          />

          {/* 👤 PROFILE */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={26}
                  color={color}
                />
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
