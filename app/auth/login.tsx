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
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

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
        text2: "Please enter a valid email",
      });
      return;
    }

    if (!cleanPassword) {
      Toast.show({
        type: "error",
        text1: "Password required",
        text2: "Please enter your password",
      });
      return;
    }

    // if (cleanPassword.length < 6) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Weak password",
    //     text2: "Password must be at least 6 characters",
    //   });
    //   return;
    // }

    try {
      Keyboard.dismiss();
      setLoading(true);

      await login(cleanEmail, cleanPassword);

      Toast.show({
        type: "success",
        text1: "Login successful 🎉",
        text2: "Welcome back!",
      });

      router.replace("/");

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);

      Toast.show({
        type: "error",
        text1: "Login failed",
        text2:
          "Invalib user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0871da", "#0cc6e9"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* EMAIL */}
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
            returnKeyType="next"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#B3E5FC"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.signInButton, loading && { opacity: 0.7 }]}
          disabled={loading}
        >
          <LinearGradient colors={["#fff", "#e0f7ff"]} style={styles.signInGradient}>
            {loading ? (
              <ActivityIndicator size="small" color="#0871da" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* SIGN UP */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup" as Href)}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
  onPress={() => router.push("/auth/forgot-password")}
  style={{ marginTop: 15 }}
>
  <Text style={{ color: "#E1F5FE", textAlign: "center" }}>
    Forgot Password?
  </Text>
</TouchableOpacity>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#E1F5FE",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: { marginBottom: 18 },
  label: { color: "#E1F5FE", marginBottom: 6 },

  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    color: "#fff",
  },
  eyeButton: {
    paddingHorizontal: 12,
  },

  signInButton: { alignItems: "center", marginTop: 10 },
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

  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  signUpText: { color: "#fff" },
  signUpLink: { color: "#fff", fontWeight: "700" },
});
