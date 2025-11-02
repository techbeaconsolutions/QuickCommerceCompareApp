import React from "react";
import { StyleSheet, Image } from "react-native";
import { Card, Text } from "react-native-paper";
import { Product } from "../types/product";

interface Props {
  item: Product;
}

export default function ResultCard({ item }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>{item.name}</Text>
        <Text>Platform: {item.platform}</Text>
        <Text>Price: ₹{item.price}</Text>
        {item.quantity && <Text>Quantity: {item.quantity}</Text>}
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 8, elevation: 2 },
  title: { fontWeight: "bold" },
  image: { width: "100%", height: 150, marginTop: 8 },
});
