// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../src/context/AuthContext";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { mode, colors, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const router = useRouter();

  const isDark = mode === "dark";

  // --- DEBUG / DIAGNOSTIC handleLogout ---
  const handleLogout = async () => {

    const confirmLogout =
      Platform.OS === "web"
        ? window.confirm("Are you sure you want to logout?")
        : true; // fallback for testing mobile

    if (!confirmLogout) return;

    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Logged out successfully 👋",
      });
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  // QUICK manual logout - use this to test without Alert
  const forceLogoutNow = async () => {
    try {
      if (typeof logout === "function") await logout();
      router.replace("/auth/login");
      Toast.show({ type: "success", text1: "Force logout success" });
    } catch (err) {
      console.error("[PROFILE] forceLogout error:", err);
      Toast.show({ type: "error", text1: "Force logout failed", text2: String(err) });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={90}
          color={isDark ? "#0cc6e9" : "#0871da"}
        />
        <Text style={[styles.username, { color: colors.text }]}>
          {user?.name || "Guest User"}
        </Text>
        {/* <Text style={[styles.email, { color: colors.secondaryText }]}>
          {user?.email || "guest@example.com"}
        </Text> */}
      </View>

      {/* Theme Toggle */}
      <View
        style={[
          styles.themeCard,
          { backgroundColor: isDark ? "#1f1f1f" : "rgba(255,255,255,0.9)" },
        ]}
      >
        <Ionicons
          name={isDark ? "moon-outline" : "sunny-outline"}
          size={24}
          color={isDark ? "#0cc6e9" : "#0871da"}
        />
        <Text
          style={[
            styles.themeLabel,
            { color: colors.text, flex: 1, marginLeft: 10 },
          ]}
        >
          {isDark ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? "#0cc6e9" : "#0871da"}
          trackColor={{ false: "#ccc", true: "#0cc6e9" }}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 24 }}>
        <LinearGradient
          colors={isDark ? ["#0cc6e9", "#0871da"] : ["#0871da", "#0cc6e9"]}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Force logout (for debugging): */}
      {/* <TouchableOpacity
        onPress={forceLogoutNow}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: colors.text, textDecorationLine: "underline" }}>
          Force logout (no confirm)
        </Text>
      </TouchableOpacity> */}

      <Text
        style={[
          styles.version,
          {
            color: isDark ? "#888" : "#aaa",
            bottom: insets.bottom + 10,
          },
        ]}
      >
        v1.0.0 • Made with ❤️
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  header: { alignItems: "center" },
  username: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  email: { fontSize: 14, marginTop: 2 },
  themeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginTop: 24,
    width: "90%",

    // Android
    elevation: 2,

    // Web
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 6px rgba(0,0,0,0.05)" }
      : {}),
  },
  themeLabel: { fontSize: 16, fontWeight: "600" },
  logoutButton: {
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 16,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  version: { position: "absolute", fontSize: 12, alignSelf: "center" },
});
