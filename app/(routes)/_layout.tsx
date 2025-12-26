import { Slot, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RouteGate() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setLoggedIn(!!token);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0871da" />
      </View>
    );
  }

  // 🔥 Not logged in? Send to login
  if (!loggedIn) return <Redirect href="/auth/login" />;

  // 🔥 Logged in? Load the app
  return <Slot />;
}
