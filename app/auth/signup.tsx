import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "../../src/context/AuthContext";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1️⃣ Empty field validation
    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Incomplete details",
        text2: "All fields are mandatory.",
      });
      return;
    }

    // 2️⃣ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid email",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    // 3️⃣ Password length validation
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak password",
        text2: "Password must be at least 6 characters long.",
      });
      return;
    }

    // 4️⃣ Password match validation
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);

      await signup(trimmedName, trimmedEmail, password);

      Toast.show({
        type: "success",
        text1: "Account created 🎉",
        text2: "Please log in to continue.",
      });

      router.replace("/auth/login" as Href);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0871da", "#0cc6e9"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.innerContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to explore the best deals in QuickCommerce Compare.
          </Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#B3E5FC"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
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
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#B3E5FC"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor="#B3E5FC"
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            style={styles.signupButton}
            disabled={loading}
          >
            <LinearGradient
              colors={["#fff", "#e0f7ff"]}
              style={styles.signupGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#0871da" />
              ) : (
                <Text style={styles.signupText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login" as Href)}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backText: { color: "#fff", fontSize: 15 },
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
    marginBottom: 40,
  },
  inputContainer: { marginBottom: 18 },
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
  signupButton: { alignItems: "center", marginTop: 20 },
  signupGradient: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 70,
  },
  signupText: {
    color: "#0871da",
    fontSize: 16,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: { color: "#fff", fontSize: 14 },
  loginLink: { color: "#fff", fontWeight: "700" },
});
