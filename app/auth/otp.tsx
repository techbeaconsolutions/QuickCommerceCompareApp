
  import React, { useEffect, useState } from "react";
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import Toast from "react-native-toast-message";
import { apiClient } from "../../src/api/apiClient";

  export default function OtpScreen() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const router = useRouter();

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [resending, setResending] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // ⏱ Countdown
    useEffect(() => {
      if (timer === 0) return;
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
      if (!email) {
        Toast.show({
          type: "error",
          text1: "Invalid session",
          text2: "Please restart password reset",
        });
        router.replace("/auth/forgot-password");
      }
    }, [email]);

const verifyOtp = async () => {
  const cleanOtp = otp.replace(/\s/g, "");

  if (cleanOtp.length !== 6) {
    Toast.show({ type: "error", text1: "Invalid OTP" });
    return;
  }

  try {
    setVerifying(true);

    const res = await apiClient.post("/auth/verify-otp", {
      email,
      otp: cleanOtp,
    });


    if (res.data?.success) {

      router.replace({
        pathname: "/auth/reset-password",
        params: {
          resetToken: res.data.resetToken,
        },
      });
    }
  } catch (err: any) {

    Toast.show({
      type: "error",
      text1: err.response?.data?.message || "Invalid OTP",
    });
  } finally {
    setVerifying(false);
  }
};




    const resendOtp = async () => {
      if (timer > 0) return;

      try {
        setResending(true);
        await apiClient.post("/auth/forgot-password", { email });

        Toast.show({
          type: "success",
          text1: "OTP resent",
        });
        setOtp("");
        setTimer(30);
      } catch {
        Toast.show({
          type: "error",
          text1: "Failed to resend OTP",
        });
      } finally {
        setResending(false);
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>Sent to {email}</Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          placeholder="••••••"
        />

        <TouchableOpacity onPress={verifyOtp} style={styles.verifyBtn} disabled={verifying}>
          <Text style={styles.btnText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={resendOtp}
          disabled={timer > 0 || resending}
        >
          <Text style={styles.resendText}>
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
    subtitle: { marginBottom: 20, color: "#666" },
    otpInput: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      fontSize: 18,
      textAlign: "center",
      letterSpacing: 8,
      marginBottom: 20,
    },
    verifyBtn: {
      backgroundColor: "#0871da",
      padding: 14,
      borderRadius: 30,
    },
    btnText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "700",
    },
    resendText: {
      marginTop: 20,
      textAlign: "center",
      color: "#0871da",
      fontWeight: "600",
    },
  });
