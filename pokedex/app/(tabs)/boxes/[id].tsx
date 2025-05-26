// app/[id].tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { PCBoxRepository } from "../../../src/data/repositories/PCBoxRepository";
import { FavoriteRepository } from "../../../src/data/repositories/FavoriteRepository";
import { PokemonCard } from "../../../src/components/PokemonCard";
import { globalStyles } from "../../../src/theme/styles";
import { spacing, typography } from "../../../src/theme";

const boxRepo = new PCBoxRepository();
const favRepo = new FavoriteRepository();

export default function PCBoxScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("ID da Box:", id);
  if (!id) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Box não encontrada.</Text>
      </View>
    );
  }

  const {
    data: box,
    isLoading: isLoadingBox,
    isError: isErrorBox,
  } = useQuery({
    queryKey: ["pcBox", id],
    queryFn: () => boxRepo.getBoxById(id!),
    enabled: !!id,
  });

  const {
    data: favorites = [],
    isLoading: isLoadingFavs,
    isError: isErrorFavs,
  } = useQuery({
    queryKey: ["favoritesWithTypes"],
    queryFn: () => favRepo.getFavoritesWithTypes(),
  });

  if (isLoadingBox || isLoadingFavs) {
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isErrorBox || !box) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar a Box.</Text>
      </View>
    );
  }

  const pokemonsInBox = favorites.filter((p) => box.pokemons.includes(p.id));

  return (
    <View style={{ flex: 1, paddingVertical: spacing.md }}>
      <View style={styles.header}>
        <Text style={styles.title}>{box.name}</Text>
        <Text style={styles.subtitle}>Tipos: {box.types.join(", ")}</Text>
      </View>

      {pokemonsInBox.length === 0 ? (
        <View style={globalStyles.containerCenter}>
          <Text>Nenhum Pokémon nesta Box.</Text>
        </View>
      ) : (
        <FlatList
          data={pokemonsInBox}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} isFavorite={true} onToggle={() => {}} />
          )}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
});
