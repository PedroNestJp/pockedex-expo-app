import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";

import { globalStyles } from "../src/theme/styles";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { PokemonCard } from "../src/components/PokemonCard";
import { SearchBar } from "../src/components/SearchBar";

const repo = new PokemonRepository();
const favRepo = new FavoriteRepository();

export default function PokemonListScreen() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  // Favoritos
  const { data: favorites = [] } = useQuery<Pokemon[], Error>({
    queryKey: ["favorites"],
    queryFn: () => favRepo.getFavorites(),
  });
  const toggleMutation = useMutation({
    mutationFn: (p: Pokemon) => favRepo.toggleFavorite(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  // Busca
  const {
    data: searched,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["search", search],
    queryFn: () => repo.getPokemonByNameOrId(search),
    enabled: !!search,
  });

  // Listagem principal
  const {
    data: allPokemons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons"],
    queryFn: () => repo.getPokemons(0, 20),
  });

  // Loading inicial
  if (isLoadingAll) {
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isErrorAll || !allPokemons) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar Pokémons.</Text>
      </View>
    );
  }

  // Dados a exibir
  const displayData = search ? (searched ? [searched] : []) : allPokemons;

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        // Cabeçalho rolável com search + favoritos
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
              onToggle={toggleMutation.mutate}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["pokemons"] })
        }
        refreshing={isLoadingAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  favLink: {
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: "#ececec",
    borderRadius: 6,
    textAlign: "center",
  },
  searchFeedback: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  searchText: { marginLeft: 8 },
  searchErrorText: {
    marginTop: 6,
    color: "#b00020",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
});
