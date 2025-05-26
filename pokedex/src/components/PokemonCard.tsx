import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Pokemon } from "../domain/models/Pokemon";
import { Link } from "expo-router";

import { colors, spacing, typography } from "../theme";

interface Props {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggle: (p: Pokemon) => void;
}

export function PokemonCard({ pokemon, isFavorite, onToggle }: Props) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <View style={styles.card}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{pokemon.name}</Text>
        <TouchableOpacity onPress={() => onToggle(pokemon)} style={styles.icon}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? colors.favorite : colors.primary}
          />
        </TouchableOpacity>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  image: {
    width: 56,
    height: 56,
    marginRight: spacing.md,
  },
  name: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    textTransform: "capitalize",
    color: colors.text,
  },
  icon: {
    padding: spacing.sm,
  },
});
