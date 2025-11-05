import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext"; // ✅ global theme
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets(); // 👈 import this hook
  const { theme, toggleTheme } = useTheme(); // ✅ from context
  const isDark = theme === "dark";

  const user = { name: "Pratik Ostwal", email: "pratik@example.com" };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f9fcff" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={90}
          color={isDark ? "#0cc6e9" : "#0871da"}
        />
        <Text style={[styles.username, { color: isDark ? "#fff" : "#111" }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? "#aaa" : "#666" }]}>
          {user.email}
        </Text>
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
            { color: isDark ? "#fff" : "#111", flex: 1, marginLeft: 10 },
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

      <Text
        style={[
          styles.version,
          {
            color: isDark ? "#888" : "#aaa",
            bottom: insets.bottom + 10, // 👈 Safe area aware
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
