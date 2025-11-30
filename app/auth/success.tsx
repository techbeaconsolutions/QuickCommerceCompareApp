import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, Easing, Image, StyleSheet, Text } from "react-native";

export default function SuccessScreen() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate checkmark
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();

    // Redirect to home after 2.5s
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home" as Href);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#0871da", "#0cc6e9"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={require("../../assets/images/checkmark.png")}
          style={styles.checkmark}
        />
      </Animated.View>

      <Animated.View style={{ opacity: opacityAnim }}>
        <Text style={styles.title}>Welcome 🎉</Text>
        <Text style={styles.subtitle}>
          You're all set! Let's explore the best deals around you.
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    boxShadowColor: "#000",
    boxShadowOpacity: 0.2,
    boxShadowOffset: { width: 0, height: 4 },
    boxShadowRadius: 8,
    elevation: 10,
  },
  checkmark: {
    width: 60,
    height: 60,
    tintColor: "#0871da",
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
    marginTop: 10,
    paddingHorizontal: 30,
  },
});
