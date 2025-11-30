// components/BestPriceBanner.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function BestPriceBanner({ bestPrice, colors }: any) {
  if (!bestPrice) return null;

  const PLATFORM_LOGO_URLS = {
    Blinkit: "https://assets.grofer.io/app-icon/blinkit.png",
    Zepto: "https://cdn.zeptonow.com/app/zepto-logo.png",
    Swiggy: "https://cdn.swiggy.com/uploads/instamart_xhdpi_2.png",
    Flipkart: "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png",
  };


  const platformLogo = PLATFORM_LOGO_URLS[bestPrice.platform];

  return (
    <LinearGradient
      colors={["#0CC6E9", colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientWrapper}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>

        {/* Product Image */}
        {bestPrice.image && (
          <Image source={{ uri: bestPrice.image }} style={styles.productImage} />
        )}

        {/* Title */}
        <View style={styles.titleRow}>
          <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
          <Text style={[styles.titleText, { color: colors.text }]}>
            Best Deal Found
          </Text>
        </View>

        {/* Price + Platform logo row */}
        <View style={styles.priceRow}>
          <Text style={[styles.priceText, { color: colors.primary }]}>
            ₹{bestPrice.price}
          </Text>

          {platformLogo && (
            <View style={styles.platformChip}>
              <Image
                source={{ uri: platformLogo }}
                style={styles.platformLogo}
              />
              <Text style={styles.platformText}>{bestPrice.platform}</Text>
            </View>
          )}
        </View>

        {/* Savings */}
        <View
          style={[
            styles.savingsContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons name="trending-down" size={16} color="#0CC6E9" />
          <Text style={[styles.savingsText, { color: colors.text }]}>
            Save ₹{bestPrice.differenceFromHighest} compared to highest price
          </Text>
        </View>
      </View>
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
    backgroundColor: "#eef7ff",
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

  platformText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#007aff",
  },

  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  savingsText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});
