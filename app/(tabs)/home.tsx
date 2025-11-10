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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { scrapePlatform } from "../../src/api/scrape";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";

/** Product Type */
type Product = {
  id?: string;
  title: string;
  platform: string;
  price?: string;
  image?: string;
  pincode?: string;
};

export default function HomeScreen() {
  const { colors } = useTheme();

  const [product, setProduct] = useState("");
  const [pincode, setPincode] = useState("");
  const [locationInfo, setLocationInfo] = useState<{ city?: string; area?: string; pincode?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Product[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const messages = [
    { icon: "🛒", title: "Scraping data…", subtitle: "Connecting to sources" },
    { icon: "🔍", title: "Searching prices…", subtitle: "Scanning ₹ tags" },
    { icon: "💸", title: "Comparing deals…", subtitle: "Finding the best offer" },
  ];

  /** Load cached or detect new location */
  useEffect(() => {
    const loadCached = async () => {
      const cached = await AsyncStorage.getItem("locationInfo");
      if (cached) {
        const parsed = JSON.parse(cached);
        setLocationInfo(parsed);
        setPincode(parsed.pincode);
      } else {
        await getCurrentLocation(true);
      }
    };
    loadCached();
  }, []);

  /** Load saved products */
  useFocusEffect(
    React.useCallback(() => {
      const loadSaved = async () => {
        const stored = await AsyncStorage.getItem("savedProducts");
        setSavedItems(stored ? JSON.parse(stored) : []);
      };
      loadSaved();
    }, [])
  );

  /** Shimmer Animation for Button */
  useEffect(() => {
    const loop = () => {
      shimmerAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
      ]).start(() => loop());
    };
    loop();
  }, []);

  /** Price extractor */
  const extractPrice = (text: string): string => {
    const match = text.match(/₹\s*\d+/);
    return match ? match[0] : "N/A";
  };

  /** Detect current location */
  const getCurrentLocation = async (force = false): Promise<string | null> => {
    try {
      if (!force) {
        const cached = await AsyncStorage.getItem("locationInfo");
        if (cached) {
          const parsed = JSON.parse(cached);
          setLocationInfo(parsed);
          setPincode(parsed.pincode);
          return parsed.pincode;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Please allow location access to detect your area.",
          position: "top",
        });
        return null;
      }

      // Get GPS coordinates with high accuracy
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      // Try reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      let info = geocode[0];
      if (!info) {
        throw new Error("No address info found.");
      }

      const newLocation = {
        city: info.city ?? info.subregion ?? info.region ?? "Unknown City",
        area: info.name ?? info.district ?? "Unknown Area",
        pincode: info.postalCode ?? "",
      };

      if (!newLocation.pincode) {
        Toast.show({
          type: "info",
          text1: "Location Detected",
          text2: `${newLocation.area}, ${newLocation.city} (pincode not found)`,
          position: "top",
        });
      }

      setLocationInfo(newLocation);
      setPincode(newLocation.pincode);
      await AsyncStorage.setItem("locationInfo", JSON.stringify(newLocation));

      return newLocation.pincode;
    } catch (err) {
      console.error("📍 Location error:", err);
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2: "Unable to detect location. Please try again.",
        position: "top",
      });
      return null;
    }
  };


  /** Compare Button Handler */
  const handleCompare = async () => {
    const trimmedProduct = product.trim();
    const trimmedPincode = pincode.trim();

    if (!trimmedProduct || !trimmedPincode) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please enter a product name before comparing.",
        position: "top",
      });
      return;
    }

    setLoading(true);
    setResults([]);
    setStep(0);
    let stepIndex = 0;

    const messageInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % messages.length;
      setStep(stepIndex);
    }, 2000);

    try {
      const response = await scrapePlatform("all", trimmedPincode, trimmedProduct);
      const data = response?.data || {};

      const combined: Product[] = [
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

      setResults(combined);
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: `Prices loaded for "${trimmedProduct}" in ${trimmedPincode}`,
        position: "top",
      });
      setSuccess(true);
      setTimeout(() => setProduct(""), 400);
      setTimeout(() => setSuccess(false), 1500);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch comparison data. Try again.",
        position: "top",
      });
    } finally {
      clearInterval(messageInterval);
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
  ];

  const platformColors: Record<string, string> = {
    Blinkit: "#FFD84D",
    Zepto: "#9C1AFF",
    Swiggy: "#FC8019",
    Flipkart: "#2874F0",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Compare <Text style={{ color: colors.primary }}>Prices.</Text>
          </Text>
          <Text style={[styles.subheading, { color: colors.primary }]}>Save Smart.</Text>
          <Text style={[styles.desc, { color: colors.secondaryText }]}>
            Real-time price comparison across all major platforms
          </Text>
        </View>

        {/* Location Banner (Blinkit-style) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => getCurrentLocation(true)}
          style={[
            styles.locationBanner,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="location" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            {locationInfo.area || locationInfo.city ? (
              <>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>
                  Home – {locationInfo.area || "Unknown Area"}, {locationInfo.city || "Unknown City"}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                  {locationInfo.pincode ? `Pincode: ${locationInfo.pincode}` : "Pincode not available"}
                </Text>
              </>
            ) : (
              <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
                Tap to detect your location
              </Text>
            )}
          </View>

          <Ionicons name="chevron-down" size={18} color={colors.secondaryText} />
        </TouchableOpacity>

        {/* Search Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.secondaryText} style={styles.icon} />
          <TextInput
            placeholder="Search for product"
            placeholderTextColor={colors.secondaryText}
            value={product}
            onChangeText={setProduct}
            style={[styles.input, { color: colors.text }]}
          />
        </View>

        {/* Compare Button */}
        <TouchableOpacity onPress={handleCompare} activeOpacity={0.8} disabled={loading || success}>
          <View style={[styles.buttonWrapper, loading && { opacity: 0.8 }]}>
            <LinearGradient
              colors={loading ? [colors.border, colors.border] : [colors.primary, "#0cc6e9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                    {messages[step].title}
                  </Text>
                </View>
              ) : success ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 6 }]}>Done</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Compare</Text>
              )}
            </LinearGradient>

            {!loading && (
              <Animated.View
                style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerTranslate }] }]}
              >
                <LinearGradient
                  colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Categories</Text>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[styles.catCard, { backgroundColor: colors.card }]}
              onPress={async () => {
                let detectedPin = await getCurrentLocation(false);
                if (!detectedPin) detectedPin = await getCurrentLocation(true);
                if (!detectedPin) return;
                setProduct(cat.name);
                handleCompare();
              }}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Results</Text>
        {loading && (
          <View style={{ alignItems: "center", marginVertical: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.primary }}>
              {messages[step].icon} {messages[step].title}
            </Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText, marginTop: 6 }}>
              {messages[step].subtitle}
            </Text>
          </View>
        )}

        {!loading && results.length === 0 && (
          <Text style={{ textAlign: "center", color: colors.secondaryText, marginVertical: 100 }}>
            No results found. Try searching a product.
          </Text>
        )}

        {!loading && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => item.title + item.platform + index}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.cardBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      "https://cdn-icons-png.flaticon.com/512/7185/7185640.png",
                  }}
                  style={styles.cardImage}
                />
                <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title || "Unnamed"}
                </Text>
                <Text style={[styles.cardPrice, { color: colors.primary }]}>{item.price}</Text>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: platformColors[item.platform] || "#ccc",
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                    {item.platform}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { alignItems: "center", marginTop: 20, marginBottom: 10 },
  heading: { fontSize: 28, fontWeight: "800" },
  subheading: { fontSize: 28, fontWeight: "800" },
  desc: { fontSize: 14, textAlign: "center", marginTop: 6, lineHeight: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  locationBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 45, fontSize: 15 },
  buttonWrapper: { position: "relative", overflow: "hidden", borderRadius: 50 },
  button: { borderRadius: 50, paddingVertical: 14, alignItems: "center" },
  shimmerOverlay: { ...StyleSheet.absoluteFillObject },
  shimmerGradient: { width: 100, height: "100%" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 5, marginLeft: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  catCard: {
    width: "22%",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 5,
    elevation: 2,
  },
  catIcon: { fontSize: 18 },
  catName: { marginTop: 6, fontSize: 11 },
  cardBox: {
    borderRadius: 16,
    borderWidth: 1.2,
    width: "48%",
    marginBottom: 10,
    padding: 10,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 100, borderRadius: 10, resizeMode: "contain" },
  cardTitle: { fontSize: 14, fontWeight: "600", marginTop: 8 },
  cardPrice: { fontSize: 16, fontWeight: "700", marginTop: 4 },
});
