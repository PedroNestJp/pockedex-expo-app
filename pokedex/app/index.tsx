import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../src/theme/styles";
import { SearchBar } from "../src/components/SearchBar";
import { PokemonCard } from "../src/components/PokemonCard";
import { usePokemonList } from "../src/viewmodels/usePokemonList";
import { spacing, colors } from "../src/theme";

export default function PokemonListScreen() {
  const {
    search,
    setSearch,
    displayData,
    isLoadingAll,
    isErrorAll,
    isSearching,
    isSearchError,
    favorites,
    toggleFavorite,
    refetchAll,
  } = usePokemonList();

  if (isLoadingAll) {
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isErrorAll || !displayData) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar Pokémons.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <SearchBar value={search} onChangeText={setSearch} />
            <Link href="/favorites" style={styles.favLink}>
              <Text>Ver Favoritos</Text>
            </Link>
            {isSearching && (
              <View style={styles.searchFeedback}>
                <ActivityIndicator size="small" />
                <Text style={styles.searchText}>Buscando...</Text>
              </View>
            )}
            {isSearchError && search && (
              <Text style={styles.searchErrorText}>Pokémon não encontrado</Text>
            )}
          </View>
        )}
        renderItem={({ item }) => {
          const isFav = favorites.some((f) => f.id === item.id);
          return (
            <PokemonCard
              pokemon={item}
              isFavorite={isFav}
              onToggle={toggleFavorite}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        onRefresh={refetchAll}
        refreshing={isLoadingAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  favLink: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    textAlign: "center",
  },
  searchFeedback: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  searchText: { marginLeft: spacing.sm },
  searchErrorText: {
    marginTop: spacing.xs,
    color: colors.error,
  },
  separator: {
    height: 1,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
