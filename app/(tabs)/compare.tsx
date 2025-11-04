// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams } from "expo-router";
// import { scrapePlatform } from "../../src/api/scrape"; // ✅ adjust path

// const platformStyles: Record<string, { color: string; logo: string }> = {
//   Blinkit: {
//     color: "#FFC107",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Blinkit_Logo.png",
//   },
//   Zepto: {
//     color: "#9C27B0",
//     logo: "https://seeklogo.com/images/Z/zepto-logo-8B422D8E3A-seeklogo.com.png",
//   },
//   Swiggy: {
//     color: "#FF5722",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
//   },
//   Flipkart: {
//     color: "#2196F3",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Flipkart_logo.png",
//   },
// };

// type ProductItem = {
//   id?: string;
//   title?: string;
//   name?: string;
//   price: string;
//   quantity?: string;
//   image?: string;
//   platform: string;
// };

// function extractPrice(text: string): string {
//   const match = text.match(/₹\s*\d+/);
//   return match ? match[0] : "N/A";
// }

// const platforms = [
//   { name: "Blinkit", color: "#FFC107" },
//   { name: "Zepto", color: "#9C27B0" },
//   { name: "Swiggy", color: "#FF5722" },
//   { name: "Flipkart", color: "#2196F3" },
// ];

// export default function CompareScreen() {
//   const { product: initialProduct, pincode: initialPincode } = useLocalSearchParams();

//   const [product, setProduct] = useState(
//     Array.isArray(initialProduct) ? initialProduct[0] : initialProduct || ""
//   );
//   const [pincode, setPincode] = useState(
//     Array.isArray(initialPincode) ? initialPincode[0] : initialPincode || ""
//   );
//   const [results, setResults] = useState<ProductItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleCompare = async () => {
//     if (!product || !pincode) {
//       Alert.alert("Missing Info", "Please enter both product and pincode.");
//       return;
//     }

//     setLoading(true);
//     setResults([]);

//     try {
//       const response = await scrapePlatform("all", pincode, product);
//       const data = response?.data || {};

//       const combined: ProductItem[] = [
//         ...(data.blinkit || []).map((item: any) => ({
//           ...item,
//           price: extractPrice(item.price),
//           platform: "Blinkit",
//         })),
//         ...(data.zepto || []).map((item: any) => ({
//           ...item,
//           price: extractPrice(item.price),
//           platform: "Zepto",
//         })),
//         ...(data.swiggy || []).map((item: any) => ({
//           ...item,
//           price: extractPrice(item.price),
//           platform: "Swiggy",
//         })),
//         ...(data.flipkart || []).map((item: any) => ({
//           ...item,
//           price: extractPrice(item.price),
//           platform: "Flipkart",
//         })),
//       ];
//       // Sort results by platform order: Blinkit → Zepto → Swiggy → Flipkart
//       const platformOrder = ["Blinkit", "Zepto", "Swiggy", "Flipkart"];

//       combined.sort((a, b) => {
//         return platformOrder.indexOf(a.platform) - platformOrder.indexOf(b.platform);
//       });

//       setResults(combined);


//       setResults(combined);
//     } catch (err: any) {
//       console.error("❌ API Error:", err.message);
//       Alert.alert("Error", "Failed to fetch comparison data. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.header}>
//         <Text style={styles.heading}>
//           Compare <Text style={styles.gradientText}>Prices</Text>
//         </Text>
//         <Text style={styles.subheading}>Across Top Platforms</Text>
//       </View>

//       <View style={styles.card}>
//         <View style={styles.inputContainer}>
//           <Ionicons name="search" size={20} color="#999" style={styles.icon} />
//           <TextInput
//             placeholder="Search for product"
//             value={product}
//             onChangeText={setProduct}
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="location" size={20} color="#999" style={styles.icon} />
//           <TextInput
//             placeholder="Pincode"
//             keyboardType="numeric"
//             value={pincode}
//             onChangeText={setPincode}
//             style={styles.input}
//           />
//         </View>

//         <TouchableOpacity onPress={handleCompare} activeOpacity={0.8}>
//           <LinearGradient
//             colors={["#0871da", "#0cc6e9"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.button}
//           >
//             <Text style={styles.buttonText}>Compare</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.platformGrid}>
//         {platforms.map((p, i) => (
//           <View key={i} style={[styles.platformCard, { backgroundColor: p.color }]}>
//             <Text style={styles.platformName}>{p.name}</Text>
//           </View>
//         ))}
//       </View>

//       <Text style={styles.sectionTitle}>Results</Text>

//       {loading && <ActivityIndicator size="large" color="#0871da" style={{ marginVertical: 20 }} />}

//       {!loading && results.length === 0 && (
//         <Text style={{ textAlign: "center", color: "#777", marginVertical: 20 }}>
//           No results found. Try searching a product.
//         </Text>
//       )}

//       {["Blinkit", "Zepto", "Swiggy", "Flipkart"].map((platform) => {
//         const platformItems = results.filter((r) => r.platform === platform);
//         if (platformItems.length === 0) return null;

//         const style = platformStyles[platform];

//         return (
//           <View key={platform}>
//             <Text style={[styles.platformHeader, { color: style.color }]}>
//               {platform}
//             </Text>
//             <FlatList
//               data={platformItems}
//               keyExtractor={(_, i) => `${platform}-${i}`}
//               numColumns={2}
//               columnWrapperStyle={{ justifyContent: "space-between" }}
//               scrollEnabled={false}
//               renderItem={({ item }) => (
//                 <View style={[styles.cardBox, { borderColor: style.color }]}>
//                   <Image
//                     source={{
//                       uri:
//                         item.image ||
//                         "https://cdn-icons-png.flaticon.com/512/7185/7185640.png",
//                     }}
//                     style={styles.cardImage}
//                   />
//                   <Text numberOfLines={2} style={styles.cardTitle}>
//                     {item.title || item.name}
//                   </Text>
//                   <Text style={styles.cardPrice}>{item.price}</Text>
//                   <View
//                     style={[styles.platformBadge, { backgroundColor: style.color }]}
//                   >
//                     <Image source={{ uri: style.logo }} style={styles.platformLogo} />
//                     <Text style={styles.platformText}>{item.platform}</Text>
//                   </View>
//                 </View>
//               )}
//             />
//           </View>
//         );
//       })}


//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fcff", padding: 16 },
//   header: { alignItems: "center", marginTop: 10 },
//   heading: { fontSize: 26, fontWeight: "800", color: "#111" },
//   gradientText: { color: "#0871da" },
//   subheading: { fontSize: 20, fontWeight: "600", color: "#6C63FF" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 16,
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 12,
//     marginBottom: 12,
//     paddingHorizontal: 10,
//     backgroundColor: "#f8f9fb",
//   },
//   icon: { marginRight: 8 },
//   input: { flex: 1, height: 45, fontSize: 15 },
//   button: {
//     borderRadius: 50,
//     paddingVertical: 14,
//     alignItems: "center",
//     marginTop: 6,
//   },
//   buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
//   platformGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginTop: 20,
//   },
//   platformCard: {
//     width: "47%",
//     borderRadius: 16,
//     paddingVertical: 20,
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   platformName: { color: "#fff", fontWeight: "700", fontSize: 16 },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginVertical: 14,
//     marginLeft: 4,
//     color: "#111",
//   },
//   resultCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 10,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   productImage: { width: 70, height: 70, borderRadius: 10 },
//   info: { marginLeft: 12, flex: 1 },
//   productName: { fontSize: 16, fontWeight: "600", color: "#222" },
//   price: { fontSize: 18, fontWeight: "700", color: "#0871da", marginTop: 4 },
//   platformTag: { fontSize: 13, color: "#777", marginTop: 4 },

//   platformBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     marginTop: 6,
//   },
//   platformLogo: {
//     width: 16,
//     height: 16,
//     marginRight: 6,
//     borderRadius: 3,
//     backgroundColor: "#fff",
//   },
//   platformText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   cardWrapper: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     borderWidth: 1.2,
//     marginBottom: 16,
//     padding: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   cardBody: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   cardImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//   },
//   cardInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//   },
//   cardPrice: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0871da",
//     marginTop: 6,
//   },
//   cardBox: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     borderWidth: 1.2,
//     borderColor: "#ddd",
//     width: "48%", // 👈 fits 2 cards per row
//     marginBottom: 14,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 5,
//     elevation: 3,
//   },
// platformHeader: {
//   fontSize: 18,
//   fontWeight: "700",
//   marginTop: 16,
//   marginBottom: 8,
// },

// });
