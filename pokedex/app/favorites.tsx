import React from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFavoritePokemons } from "../src/viewmodels/useFavoritePokemons";
import { globalStyles } from "../src/theme/styles";
import { PokemonCard } from "../src/components/PokemonCard";
import { spacing, typography, colors } from "../src/theme";

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
    <View style={{ flex: 1, paddingVertical: spacing.xl }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pokémons Favoritos</Text>
      </View>

      <SectionList
        sections={groupedFavorites}
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  headerText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  list: {
    paddingBottom: spacing.lg,
  },
});
