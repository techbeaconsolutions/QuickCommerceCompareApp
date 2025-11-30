// app/_layout.tsx
import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

// ✅ ADD THESE
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

const AnimatedToast = ({ children }) => (
  <Animated.View
    entering={FadeInDown.duration(400).springify()}
    exiting={FadeOutUp.duration(300)}
  >
    {children}
  </Animated.View>
);

const toastConfig = {
  success: (props) => (
    <AnimatedToast>
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#00C851",
          backgroundColor: "#1E1E1E",
          borderRadius: 12,
          elevation: 4,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#fff",
        }}
        text2Style={{
          fontSize: 14,
          color: "#d4d4d4",
        }}
      />
    </AnimatedToast>
  ),
  error: (props) => (
    <AnimatedToast>
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#FF4C4C",
          backgroundColor: "#1E1E1E",
          borderRadius: 12,
          elevation: 4,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "700",
          color: "#fff",
        }}
        text2Style={{
          fontSize: 14,
          color: "#d4d4d4",
        }}
      />
    </AnimatedToast>
  ),
};

export default function RootLayout() {

  // ✅ Load Ionicons font (IMPORTANT)
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) return null; // Wait until fonts load

  return (
    <AuthProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding/index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="auth/otp" />
            <Stack.Screen name="(tabs)" />
          </Stack>

          <Toast config={toastConfig} />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
