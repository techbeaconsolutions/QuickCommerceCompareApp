import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "../../src/api/apiClient";

export default function ResetPassword() {
const params = useLocalSearchParams();
const rawToken = params.resetToken;

const resetToken =
  Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔒 Guard invalid access
  useEffect(() => {
    if (!resetToken) {
      Toast.show({
        type: "error",
        text1: "Invalid session",
        text2: "Please restart password reset",
      });
      router.replace("/auth/forgot-password");
    }
  }, [resetToken]);

  const resetPassword = async () => {
    if (loading) return;

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak password",
        text2: "Minimum 6 characters required",
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post("/auth/reset-password", {
        resetToken,
        password: password.trim(), // ✅ correct key
      });

      Toast.show({
        type: "success",
        text1: "Password reset successful 🎉",
      });

      router.replace("/auth/login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Reset failed",
        text2: err?.response?.data?.message || "Try again",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.inputWrap}>
        <TextInput
          secureTextEntry={!show}
          placeholder="New password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        secureTextEntry={!show}
        placeholder="Confirm password"
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        onPress={resetPassword}
        style={[styles.btn, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  input: { flex: 1, padding: 14 },
  btn: {
    backgroundColor: "#0871da",
    padding: 14,
    borderRadius: 30,
    marginTop: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
