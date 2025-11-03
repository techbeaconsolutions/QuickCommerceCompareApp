import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; // allow only one digit
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus(); // move to next input
    }
  };

  const handleVerify = () => {
    if (otp.join("").length < 4) {
      alert("Please enter all 4 digits of the OTP");
      return;
    }
    router.replace("/auth/reset-password" as Href); // ✅ next step (reset password)
  };

  const handleResend = () => {
    setTimer(30);
    alert("A new OTP has been sent to your email!");
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
        style={styles.innerContainer}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 20 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to your registered email.
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!)}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              returnKeyType="next"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
          <LinearGradient
            colors={["#fff", "#e0f7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.verifyGradient}
          >
            <Text style={styles.verifyText}>Verify OTP</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend Timer */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  otpBox: {
    width: 55,
    height: 55,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "700",
  },
  verifyButton: {
    alignItems: "center",
  },
  verifyGradient: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 80,
  },
  verifyText: {
    color: "#0871da",
    fontSize: 16,
    fontWeight: "700",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
  },
  resendText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
