import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useFavoritePokemons } from "../../src/viewmodels/useFavoritePokemons";
import { globalStyles } from "../../src/theme/styles";
import { PokemonCard } from "../../src/components/PokemonCard";
import { spacing, typography, colors } from "../../src/theme";

export default function FavoritesScreen() {
  const { isLoading, isError, groupedFavorites } = useFavoritePokemons();

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

  if (groupedFavorites.length === 0) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Você não tem favoritos ainda.</Text>
      </View>
    );
  }

  const allFavorites = groupedFavorites.flatMap((group) =>
    group.data.map((pokemon) => ({ ...pokemon, section: group.title }))
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={allFavorites}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        key="favorites-grid"
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <PokemonCard pokemon={item} isFavorite onToggle={() => {}} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Pokémons Favoritos</Text>
          </View>
        )}
        columnWrapperStyle={{
          gap: spacing.md,
          marginBottom: spacing.md,
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
  },
});
