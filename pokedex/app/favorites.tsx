// app/favorites.tsx
import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import { globalStyles } from "../src/theme/styles";
import { PokemonCard } from "../src/components/PokemonCard";
import type { Pokemon } from "../src/domain/models/Pokemon";

const favRepo = new FavoriteRepository();

export default function FavoritesScreen() {
  const {
    data: favorites = [],
    isLoading,
    isError,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["favorites"],
    queryFn: () => favRepo.getFavorites(),
  });

  if (isLoading) {
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar favoritos.</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Você não tem favoritos ainda.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PokemonCard pokemon={item} isFavorite={true} onToggle={() => {}} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
});
