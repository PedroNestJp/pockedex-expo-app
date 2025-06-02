// src/components/NearbyPokemons.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useNearbyPokemons } from "../hooks/useNearbyPokemons";
import { NearbyPokemonCard } from "./NearbyPokemonCard";

export function NearbyPokemons({ count = 3 }: { count?: number }) {
  const { pokemons, isFetching, isError } = useNearbyPokemons(count);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémons por perto</Text>

      {isFetching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {isError && (
        <View style={styles.errorContainer}>
          <Text>
            Erro ao carregar Pokémons por perto. Verifique sua conexão.
          </Text>
        </View>
      )}

      {!isFetching && !isError && (
        <FlatList
          horizontal
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NearbyPokemonCard pokemon={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 12,
  },
  errorContainer: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FDECEA",
  },
  list: {
    paddingHorizontal: 12,
  },
  emptyContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
