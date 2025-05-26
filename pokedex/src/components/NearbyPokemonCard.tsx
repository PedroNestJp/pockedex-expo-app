import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { Pokemon } from "../domain/models/Pokemon";
import { spacing, typography, colors } from "../theme";

export function NearbyPokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>
        {pokemon.name} #{pokemon.id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF9F2",
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    marginRight: spacing.md,
    elevation: 2,
  },
  image: {
    width: 72,
    height: 72,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: "center",
    color: colors.textPrimary,
    textTransform: "capitalize",
  },
});
