import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SavedScreen() {
  const [savedItems, setSavedItems] = useState([
    {
      id: "1",
      name: "Amul Butter 500g",
      price: "₹285",
      platform: "Blinkit",
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/butter/n/t/j/-original-imagz8xhybfxfyyx.jpeg?q=70",
    },
    {
      id: "2",
      name: "Tata Tea Gold 1kg",
      price: "₹540",
      platform: "Zepto",
      image:
        "https://cdn.zeptonow.com/production///tr:w-400,ar-1050-1050,pr-true,f-auto,q-80/cms/product_variant/9a7e32a3-10a2-4e3b-87ef-00e5ee77e207.jpeg",
    },
    {
      id: "3",
      name: "Dabur Honey 500g",
      price: "₹230",
      platform: "Flipkart",
      image:
        "https://rukminim2.flixcart.com/image/416/416/k7dnonk0/honey/e/5/j/500-honey-squeezy-pack-dabur-original-imafp2hqfxzzfxmn.jpeg?q=70",
    },
  ]);

  const removeItem = (id: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setSavedItems(savedItems.filter((i) => i.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>
        Saved <Text style={styles.gradientText}>Products</Text>
      </Text>
      <Text style={styles.subtext}>Your favorite and recently viewed items</Text>

      {/* List */}
      {savedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No saved products yet</Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.platform}>{item.platform}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#ff4c4c" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fcff",
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },
  gradientText: {
    color: "#0871da",
  },
  subtext: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0871da",
    marginTop: 4,
  },
  platform: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
    marginTop: 10,
  },
});
