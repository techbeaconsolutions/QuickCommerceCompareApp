// components/BestPriceBanner.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function BestPriceBanner({
  bestPrice,
  colors,
  onPress, // ✅ NEW
}: any) {
  if (!bestPrice) return null;

  console.log("⭐ BEST PRICE DEBUG →", {
    image: bestPrice.image,
    price: bestPrice.price,
    title: bestPrice.title || bestPrice.name,
    platform: bestPrice.platform,
  });

  const PLATFORM_LOGO_URLS = {
    Blinkit: "https://assets.grofer.io/app-icon/blinkit.png",
    Zepto: "https://cdn.zeptonow.com/app/zepto-logo.png",
    Swiggy: "https://cdn.swiggy.com/uploads/instamart_xhdpi_2.png",
    Flipkart:
      "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png",
  };

  const PLATFORM_COLORS = {
    Blinkit: "#F7D20A",
    Zepto: "#8E3FFC",
    Swiggy: "#FC8019",
    Flipkart: "#2874F0",
  };

  const normalizeImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  };

  const platformLogo = PLATFORM_LOGO_URLS[bestPrice.platform];
  const platformColor =
    PLATFORM_COLORS[bestPrice.platform] || "#333";

  return (
    <LinearGradient
      colors={["#0CC6E9", colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientWrapper}
    >
      <Pressable
        onPress={onPress} // ✅ SAME AS HOME CARD
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        {/* Product Image */}
        {bestPrice.image && (
          <Image
            source={{ uri: normalizeImageUrl(bestPrice.image) }}
            style={styles.productImage}
          />
        )}

        {/* Product Title */}
        <Text
          style={[styles.productTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {bestPrice.title || bestPrice.name}
        </Text>

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={colors.primary}
          />
          <Text
            style={[styles.titleText, { color: colors.text }]}
          >
            Best Deal Found
          </Text>
        </View>

        {/* Price + Platform */}
        <View style={styles.priceRow}>
          <Text
            style={[styles.priceText, { color: colors.primary }]}
          >
            {bestPrice.price}
          </Text>

          {platformLogo && (
            <View
              style={[
                styles.platformChip,
                { backgroundColor: platformColor },
              ]}
            >
              <Image
                source={{ uri: platformLogo }}
                style={styles.platformLogo}
              />
              <Text style={styles.platformChipText}>
                {bestPrice.platform}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 20,
    padding: 2,
    marginTop: 20,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    resizeMode: "contain",
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  priceText: {
    fontSize: 28,
    fontWeight: "800",
  },
  platformChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  platformLogo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 6,
  },
  platformChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
