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
import { globalStyles } from "../../src/theme/styles";
import { SearchBar } from "../../src/components/SearchBar";
import { PokemonCard } from "../../src/components/PokemonCard";
import { usePokemonList } from "../../src/viewmodels/usePokemonList";
import { spacing, colors, typography } from "../../src/theme";

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
        key={"grid-2"} // ✅ CORRIGE O ERRO
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        columnWrapperStyle={{ gap: spacing.md, marginBottom: spacing.md }}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.md,
        }}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <SearchBar value={search} onChangeText={setSearch} />
            <View style={styles.linksWrapper}>
              <Link href="/favorites" style={styles.linkBox}>
                <Text style={styles.linkText}>Ver Favoritos</Text>
              </Link>
              <Link href="/boxes" style={styles.linkBox}>
                <Text style={styles.linkText}>Ver Boxes</Text>
              </Link>
              <Link href="/boxes/create" style={styles.linkBox}>
                <Text style={styles.linkText}>Criar Nova Box</Text>
              </Link>
            </View>
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
            <View style={{ flex: 1 }}>
              <PokemonCard
                pokemon={item}
                isFavorite={isFav}
                onToggle={toggleFavorite}
              />
            </View>
          );
        }}
        onRefresh={refetchAll}
        refreshing={isLoadingAll}
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
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  searchFeedback: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  searchText: {
    marginLeft: spacing.sm,
  },
  searchErrorText: {
    marginTop: spacing.xs,
    color: colors.error,
  },
  linksWrapper: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  linkBox: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  linkText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },
});
