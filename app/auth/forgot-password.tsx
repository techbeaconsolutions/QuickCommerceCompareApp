import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";
import Toast from "react-native-toast-message";
import { apiClient } from "../../src/api/apiClient";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    // 🔔 VALIDATIONS
    if (!cleanEmail) {
      Toast.show({
        type: "error",
        text1: "Email required",
        text2: "Please enter your email address",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(true);

      // 📡 API CALL
      await apiClient.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      Toast.show({
        type: "success",
        text1: "OTP Sent 📩",
        text2: "Check your email to continue",
      });

      // ➡️ Navigate to OTP screen with email
      router.push({
        pathname: "/auth/otp",
        params: { email: cleanEmail },
      } as Href);
    } catch (err: any) {
      console.log("FORGOT PASSWORD ERROR:", err);

      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
        text2:
          err?.response?.data?.message ||
          err?.message ||
          "Server not reachable",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0871da", "#0cc6e9"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we’ll send you an OTP to reset your password.
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#B3E5FC"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSendOTP}
          />
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          onPress={handleSendOTP}
          style={[styles.signInButton, loading && { opacity: 0.7 }]}
          disabled={loading}
        >
          <LinearGradient
            colors={["#fff", "#e0f7ff"]}
            style={styles.signInGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0871da" />
            ) : (
              <Text style={styles.signInText}>Send OTP</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  backText: {
    color: "#fff",
    fontSize: 15,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#E1F5FE",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    color: "#E1F5FE",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  signInButton: {
    alignItems: "center",
    marginTop: 20,
  },
  signInGradient: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 80,
  },
  signInText: {
    color: "#0871da",
    fontSize: 16,
    fontWeight: "700",
  },
});
