// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

function RootNavigator() {
  const { loading } = useAuth();

  // 🔑 Block navigation until auth is restored
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(routes)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />

        {/* ✅ MUST be here */}
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
