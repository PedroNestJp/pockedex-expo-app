// app/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
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

  // Busca por nome ou número
  const {
    data: searched,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["search", search],
    queryFn: () => repo.getPokemonByNameOrId(search),
    enabled: !!search,
  });

  // Listagem completa
  const {
    data: allPokemons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons"],
    queryFn: () => repo.getPokemons(0, 20),
  });

  // loading / error iniciais
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

  // dado a exibir: busca ou lista completa
  const displayData = search ? (searched ? [searched] : []) : allPokemons;

  return (
    <View style={styles.screen}>
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
        <View style={styles.searchFeedback}>
          <Text style={styles.searchErrorText}>Pokémon não encontrado</Text>
        </View>
      )}

      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["pokemons"] })
        }
        refreshing={isLoadingAll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 16,
  },
  favLink: {
    padding: 12,
    backgroundColor: "#EEE",
    textAlign: "center",
    marginHorizontal: 16,
    borderRadius: 8,
  },
  searchFeedback: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  searchText: {
    marginLeft: 8,
  },
  searchErrorText: {
    color: "#b00020",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
