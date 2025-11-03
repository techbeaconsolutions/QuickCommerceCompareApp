import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignIn = () => {
    // Redirect to login page
    Alert.alert("Redirecting", "Navigate to Sign In / Sign Up page.");
  };

  const handleSignOut = () => {
    Alert.alert("Signed Out", "You have been signed out successfully.");
    setIsSignedIn(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={48} color="#fff" />
        </View>
        <Text style={styles.username}>
          {isSignedIn ? "Pratik Ostwal" : "Guest User"}
        </Text>
        <Text style={styles.subtitle}>
          {isSignedIn
            ? "Welcome back! Manage your preferences below."
            : "Sign in to save preferences"}
        </Text>
      </View>

      {/* Card List */}
      <View style={styles.cardList}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="location-outline" size={24} color="#0871da" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Saved Locations</Text>
            <Text style={styles.cardSubtitle}>Add or manage locations</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#aaa" />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="notifications-outline" size={24} color="#0871da" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardSubtitle}>Manage alerts</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            thumbColor={notificationsEnabled ? "#0871da" : "#ccc"}
          />
        </View>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons name="settings-outline" size={24} color="#0871da" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.cardSubtitle}>Configure preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Sign In / Out */}
      <TouchableOpacity
        onPress={isSignedIn ? handleSignOut : handleSignIn}
        activeOpacity={0.9}
        style={{ marginTop: 24 }}
      >
        {isSignedIn ? (
          <View style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={20} color="#0871da" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        ) : (
          <LinearGradient
            colors={["#0871da", "#0cc6e9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signInButton}
          >
            <Text style={styles.signInText}>Sign In / Sign Up</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.madeWith}>
          Made with <Text style={{ color: "red" }}>❤</Text> for smart shoppers
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fcff", padding: 16 },
  header: { alignItems: "center", marginTop: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#0871da",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  username: { fontSize: 20, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  cardList: { marginTop: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcon: {
    backgroundColor: "#eef5ff",
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  cardSubtitle: { fontSize: 13, color: "#666", marginTop: 2 },
  signInButton: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  signInText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#0871da",
    borderWidth: 1.5,
    borderRadius: 50,
    paddingVertical: 12,
    gap: 6,
  },
  signOutText: { color: "#0871da", fontWeight: "600", fontSize: 16 },
  footer: { alignItems: "center", marginTop: 30 },
  version: { color: "#aaa", fontSize: 13 },
  madeWith: { color: "#666", fontSize: 13, marginTop: 4 },
});
