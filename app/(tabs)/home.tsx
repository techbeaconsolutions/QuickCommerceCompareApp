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
  Image,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { scrapePlatform } from "../../src/api/scrape"; // ✅ API import

export default function HomeScreen() {
  const [product, setProduct] = useState("");
  const [pincode, setPincode] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const messages = [
    { icon: "🛒", title: "Scraping data…", subtitle: "Connecting to sources" },
    { icon: "🔍", title: "Searching prices…", subtitle: "Scanning ₹ tags" },
    { icon: "💸", title: "Comparing deals…", subtitle: "Finding the best offer" },
  ];

  // 🌟 Floating sparkles
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  // ✨ Header fade-in
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  // 💡 Shimmer animation
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // 💬 Loader fade animation
  const fadeLoaderAnim = useRef(new Animated.Value(1)).current;

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
        Animated.delay(4000),
      ]).start(() => shimmerLoop());
    };
    shimmerLoop();
  }, []);

  // 🌈 Fade-in/out loading messages
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        // Fade out
        Animated.timing(fadeLoaderAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          // Switch text
          setStep((prev) => (prev + 1) % messages.length);
          // Fade back in
          Animated.timing(fadeLoaderAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }).start();
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // 🧠 Extract ₹price from text
  function extractPrice(text: string): string {
    const match = text.match(/₹\s*\d+/);
    return match ? match[0] : "N/A";
  }

  // 🚀 Compare handler
  const handleCompare = async () => {
    if (!product || !pincode) {
      Alert.alert("Missing Info", "Please enter both product and pincode.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await scrapePlatform("all", pincode, product);
      const data = response?.data || {};

      const combined = [
        ...(data.blinkit || []).map((item: any) => ({
          ...item,
          price: extractPrice(item.price),
          platform: "Blinkit",
        })),
        ...(data.zepto || []).map((item: any) => ({
          ...item,
          price: extractPrice(item.price),
          platform: "Zepto",
        })),
        ...(data.swiggy || []).map((item: any) => ({
          ...item,
          price: extractPrice(item.price),
          platform: "Swiggy",
        })),
        ...(data.flipkart || []).map((item: any) => ({
          ...item,
          price: extractPrice(item.price),
          platform: "Flipkart",
        })),
      ];

      // Sort platforms: Blinkit → Zepto → Swiggy → Flipkart
      const platformOrder = ["Blinkit", "Zepto", "Swiggy", "Flipkart"];
      combined.sort(
        (a, b) => platformOrder.indexOf(a.platform) - platformOrder.indexOf(b.platform)
      );

      setResults(combined);
    } catch (err: any) {
      console.error("❌ API Error:", err.message);
      Alert.alert("Error", "Failed to fetch comparison data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

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
        <Ionicons
          name="sparkles-outline"
          size={36}
          color="#0cc6e9"
          style={{ opacity: 0.25 }}
        />
      </Animated.View>

      {/* Main Scroll Content */}
<ScrollView
  style={styles.container}
  contentContainerStyle={{ paddingBottom: 100 }} // ⬅️ space for bottom tab
  showsVerticalScrollIndicator={false}
>
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

        {/* 📊 Results Section */}
        <Text style={styles.sectionTitle}>Results</Text>

        {loading && (
          <View style={{ alignItems: "center", marginVertical: 30 }}>
            <Animated.Text
              style={{
                opacity: fadeLoaderAnim,
                fontSize: 18,
                fontWeight: "700",
                color: "#0871da",
              }}
            >
              {messages[step].icon} {messages[step].title}
            </Animated.Text>
            <Animated.Text
              style={{
                opacity: fadeLoaderAnim,
                fontSize: 14,
                color: "#555",
                marginTop: 6,
              }}
            >
              {messages[step].subtitle}
            </Animated.Text>
          </View>
        )}

        {!loading && results.length === 0 && (
          <Text style={{ textAlign: "center", color: "#777", marginVertical: 20 }}>
            No results found. Try searching a product.
          </Text>
        )}

        {!loading && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(_, i) => i.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={[styles.cardBox, { borderColor: "#ddd" }]}>
                <Image
                  source={{
                    uri:
                      item.image ||
                      "https://cdn-icons-png.flaticon.com/512/7185/7185640.png",
                  }}
                  style={styles.cardImage}
                />
                <Text numberOfLines={2} style={styles.cardTitle}>
                  {item.title || item.name}
                </Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                  {item.platform}
                </Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sparkle: { position: "absolute", zIndex: 0 },
  header: { alignItems: "center", marginTop: 5, marginBottom: 10 },
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
    marginBottom: 10,
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
  shimmerOverlay: { ...StyleSheet.absoluteFillObject },
  shimmerGradient: { width: 100, height: "100%" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sectionTitle: {
    fontSize: 16,
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
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  catIcon: { fontSize: 18 },
  catName: { marginTop: 6, fontSize: 11, color: "#333" },
  cardBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#ddd",
    width: "48%",
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginTop: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0871da",
    marginTop: 4,
  },
});
