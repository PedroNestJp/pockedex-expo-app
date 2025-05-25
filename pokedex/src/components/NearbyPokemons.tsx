import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useNearbyPokemons } from "../hooks/useNearbyPokemons";
import { PokemonCard } from "./PokemonCard";

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
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              isFavorite={false}
              onToggle={() => {}}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Nenhum Pokémon por perto.</Text>
            </View>
          }
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
    padding: 12,
  },
});
