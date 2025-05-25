// app/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";

import { globalStyles } from "../src/theme/styles";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { PokemonCard } from "../src/components/PokemonCard";
import { SearchBar } from "../src/components/SearchBar";
import { useNearbyPokemons } from "../src/hooks/useNearbyPokemons";

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
    enabled: search.length > 0,
  });

  // Listagem completa
  const {
    data: allPokemons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons", 0],
    queryFn: () => repo.getPokemons(0, 151),
  });

  // Pokémons por perto via hook customizado
  const {
    pokemons: nearby,
    isFetching: isFetchingNearby,
    isError: isErrorNearby,
    refetch: refetchNearby,
  } = useNearbyPokemons(3);

  // Estados iniciais de loading/erro
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

  // Dados a exibir: busca ou lista principal
  const displayData =
    search.length > 0 ? (searched ? [searched] : []) : allPokemons;

  return (
    <View style={styles.screen}>
      <SearchBar value={search} onChangeText={setSearch} />
      <Link href="/favorites" style={styles.favLink}>
        <Text>Ver Favoritos</Text>
      </Link>

      <View style={styles.nearbySection}>
        <Text style={styles.sectionTitle}>Pokémons por perto</Text>
        {isFetchingNearby && <ActivityIndicator style={styles.nearbyLoader} />}
        {isErrorNearby && (
          <View style={styles.nearbyErrorContainer}>
            <Text style={styles.nearbyErrorText}>
              Erro ao carregar pokémons por perto
            </Text>
            <Text onPress={() => refetchNearby()} style={styles.retryText}>
              Tentar novamente
            </Text>
          </View>
        )}
        {!isFetchingNearby && !isErrorNearby && (
          <FlatList
            horizontal
            data={nearby}
            keyExtractor={(p) => p.id.toString()}
            renderItem={({ item }) => (
              <PokemonCard
                pokemon={item}
                isFavorite={favorites.some((f) => f.id === item.id)}
                onToggle={toggleMutation.mutate}
              />
            )}
            showsHorizontalScrollIndicator={false}
            onRefresh={refetchNearby}
            refreshing={isFetchingNearby}
          />
        )}
      </View>

      {isSearching && (
        <View style={styles.searchFeedback}>
          <ActivityIndicator size="small" />
          <Text style={styles.searchText}>Buscando...</Text>
        </View>
      )}
      {isSearchError && search.length > 0 && (
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
          queryClient.invalidateQueries({ queryKey: ["pokemons", 0] })
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
  nearbySection: {
    marginVertical: 16,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  nearbyLoader: {
    marginVertical: 8,
  },
  nearbyErrorContainer: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FDECEA",
    marginBottom: 8,
  },
  nearbyErrorText: {
    color: "#b00020",
    marginBottom: 4,
  },
  retryText: {
    color: "#007AFF",
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
