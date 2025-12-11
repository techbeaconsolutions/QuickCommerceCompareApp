// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "../../context/ThemeContext";
import api from "../../src/api/apiClient";
import BestPriceBanner from "../../src/components/BestPriceBanner";

/** Product Type */
type Product = {
  name?: string;
  platform?: string;
  price?: string;
  image?: string;
  pincode?: string;
  quantity?: string;
  url?: string;
  [k: string]: any;
};

export default function HomeScreen() {
  const { colors } = useTheme();

  const [product, setProduct] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [locationInfo, setLocationInfo] = useState<{ city?: string; area?: string; pincode?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [results, setResults] = useState<Product[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false);
  const [manualPincode, setManualPincode] = useState<string>("");
  const [isManualLocation, setIsManualLocation] = useState<boolean>(false);
  const [bestPrice, setBestPrice] = useState<any>(null);
  const [compareTable, setCompareTable] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // NEW: jobId state for background job
  const [jobId, setJobId] = useState<string | null>(null);

  const openProductModal = (item: Product) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  const closeProductModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const navigation = useNavigation();
  const router = useRouter();

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const messages = [
    { icon: "🛒", title: "Scraping data…", subtitle: "Connecting to sources" },
    { icon: "🔍", title: "Searching prices…", subtitle: "Scanning ₹ tags" },
    { icon: "💸", title: "Comparing deals…", subtitle: "Finding the best offer" },
  ];

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const opacityAnim1 = useRef(new Animated.Value(1)).current;
  const opacityAnim2 = useRef(new Animated.Value(1)).current;

  /** Load cached or detect new location */
  useEffect(() => {
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem("locationInfo");
        if (cached) {
          const parsed = JSON.parse(cached);
          setLocationInfo(parsed);
          setPincode(parsed.pincode);
        } else {
          await getCurrentLocation(true);
        }
      } catch (err) {
        console.warn("Failed to load cached location", err);
      }
    };
    loadCached();
  }, []);

  // Floating animation (up & down)
  useEffect(() => {
    const createFloatAndFade = (
      floatAnim: Animated.Value,
      opacityAnim: Animated.Value,
      delay = 0
    ) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -12,
              duration: 2200,
              delay,
              useNativeDriver: false,
            }),
            Animated.timing(floatAnim, {
              toValue: 10,
              duration: 2200,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 2000,
              delay: delay + 500,
              useNativeDriver: false,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
        ])
      ).start();
    };

    createFloatAndFade(floatAnim1, opacityAnim1);
    createFloatAndFade(floatAnim2, opacityAnim2, 800); // offset for natural motion
  }, []);

  /** Load saved products */
  useFocusEffect(
    React.useCallback(() => {
      const loadSaved = async () => {
        try {
          const stored = await AsyncStorage.getItem("savedProducts");
          setSavedItems(stored ? JSON.parse(stored) : []);
        } catch (err) {
          console.warn("Failed to load saved products", err);
          setSavedItems([]);
        }
      };
      loadSaved();
    }, [])
  );

  const handleOrderNow = (item: Product) => {
    const productEnc = encodeURIComponent(item.name || "");
    let url = "";

    if (item.platform === "Blinkit") {
      url = item.url || `https://blinkit.com/s/?q=${productEnc}&pincode=${pincode}`;
    } else if (item.platform === "Zepto") {
      url = item.url || `https://www.zeptonow.com/search?q=${productEnc}`;
    } else if (item.platform === "Instamart" || item.platform === "Swiggy") {
      url = item.url || `https://www.swiggy.com/instamart/search?q=${productEnc}`;
    } else {
      return;
    }

    // 🎯 Web needs window.open
    if (Platform.OS === "web") {
      window.open(url, "_blank");
      return;
    }

    // 📱 Native apps use Linking
    Linking.openURL(url);
  };

  /** Shimmer Animation for Button */
  useEffect(() => {
    const loop = () => {
      shimmerAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.delay(4000),
      ]).start(() => loop());
    };
    loop();
  }, [shimmerAnim]);

  /** Price extractor */
  const extractPrice = (text: string): string => {
    if (!text) return "N/A";
    const match = String(text).match(/₹\s*\d+(\.\d+)?/);
    return match ? match[0] : "N/A";
  };

  /** Safely normalize all price formats */
  const normalizePrice = (p: any): string => {
    if (p === null || typeof p === "undefined") return "N/A";

    if (typeof p === "string") {
      if (p.includes("₹")) {
        return extractPrice(p);
      }
      const num = p.trim();
      if (/^\d+(\.\d+)?$/.test(num)) return `₹${num}`;
      return p;
    }

    if (typeof p === "number") return `₹${p}`;

    return "N/A";
  };

  /** Normalize platform names coming from backend (handles "Swiggy Instamart" etc.) */
  const normalizePlatform = (name?: string): string => {
    if (!name) return "Unknown";
    const n = String(name).toLowerCase();
    if (n.includes("blinkit")) return "Blinkit";
    if (n.includes("zepto")) return "Zepto";
    if (n.includes("swiggy") || n.includes("instamart")) return "Swiggy";
    if (n.includes("flipkart")) return "Flipkart";
    return name;
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

      if (Platform.OS === "web") {
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          const ipData = await ipRes.json();

          const pincode = ipData.postal || "";
          const city = ipData.city || "Unknown City";
          const area = ipData.region || "Unknown Area";

          if (!pincode) throw new Error("No pin from api");

          const newLoc = { city, area, pincode };
          setLocationInfo(newLoc);
          setPincode(pincode);

          await AsyncStorage.setItem("locationInfo", JSON.stringify(newLoc));

          return pincode;
        } catch (err) {
          Toast.show({
            type: "error",
            text1: "Location Error",
            text2: "Enter pincode manually.",
            position: "top",
          });
          return null;
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const info = geocode[0];

      const newLocation = {
        city: info.city ?? info.subregion ?? "Unknown City",
        area: info.name ?? info.district ?? "Unknown Area",
        pincode: info.postalCode ?? "",
      };

      setLocationInfo(newLocation);
      setPincode(newLocation.pincode);

      await AsyncStorage.setItem("locationInfo", JSON.stringify(newLocation));

      return newLocation.pincode;
    } catch (err) {
      return null;
    }
  };

  /** Sparkles (animated) setup - using refs array so we DON'T call hooks in render loop */
  const STAR_COUNT = 6;
  const floatAnimsRef = useRef<Animated.Value[]>([]);
  const spinAnimsRef = useRef<Animated.Value[]>([]);

  if (floatAnimsRef.current.length === 0) {
    floatAnimsRef.current = Array.from({ length: STAR_COUNT }, () => new Animated.Value(0));
  }
  if (spinAnimsRef.current.length === 0) {
    spinAnimsRef.current = Array.from({ length: STAR_COUNT }, () => new Animated.Value(0));
  }

  const starLayout = useMemo(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      size: 16 + (i % 3) * 6,
      left: 20 + (i * 48) % 300,
      top: 8 + (i * 22) % 120,
      delay: i * 200,
    }));
  }, []);

  useEffect(() => {
    floatAnimsRef.current.forEach((anim, i) => {
      const loopFloat = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -12, duration: 2200 + i * 200, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(anim, { toValue: 10, duration: 2200 + i * 200, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
        ])
      );
      loopFloat.start();
    });

    spinAnimsRef.current.forEach((anim, i) => {
      Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: 4000 + i * 400, easing: Easing.linear, useNativeDriver: false })
      ).start();
    });

    return () => {
      floatAnimsRef.current.forEach((a) => a.stopAnimation());
      spinAnimsRef.current.forEach((a) => a.stopAnimation());
    };
  }, []);

  // Polling refs (numbers in browser/react-native-web)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // helper to clear poll
  const clearPollInterval = () => {
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current as unknown as number);
      pollIntervalRef.current = null;
    }
  };

  const clearMessageInterval = () => {
    if (messageIntervalRef.current !== null) {
      clearInterval(messageIntervalRef.current as unknown as number);
      messageIntervalRef.current = null;
    }
  };

  const startPolling = (jobIdParam: string) => {
    clearPollInterval();

    pollIntervalRef.current = setInterval(async () => {
      try {
        const status = await api.checkScrapeStatus(jobIdParam);
        setStep((prev) => (prev + 1) % messages.length);

        const state = status?.state ?? status?.status ?? "unknown";

        if (state === "completed") {
          clearPollInterval();
          clearMessageInterval();

          const raw = status.result ?? status.raw ?? status.rawResult ?? status.rawData ?? status;

          const lowest =
            status.lowestPriceProduct ??
            raw?.lowestPriceProduct ??
            null;

          // Normalizer
          const normalize = (item: any) => ({
            name: item?.name || item?.title || "",
            image: item?.image || item?.img || "",
            price: item?.price ?? item?.finalPrice ?? item?.displayPrice ?? "",
            quantity: item?.quantity ?? item?.qty ?? "",
            platform: item?.platform ? normalizePlatform(item.platform) : item?.platform ?? "",
            url: item?.url,
            pincode: item?.pincode,
          });

          // FIX: read sortedResults instead of sorted
          const sortedFromBackend =
            status.sortedResults ??
            raw?.sortedResults ??
            status.sorted ??
            raw?.sorted ??
            null;

          if (Array.isArray(sortedFromBackend) && sortedFromBackend.length > 0) {
            setResults(sortedFromBackend.map(normalize));
          } else {
            const aggregated = [
              ...(raw?.blinkit ?? []),
              ...(raw?.zepto ?? []),
              ...(raw?.swiggy ?? []),
            ].map(normalize);

            setResults(aggregated);
          }


          /** ----------------------------
           * ⭐ Compute Best Price Banner
           * ---------------------------- */
          if (lowest) {
            const normalizeNum = (val: any) =>
              parseFloat(String(val).replace("₹", "").trim()) || 0;

            // lowest numeric price
            const lowestPriceNum = normalizeNum(lowest.price);

            // find highest in backend sorted prices
            const sortedList = status.sorted ?? [];
            const highestItem =
              sortedList.length > 0 ? sortedList[sortedList.length - 1] : null;

            const highestPriceNum = highestItem
              ? normalizeNum(highestItem.price)
              : lowestPriceNum;

            const difference = Math.max(0, highestPriceNum - lowestPriceNum);

            setBestPrice({
              name: lowest?.name || "",
              price: `₹${lowestPriceNum}`,    // ⭐ ALWAYS STRING WITH ₹
              image: lowest?.image,
              platform: normalizePlatform(lowest?.platform),
              quantity: lowest?.quantity,
              differenceFromHighest: difference, // ⭐ REQUIRED FIELD
            });
          } else {
            setBestPrice(null);
          }

          setLoading(false);
          setSuccess(true);

          Toast.show({ type: "success", text1: "Scraping Completed!" });

          // ⭐ After showing "Done" for 1 second:
          setTimeout(() => {
            setProduct("");    // Clear search input
            setSuccess(false); // Reset button back to "Compare"
          }, 1000);

          return;

        }

        if (state === "failed") {
          clearPollInterval();
          clearMessageInterval();
          setLoading(false);
          Toast.show({ type: "error", text1: "Scraping Failed" });
          return;
        }

        // still running...

      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 2000);
  };


  const handleCompare = async (selectedProduct?: string) => {
    if (loading) return;

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please login to compare prices.",
        position: "top",
      });
      router.push("../app/auth/login");
      return;
    }

    const searchProduct = (selectedProduct || product || "").trim();
    const searchPincode = (pincode || "").trim();

    if (!searchProduct || !searchPincode) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please enter a product name before comparing.",
        position: "top",
      });
      return;
    }

    // UI reset
    setLoading(true);
    setProduct(searchProduct);
    setResults([]);
    setBestPrice(null);
    setCompareTable([]);
    setStep(0);
    setSuccess(false);

    // start cycling messages
    if (messageIntervalRef.current !== null) {
      clearMessageInterval();
    }
    messageIntervalRef.current = setInterval(() => {
      setStep((prev) => (prev + 1) % messages.length);
    }, 2000);

    try {
      // start job
      const startResp = await api.startScrape(searchPincode, searchProduct);
      const newJobId = startResp?.jobId ?? startResp?.id ?? null;

      if (!newJobId) {
        throw new Error("No jobId returned from server");
      }

      setJobId(newJobId);
      startPolling(newJobId);
    } catch (err) {
      console.error("COMPARE ERROR:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to start scraping.",
        position: "top",
      });
      setLoading(false);
      clearMessageInterval();
    } finally {
      // if job didn't start, clear message interval after short timeout
      setTimeout(() => {
        if (!jobId && messageIntervalRef.current !== null) {
          clearMessageInterval();
        }
      }, 3000);
    }
  };

  // cleanup intervals when component unmounts
  useEffect(() => {
    return () => {
      clearPollInterval();
      clearMessageInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isModalVisible) {
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalVisible]);

  const platformLogos: any = {
    Blinkit: require("../../assets/images/blinkit.png"),
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ ...styles.starContainer, pointerEvents: "none" }}>
        {starLayout.map((s, i) => {
          return (
            <React.Fragment key={i}>
              <Animated.View
                style={[
                  styles.sparkle,
                  { top: 60, left: 40, transform: [{ translateY: floatAnim1 }] },
                ]}
              >
                <Ionicons name="sparkles" size={32} color={colors.primary} style={{ opacity: 0.2 }} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkle,
                  { top: 120, right: 60, transform: [{ translateY: floatAnim2 }] },
                ]}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={36}
                  color={colors.primary}
                  style={{ opacity: 0.25 }}
                />
              </Animated.View>
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Compare <Text style={{ color: "#0CC6E9" }}>Prices.</Text>
          </Text>
          <Text style={[styles.subheading, { color: "#8A6FF0" }]}>Save Smart.</Text>
          <Text style={[styles.desc, { color: colors.secondaryText }]}>Real-time price comparison across all major platforms</Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => setLocationModalVisible(true)} style={[styles.locationBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            {locationInfo.area || locationInfo.city ? (
              <>
                {isManualLocation ? (
                  <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    {locationInfo.pincode ? `Pincode: ${locationInfo.pincode}` : "Tap to set manually"}
                  </Text>
                ) : (
                  <>
                    <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>
                      Home – {locationInfo.area || ""}, {locationInfo.city || ""}
                    </Text>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      {locationInfo.pincode ? `Pincode: ${locationInfo.pincode}` : "Tap to set manually"}
                    </Text>
                  </>
                )}
              </>
            ) : (
              <Text style={{ color: colors.secondaryText, fontSize: 14 }}>Tap to detect or set your location</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={18} color={colors.secondaryText} />
        </TouchableOpacity>

        <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.secondaryText} style={styles.icon} />
          <TextInput placeholder="Search for product" placeholderTextColor={colors.secondaryText} value={product} onChangeText={(text) => {
            setProduct(text);

            // ⭐ Reset button state if user edits search after scrape
            if (success) setSuccess(false);
          }} style={[styles.input, { color: colors.text }]} />
        </View>

        <TouchableOpacity onPress={() => handleCompare()} activeOpacity={0.8} disabled={loading || success}>
          <View style={[styles.buttonWrapper, loading && { opacity: 0.8 }]}>
            <LinearGradient colors={loading ? [colors.border, colors.border] : [colors.primary, "#0cc6e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 8 }]}>{messages[step].title}</Text>
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
              <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerTranslate }] }]}>
                <LinearGradient colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shimmerGradient} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Categories</Text>
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[styles.catCard, { backgroundColor: colors.card }]}
              onPress={async () => {
                if (loading) return;

                let detectedPin = await getCurrentLocation(false);
                if (!detectedPin) detectedPin = await getCurrentLocation(true);
                if (!detectedPin) return;

                handleCompare(cat.name);
              }}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Results</Text>

        {bestPrice && <BestPriceBanner bestPrice={bestPrice} colors={colors} />}

        {loading && (
          <View style={{ alignItems: "center", marginVertical: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.primary }}>{messages[step].icon} {messages[step].title}</Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText, marginTop: 6 }}>{messages[step].subtitle}</Text>
          </View>
        )}

        {!loading && results.length === 0 && (
          <Text style={{ textAlign: "center", color: colors.secondaryText, marginVertical: 50 }}>No results found. Try searching a product.</Text>
        )}
        <br />
        {!loading && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => (item.name || "item") + (item.platform || "plat") + index}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const Card = () => {
                const [hovered, setHovered] = useState(false);

                return (
                  <Pressable
                    onPress={() => openProductModal(item)}
                    onHoverIn={() => Platform.OS === "web" && setHovered(true)}
                    onHoverOut={() => Platform.OS === "web" && setHovered(false)}
                    style={[
                      styles.cardBox,
                      {
                        backgroundColor: colors.card,
                        borderColor: hovered ? colors.primary : colors.border,
                        transform: [{ scale: hovered ? 1.03 : 1 }],
                        ...(Platform.OS === "web"
                          ? {
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                            boxShadow: hovered
                              ? "0px 6px 18px rgba(0,0,0,0.15)"
                              : "0px 2px 8px rgba(0,0,0,0.06)",
                          }
                          : {}),
                      },
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
                      {item.name || "Unnamed"}
                    </Text>

                    <Text style={[styles.cardPrice, { color: colors.primary }]}>
                      {item.price}
                    </Text>

                    <View
                      style={{
                        alignSelf: "flex-start",
                        backgroundColor: platformColors[item.platform || ""] || "#ccc",
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        marginTop: 8,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                        {item.platform}
                      </Text>
                    </View>
                  </Pressable>
                );
              };

              return <Card />;
            }}



          />
        )}
      </ScrollView>

      {locationModalVisible && (
        <View style={styles.popupBackdrop}>
          <View style={[styles.popupContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Set Location</Text>

            <TouchableOpacity style={[styles.modalOption, { marginTop: 10 }]} onPress={async () => { await getCurrentLocation(true); setIsManualLocation(false); setLocationModalVisible(false); }}>
              <Ionicons name="navigate" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={{ color: colors.text, fontSize: 15 }}>Detect Automatically</Text>
            </TouchableOpacity>

            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background, marginTop: 12 }]}>
              <Ionicons name="pin" size={18} color={colors.secondaryText} style={styles.icon} />
              <TextInput placeholder="Enter Pincode manually" placeholderTextColor={colors.secondaryText} keyboardType="numeric" value={manualPincode} onChangeText={setManualPincode} style={[styles.input, { color: colors.text }]} />
            </View>

            <TouchableOpacity onPress={async () => {
              if (!manualPincode || manualPincode.length !== 6) {
                Toast.show({ type: "error", text1: "Invalid Pincode", text2: "Please enter a valid 6-digit pincode.", position: "top" });
                return;
              }
              const newLoc = { city: "Manual Entry", area: "Custom Area", pincode: manualPincode };
              setLocationInfo(newLoc);
              setPincode(manualPincode);
              setIsManualLocation(true);
              await AsyncStorage.setItem("locationInfo", JSON.stringify(newLoc));
              setLocationModalVisible(false);
              Toast.show({ type: "success", text1: "Location Updated", text2: `Set manually to ${manualPincode}`, position: "top" });
            }} activeOpacity={0.8}>
              <LinearGradient colors={[colors.primary, "#0cc6e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { marginTop: 14 }]}>
                <Text style={styles.buttonText}>Save Location</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLocationModalVisible(false)} style={{ marginTop: 12 }}>
              <Text style={{ color: colors.secondaryText, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeProductModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalBox,
              {
                backgroundColor: colors.card,
                borderColor:
                  platformColors[selectedProduct?.platform || ""] || colors.primary,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={closeProductModal}>
              <Ionicons name="close" size={26} color={colors.text} />
            </TouchableOpacity>

            {selectedProduct?.platform && (
              <Image
                source={platformLogos[selectedProduct.platform]}
                style={styles.platformLogo}
              />
            )}

            <Image
              source={{ uri: selectedProduct?.image }}
              style={styles.modalImage}
            />

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {selectedProduct?.name}
            </Text>

            <Text style={[styles.modalPrice, { color: colors.primary }]}>
              {selectedProduct?.price}
            </Text>

            <Text style={[styles.modalQty, { color: colors.secondaryText }]}>
              {selectedProduct?.quantity || "Unknown quantity"}
            </Text>

            <TouchableOpacity
              style={styles.orderBtn}
              onPress={() => handleOrderNow(selectedProduct!)}
            >
              <Text style={styles.orderBtnText}>Order Now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sparkle: { position: "absolute", zIndex: 0 },
  header: { alignItems: "center", marginTop: 35, marginBottom: 10 },
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
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    backgroundColor: "#fff",
  },

  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#fafafa",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    lineHeight: 18,
    height: 40,   // consistent spacing
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
  },
  popupBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  popupContainer: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
    alignItems: "stretch",
    elevation: 10,
    boxShadow: "0px 4px 6px rgba(0,0,0,0.3)",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  starContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    height: 150,
    overflow: "visible",
    zIndex: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    width: "88%",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    elevation: 12,
    borderWidth: 2.5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
  },
  platformLogo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
    marginBottom: 10,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
    resizeMode: "contain",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 5,
  },
  modalQty: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  orderBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  orderBtnText: {
    color: "#1e9c31ff",
    fontSize: 16,
    fontWeight: "700",
  },
});
