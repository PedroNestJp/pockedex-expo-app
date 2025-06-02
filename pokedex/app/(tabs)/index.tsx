// app/(tabs)/pokemon/index.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../src/theme/styles";
import { SearchBar } from "../../src/components/SearchBar";
import { PokemonCard } from "../../src/components/PokemonCard";
import { usePokemonList } from "../../src/viewmodels/usePokemonList";
import { spacing, colors, typography } from "../../src/theme";
import { NearbyPokemons } from "../../src/components/NearbyPokemons";

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

  const HeaderComponent = (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <SearchBar value={search} onChangeText={setSearch} />
        <NearbyPokemons />
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
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <FlatList
          data={displayData}
          key={"grid-2"}
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
          ListHeaderComponent={HeaderComponent}
          ListEmptyComponent={
            <View style={globalStyles.containerCenter}>
              <Text>Nenhum Pokémon encontrado.</Text>
            </View>
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: 160, // Altura estimada de uma linha com 2 cards (ajustável conforme seu design)
            offset: 160 * index,
            index,
          })}
          renderItem={({ item }) => {
            const isFav = favorites.some((f) => f.id === item.id);
            return (
              <View style={{ flex: 1 }}>
                <Link href={`/pokemon/${item.id}`} asChild>
                  <TouchableOpacity activeOpacity={0.9}>
                    <PokemonCard
                      pokemon={item}
                      isFavorite={isFav}
                      onToggle={toggleFavorite}
                    />
                  </TouchableOpacity>
                </Link>
              </View>
            );
          }}
          onRefresh={refetchAll}
          refreshing={isLoadingAll}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
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
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
  },
});
