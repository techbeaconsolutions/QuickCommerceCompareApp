import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    // ✅ Set background here instead of sceneContainerStyle
    <View style={{ flex: 1, backgroundColor: "#f9fcff" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            elevation: 10,
            height: 85,          // ⬆️ Increased height for thicker bar
            borderRadius: 10,
            position: "absolute",
            marginHorizontal: 12,
            marginBottom: -10,     // flush with bottom
            paddingBottom: 20,   // adds space below icons
            paddingTop: 10,
          },
          tabBarActiveTintColor: "#0871da",
          tabBarInactiveTintColor: "#aaa",
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
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
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
  );
}
