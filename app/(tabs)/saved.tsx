// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "../../context/ThemeContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import { scrapePlatform } from "../../src/api/scrape"; // ✅ Make sure this path is correct

// export default function SavedScreen() {
//   const { colors } = useTheme();
//   const [savedItems, setSavedItems] = useState<any[]>([]);
//   const [loadingId, setLoadingId] = useState<string | null>(null);

//   // 🎨 Brand colors
//   const platformColors: Record<string, string> = {
//     Blinkit: "#FFD84D",
//     Zepto: "#9C1AFF",
//     Swiggy: "#FC8019",
//     Flipkart: "#2874F0",
//   };

//   // 🧠 Load saved items
//   const loadSavedItems = async () => {
//     try {
//       const stored = await AsyncStorage.getItem("savedProducts");
//       setSavedItems(stored ? JSON.parse(stored) : []);
//     } catch (error) {
//       console.error("Error loading saved items:", error);
//     }
//   };

//   // 🔄 Reload when tab focused
//   useFocusEffect(
//     React.useCallback(() => {
//       loadSavedItems();
//     }, [])
//   );

//   // 🗑️ Remove item
//   const removeItem = async (id: string) => {
//     Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Remove",
//         style: "destructive",
//         onPress: async () => {
//           const updated = savedItems.filter((i) => i.id !== id);
//           setSavedItems(updated);
//           await AsyncStorage.setItem("savedProducts", JSON.stringify(updated));
//         },
//       },
//     ]);
//   };

//   // 💸 Re-Compare prices
// const handleReCompare = async (item: any) => {
//   if (!item.title && !item.name) return;

//   try {
//     setLoadingId(item.id);

//     const productName = item.title || item.name;
//     const pincode = item.pincode || "411014"; // ✅ use saved pincode or fallback

//     const response = await scrapePlatform("all", pincode, productName);
//     const data = response?.data || {};

//     const extractPrice = (text: string): string => {
//       const match = text.match(/₹\s*\d+/);
//       return match ? match[0] : "N/A";
//     };

//     const combined = [
//       ...(data.blinkit || []).map((i: any) => ({
//         ...i,
//         price: extractPrice(i.price),
//         platform: "Blinkit",
//       })),
//       ...(data.zepto || []).map((i: any) => ({
//         ...i,
//         price: extractPrice(i.price),
//         platform: "Zepto",
//       })),
//       ...(data.swiggy || []).map((i: any) => ({
//         ...i,
//         price: extractPrice(i.price),
//         platform: "Swiggy",
//       })),
//       ...(data.flipkart || []).map((i: any) => ({
//         ...i,
//         price: extractPrice(i.price),
//         platform: "Flipkart",
//       })),
//     ];

//     const updatedProduct = combined[0] || item;

//     const updatedList = savedItems.map((p) =>
//       p.id === item.id ? { ...p, ...updatedProduct } : p
//     );

//     setSavedItems(updatedList);
//     await AsyncStorage.setItem("savedProducts", JSON.stringify(updatedList));

//     Alert.alert(
//       "✅ Updated",
//       `${productName} refreshed for pincode ${pincode}.`
//     );
//   } catch (error) {
//     console.error("Re-compare failed:", error);
//     Alert.alert("Error", "Failed to fetch updated prices. Try again.");
//   } finally {
//     setLoadingId(null);
//   }
// };


//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Text style={[styles.heading, { color: colors.text }]}>
//         Saved <Text style={{ color: colors.primary }}>Products</Text>
//       </Text>
//       <Text style={[styles.subtext, { color: colors.secondaryText }]}>
//         Your favorite and recently viewed items
//       </Text>

//       {savedItems.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="heart-outline" size={64} color={colors.secondaryText} />
//           <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
//             No saved products yet
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={savedItems}
//           keyExtractor={(item, index) => item.id || index.toString()}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.card,
//                 {
//                   backgroundColor: colors.card,
//                   shadowColor: colors.border,
//                   borderColor: colors.border,
//                 },
//               ]}
//             >
//               <Image
//                 source={{
//                   uri:
//                     item.image ||
//                     "https://cdn-icons-png.flaticon.com/512/7185/7185640.png",
//                 }}
//                 style={styles.image}
//               />
//               <View style={styles.info}>
//                 <Text numberOfLines={2} style={[styles.name, { color: colors.text }]}>
//                   {item.title || item.name}
//                 </Text>
//                 <Text style={[styles.price, { color: colors.primary }]}>
//                   {item.price}
//                 </Text>

//                 {/* 🟨 Platform Badge */}
//                 <View
//                   style={[
//                     styles.badge,
//                     { backgroundColor: platformColors[item.platform] || "#ccc" },
//                   ]}
//                 >
//                   <Text style={styles.badgeText}>{item.platform}</Text>
//                 </View>

// <Text style={[{ fontSize: 12, color: colors.secondaryText, marginTop: 3 }]}>
//   📍 {item.pincode}
// </Text>

//                 {/* 🔄 Re-Compare button */}
//                 <TouchableOpacity
//                   style={[
//                     styles.recompareBtn,
//                     { borderColor: colors.primary },
//                   ]}
//                   onPress={() => handleReCompare(item)}
//                   disabled={loadingId === item.id}
//                 >
//                   {loadingId === item.id ? (
//                     <ActivityIndicator size="small" color={colors.primary} />
//                   ) : (
//                     <Text style={[styles.recompareText, { color: colors.primary }]}>
//                       Re-Compare
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* 🗑️ Delete */}
//               <TouchableOpacity onPress={() => removeItem(item.id)}>
//                 <Ionicons name="trash-outline" size={22} color="#ff4c4c" />
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   heading: {
//     fontSize: 26,
//     fontWeight: "800",
//     textAlign: "center",
//     marginTop: 30,
//   },
//   subtext: {
//     textAlign: "center",
//     fontSize: 14,
//     marginBottom: 20,
//   },
//   card: {
//     flexDirection: "row",
//     borderRadius: 16,
//     padding: 12,
//     alignItems: "center",
//     marginBottom: 12,
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//     borderWidth: 1,
//   },
//   image: { width: 70, height: 70, borderRadius: 12 },
//   info: { flex: 1, marginLeft: 12 },
//   name: { fontSize: 16, fontWeight: "600" },
//   price: { fontSize: 18, fontWeight: "700", marginTop: 4 },
//   badge: {
//     alignSelf: "flex-start",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     marginTop: 6,
//   },
//   badgeText: { fontSize: 12, fontWeight: "700", color: "#fff" },
//   recompareBtn: {
//     marginTop: 8,
//     borderWidth: 1.2,
//     borderRadius: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     alignSelf: "flex-start",
//   },
//   recompareText: { fontSize: 12, fontWeight: "600" },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//   },
//   emptyText: { fontSize: 16, marginTop: 10 },
// });
