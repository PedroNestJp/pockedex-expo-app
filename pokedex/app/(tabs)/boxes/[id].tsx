// app/(tabs)/boxes/[id].tsx
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
import { spacing, typography, colors } from "../../../src/theme";

const boxRepo = new PCBoxRepository();
const favRepo = new FavoriteRepository();

export default function PCBoxScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

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

  const grouped = Object.entries(
    pokemonsInBox.reduce((map, p) => {
      p.types.forEach((type) => {
        if (!map[type]) map[type] = [];
        map[type].push(p);
      });
      return map;
    }, {} as Record<string, typeof pokemonsInBox>)
  ).map(([title, data]) => ({ title, data }));

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{box.name}</Text>
        <Text style={styles.subtitle}>Tipos: {box.types.join(", ")}</Text>
      </View>

      {grouped.length === 0 ? (
        <View style={globalStyles.containerCenter}>
          <Text>Nenhum Pokémon nesta Box.</Text>
        </View>
      ) : (
        grouped.map((section) => (
          <View key={section.title} style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>
              {section.title.toUpperCase()}
            </Text>
            <FlatList
              data={section.data}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              key={`grid-${section.title}`}
              renderItem={({ item }) => (
                <View style={{ flex: 1 }}>
                  <PokemonCard pokemon={item} isFavorite onToggle={() => {}} />
                </View>
              )}
              columnWrapperStyle={{
                gap: spacing.md,
                marginBottom: spacing.md,
              }}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.lg,
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              getItemLayout={(_, index) => ({
                length: 160,
                offset: 160 * index,
                index,
              })}
            />
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  },
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
    color: colors.textSecondary,
  },
  sectionWrapper: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
});
