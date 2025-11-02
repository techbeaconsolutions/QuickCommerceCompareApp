// app/index.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [product, setProduct] = useState("");
  const [pincode, setPincode] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleCompare = () => {
    if (!product || !pincode) return;
    router.push({
      pathname: "/compare",
      params: { product, pincode },
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Quick Commerce Compare" />
        <Card.Content>
          <TextInput
            label="Product Name"
            mode="outlined"
            value={product}
            onChangeText={setProduct}
            style={styles.input}
          />
          <TextInput
            label="Pincode"
            mode="outlined"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleCompare}
            style={styles.button}
            buttonColor={theme.colors.primary}
          >
            Compare Prices
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { padding: 10 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});
