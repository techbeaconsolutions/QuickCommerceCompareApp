import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";
import { Platform } from "react-native";
import type { TextStyle } from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Compare Prices Instantly",
    description:
      "Find the best deals across Blinkit, Zepto, Swiggy & Flipkart in one tap.",
    image: require("../../assets/images/onboard_screen_1_1.png"),
  },
  {
    id: 2,
    title: "Shop Smart, Save More",
    description:
      "Track price trends and pick the best time to buy your favorite products.",
    image: require("../../assets/images/onboard_screen_2_2.png"),
  },
  {
    id: 3,
    title: "All Your Platforms, One App",
    description:
      "Simplify your shopping with one unified app experience.",
    image: require("../../assets/images/onboard_screen_3_3.png"),
  },
];

export default function OnboardingScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  /* -----------------------------
     ✅ RELIABLE INDEX TRACKING
  ----------------------------- */
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  /* -----------------------------
     ✅ NAVIGATION LOGIC
  ----------------------------- */
  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      router.replace("/auth/login" as Href);
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace("/auth/login" as Href);
  };

  return (
    <LinearGradient colors={["#0871da", "#0cc6e9"]} style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const imageOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          const textOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: "clamp",
          });

          const textTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: "clamp",
          });

          return (
            <View style={[styles.slide, { width }]}>
              <Animated.Image
                source={item.image}
                resizeMode="contain"
                style={[
                  styles.image,
                  {
                    opacity: imageOpacity,
                    transform: [{ scale: imageScale }],
                  },
                ]}
              />

              <Animated.View
                style={{
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslateY }],
                }}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </Animated.View>
            </View>
          );
        }}
      />

      {/* 🔵 Animated Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, i) => {
          const dotInputRange = [
            (i - 1) * width,
            i * width,
            (i + 1) * width,
          ];

          const dotScale = scrollX.interpolate({
            inputRange: dotInputRange,
            outputRange: [1, 1.6, 1],
            extrapolate: "clamp",
          });

          const dotOpacity = scrollX.interpolate({
            inputRange: dotInputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* 🔘 Buttons (Stable & Always Visible) */}
      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext}>
              <LinearGradient
                colors={["#fff", "#e0f7ff"]}
                style={styles.nextBtn}
              >
                <Text style={styles.nextText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.getStartedBtn}>
            <LinearGradient
              colors={["#fff", "#e0f7ff"]}
              style={styles.nextBtn}
            >
              <Text style={styles.nextText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

/* -----------------------------
   🎨 STYLES
----------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: "85%",
    height: 260,
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,

    ...(Platform.OS === "web"
      ? ({ textShadow: "0px 2px 4px rgba(0,0,0,0.25)" } as TextStyle)
      : {
        textShadowColor: "rgba(0,0,0,0.25)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      }),
  },

  description: {
    fontSize: 15,
    color: "#f1faff",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.95,
    paddingHorizontal: 10,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginBottom: 35,
    alignItems: "center",
  },

  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  skipText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
  },

  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,

    // Android
    elevation: 3,

    // Web / New RN
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 3px 8px rgba(0,0,0,0.15)" }
      : {}),
  },


  nextText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0871da",
  },

  getStartedBtn: {
    width: "100%",
    alignItems: "center",
  },
});
