// app/_layout.tsx
import { Stack } from "expo-router";
import Toast, {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";

// ✅ Custom Animated Toast wrapper
const AnimatedToast = ({ children }: { children: React.ReactNode }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      exiting={FadeOutUp.duration(300)}
    >
      {children}
    </Animated.View>
  );
};

// ✅ Toast Config with Animation + Theming
const toastConfig = {
  success: (props: BaseToastProps) => (
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

  error: (props: BaseToastProps) => (
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
  return (
    <>
      <StatusBar style="light" />

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

      {/* ✅ Global Animated Toast */}
      <Toast config={toastConfig} />
    </>
  );
}
