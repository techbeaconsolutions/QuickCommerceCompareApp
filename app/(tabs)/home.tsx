import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [product, setProduct] = useState("");
  const [pincode, setPincode] = useState("");
  const router = useRouter();

  // 🌟 Floating sparkles
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  // ✨ Header fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  // 💡 Shimmer animation
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    float(floatAnim1, 0);
    float(floatAnim2, 800);

    // Fade-in header
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Loop shimmer every few seconds
    const shimmerLoop = () => {
      shimmerAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(4000), // 4s gap between shimmers
      ]).start(() => shimmerLoop());
    };
    shimmerLoop();
  }, []);

  const handleCompare = () => {
    if (!product || !pincode) return;
    router.push({
      pathname: "/(tabs)/compare",
      params: { product, pincode },
    });
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const popularItems = ["Milk", "Bread", "Eggs", "Rice", "Atta"];
  const categories = [
    { name: "Dairy", icon: "🥛" },
    { name: "Bakery", icon: "🍞" },
    { name: "Fruits", icon: "🍎" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Grains", icon: "🧁" },
    { name: "Beverages", icon: "🥤" },
    { name: "Care", icon: "🧴" },
    { name: "Snacks", icon: "🍪" },
  ];

  const platforms = [
    { name: "Blinkit", color: "#FFC107", short: "B" },
    { name: "Zepto", color: "#9C27B0", short: "Z" },
    { name: "Swiggy", color: "#FF5722", short: "S" },
    { name: "Flipkart", color: "#2196F3", short: "F" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fcff" }}>
      {/* 🌟 Floating sparkles */}
      <Animated.View
        style={[
          styles.sparkle,
          { top: 80, left: 40, transform: [{ translateY: floatAnim1 }] },
        ]}
      >
        <Ionicons name="sparkles" size={32} color="#0871da" style={{ opacity: 0.2 }} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          { top: 140, right: 60, transform: [{ translateY: floatAnim2 }] },
        ]}
      >
        <Ionicons name="sparkles-outline" size={36} color="#0cc6e9" style={{ opacity: 0.25 }} />
      </Animated.View>

      {/* Main Scroll Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ✨ Animated Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.heading}>
            Compare <Text style={styles.gradientText}>Prices.</Text>
          </Text>
          <Text style={styles.subheading}>Save Smart.</Text>
          <Text style={styles.desc}>
            Real-time price comparison across all major platforms
          </Text>
        </Animated.View>

        {/* Search Card */}
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Search for product"
              value={product}
              onChangeText={setProduct}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Pincode"
              keyboardType="numeric"
              value={pincode}
              onChangeText={setPincode}
              style={styles.input}
            />
          </View>

          {/* ✨ Shimmering Compare Button */}
          <TouchableOpacity onPress={handleCompare} activeOpacity={0.8}>
            <View style={styles.buttonWrapper}>
              <LinearGradient
                colors={["#0871da", "#0cc6e9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Compare</Text>
              </LinearGradient>

              {/* Shimmer Overlay */}
              <Animated.View
                style={[
                  styles.shimmerOverlay,
                  { transform: [{ translateX: shimmerTranslate }] },
                ]}
              >
                <LinearGradient
                  colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>

          <View style={styles.popularContainer}>
            {popularItems.map((item, idx) => (
              <View key={idx} style={styles.popularTag}>
                <Text style={styles.popularText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <View key={i} style={styles.catCard}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catName}>{cat.name}</Text>
            </View>
          ))}
        </View>

        {/* Top Platforms */}
        <Text style={styles.sectionTitle}>Compare Prices Across</Text>
        <View style={styles.platformGrid}>
          {platforms.map((p, i) => (
            <View
              key={i}
              style={[styles.platformCard, { backgroundColor: p.color }]}
            >
              <Text style={styles.platformShort}>{p.short}</Text>
              <Text style={styles.platformName}>{p.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sparkle: { position: "absolute", zIndex: 0 },
  header: { alignItems: "center", marginTop: 10, marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: "800", color: "#111" },
  gradientText: { color: "#0871da" },
  subheading: { fontSize: 28, fontWeight: "800", color: "#6C63FF" },
  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fb",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 45, fontSize: 15 },
  buttonWrapper: { position: "relative", overflow: "hidden", borderRadius: 50 },
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmerGradient: {
    width: 100,
    height: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  popularContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  popularTag: {
    backgroundColor: "#eef5ff",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  popularText: { fontSize: 13, color: "#0871da", fontWeight: "500" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 14,
    marginLeft: 4,
    color: "#111",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  catCard: {
    width: "22%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  catIcon: { fontSize: 24 },
  catName: { marginTop: 6, fontSize: 13, color: "#333" },
  platformGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  platformCard: {
    width: "47%",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  platformShort: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  platformName: { color: "#fff", fontWeight: "600", marginTop: 4 },
});
