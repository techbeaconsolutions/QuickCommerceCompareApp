// app/_layout.tsx
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaView, LogBox } from "react-native";

LogBox.ignoreLogs([
  "pointerEvents is deprecated",
  '"shadow*" style props are deprecated',
  "useNativeDriver is not supported",
]);

export default function Layout() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </PaperProvider>
  );
}
