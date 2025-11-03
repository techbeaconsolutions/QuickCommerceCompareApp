import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

// Demo Data (replace this with your API response)
const platforms = [
  { name: "Blinkit", color: "#FFC107" },
  { name: "Zepto", color: "#9C27B0" },
  { name: "Swiggy", color: "#FF5722" },
  { name: "Flipkart", color: "#2196F3" },
];

const demoResults = [
  {
    id: "1",
    name: "Amul Taaza Milk 1L",
    price: "₹66",
    platform: "Blinkit",
    image:
      "https://rukminim2.flixcart.com/image/612/612/kpmy8i80/milk/3/z/q/taaza-toned-milk-packet-amul-original-imag3tzhfxd5afjb.jpeg?q=70",
  },
  {
    id: "2",
    name: "Amul Taaza Milk 1L",
    price: "₹65",
    platform: "Zepto",
    image:
      "https://cdn.zeptonow.com/production///tr:w-400,ar-1050-1050,pr-true,f-auto,q-80/cms/product_variant/637e1477-e54d-4ce5-8d87-503548e4aa01.jpeg",
  },
  {
    id: "3",
    name: "Amul Taaza Milk 1L",
    price: "₹64",
    platform: "Swiggy",
    image:
      "https://www.bigbasket.com/media/uploads/p/l/1200477_3-amul-taaza-homogenised-toned-milk.jpg",
  },
  {
    id: "4",
    name: "Amul Taaza Milk 1L",
    price: "₹66",
    platform: "Flipkart",
    image:
      "https://rukminim2.flixcart.com/image/416/416/kpmy8i80/milk/3/z/q/taaza-toned-milk-packet-amul-original-imag3tzhfxd5afjb.jpeg?q=70",
  },
];

export default function CompareScreen() {
  const { product: initialProduct, pincode: initialPincode } = useLocalSearchParams();

  const [product, setProduct] = useState(
    Array.isArray(initialProduct) ? initialProduct[0] : initialProduct || ""
  );

  const [pincode, setPincode] = useState(
    Array.isArray(initialPincode) ? initialPincode[0] : initialPincode || ""
  );

  const [results, setResults] = useState(demoResults);

  const handleCompare = () => {
    // API call can be triggered here
    console.log("Fetching comparison for:", product, pincode);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.heading}>
          Compare <Text style={styles.gradientText}>Prices</Text>
        </Text>
        <Text style={styles.subheading}>Across Top Platforms</Text>
      </View>

      {/* Search Section */}
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

        <TouchableOpacity onPress={handleCompare} activeOpacity={0.8}>
          <LinearGradient
            colors={["#0871da", "#0cc6e9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Compare</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Platform Buttons */}
      <View style={styles.platformGrid}>
        {platforms.map((p, i) => (
          <View
            key={i}
            style={[styles.platformCard, { backgroundColor: p.color }]}
          >
            <Text style={styles.platformName}>{p.name}</Text>
          </View>
        ))}
      </View>

      {/* Results */}
      <Text style={styles.sectionTitle}>Results</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.info}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.platformTag}>{item.platform}</Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fcff", padding: 16 },
  header: { alignItems: "center", marginTop: 10 },
  heading: { fontSize: 26, fontWeight: "800", color: "#111" },
  gradientText: { color: "#0871da" },
  subheading: { fontSize: 20, fontWeight: "600", color: "#6C63FF" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
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
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  platformGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 20,
  },
  platformCard: {
    width: "47%",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  platformName: { color: "#fff", fontWeight: "700", fontSize: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 14,
    marginLeft: 4,
    color: "#111",
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  productImage: { width: 70, height: 70, borderRadius: 10 },
  info: { marginLeft: 12, flex: 1 },
  productName: { fontSize: 16, fontWeight: "600", color: "#222" },
  price: { fontSize: 18, fontWeight: "700", color: "#0871da", marginTop: 4 },
  platformTag: { fontSize: 13, color: "#777", marginTop: 4 },
});
