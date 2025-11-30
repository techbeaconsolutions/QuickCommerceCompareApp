// components/ComparisonTable.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ComparisonTable({ table, colors }: any) {
  if (!table || table.length === 0) return null;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Price Comparison</Text>

      {table.map((row: any, i: number) => (
        <View key={i} style={styles.row}>
          <Text style={[styles.platform, { color: colors.text }]}>{row.platform}</Text>

          <Text style={[styles.price, { color: colors.primary }]}>₹{row.price}</Text>

          {row.differenceFromLowest === 0 ? (
            <Text style={[styles.best, { color: "#20C997" }]}>Best</Text>
          ) : (
            <Text style={[styles.diff, { color: colors.secondaryText }]}>
              +₹{row.differenceFromLowest}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  platform: {
    fontSize: 14,
    fontWeight: "600",
    width: "33%",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    width: "33%",
    textAlign: "center",
  },
  best: {
    fontSize: 14,
    fontWeight: "800",
    width: "33%",
    textAlign: "right",
  },
  diff: {
    fontSize: 13,
    width: "33%",
    textAlign: "right",
  },
});
