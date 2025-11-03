// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash & onboarding */}
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding/index" />

      {/* Auth */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/forgot-password" />
      <Stack.Screen name="auth/otp" />

      {/* Tabs */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
