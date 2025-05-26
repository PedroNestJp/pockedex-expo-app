// src/components/PokemonCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Pokemon } from "../domain/models/Pokemon";
import { Link } from "expo-router";

interface Props {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggle: (p: Pokemon) => void;
}

export function PokemonCard({ pokemon, isFavorite, onToggle }: Props) {
  return (
    <Link href={`/${pokemon.id}`}>
      <View style={styles.card}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{pokemon.name}</Text>
        <TouchableOpacity onPress={() => onToggle(pokemon)} style={styles.icon}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="green"
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
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  image: {
    width: 56,
    height: 56,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  icon: { padding: 8 },
});
