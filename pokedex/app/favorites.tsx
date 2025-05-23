// app/favorites.tsx
import React from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import { globalStyles } from "../src/theme/styles";
import { PokemonCard } from "../src/components/PokemonCard";
import type { PokemonWithTypes } from "../src/domain/models/PokemonWithTypes";

const favRepo = new FavoriteRepository();

export default function FavoritesScreen() {
  const {
    data: favs,
    isLoading,
    isError,
  } = useQuery<PokemonWithTypes[], Error>({
    queryKey: ["favoritesWithTypes"],
    queryFn: () => favRepo.getFavoritesWithTypes(),
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
  if (!favs || favs.length === 0) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Você não tem favoritos ainda.</Text>
      </View>
    );
  }

  // agrupa por tipo
  const sections = Object.entries(
    favs.reduce((map, p) => {
      p.types.forEach((type) => {
        if (!map[type]) map[type] = [];
        map[type].push(p);
      });
      return map;
    }, {} as Record<string, PokemonWithTypes[]>)
  ).map(([title, data]) => ({ title, data }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.header}>
          <Text style={styles.headerText}>{title.toUpperCase()}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <PokemonCard pokemon={item} isFavorite onToggle={() => {}} />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#EEE",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 16,
  },
});
