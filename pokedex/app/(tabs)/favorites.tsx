import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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

  return (
    <View style={styles.root}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Pokémons Favoritos</Text>
      </View>

      {groupedFavorites.map((section) => (
        <View key={section.title} style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>

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
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.lg,
  },
  pageHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
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
