import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { globalStyles } from "../src/theme/styles";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { Link } from "expo-router";
import { SearchBar } from "../src/components/SearchBar";
import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import { PokemonCard } from "../src/components/PokemonCard";

const repo = new PokemonRepository();
const favRepo = new FavoriteRepository();

export default function PokemonListScreen() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient(); // Movido para dentro do componente

  const { data: favorites = [] } = useQuery<Pokemon[]>({
    queryKey: ["favorites"], // Usar objeto para consistência
    queryFn: () => favRepo.getFavorites(),
  });

  const toggleMutation = useMutation({
    mutationFn: (p: Pokemon) => favRepo.toggleFavorite(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }), // Usar objeto
  });

  const {
    data: searched,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery<Pokemon | undefined>({
    queryKey: ["search", search],
    queryFn: () => repo.getPokemonByNameOrId(search),
    enabled: search.length > 0,
  });

  const { data, isLoading, isError } = useQuery<Pokemon[]>({
    queryKey: ["pokemons", 0],
    queryFn: () => repo.getPokemons(0, 151),
  });

  if (isLoading) {
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar Pokémons.</Text>
      </View>
    );
  }

  // Determinar quais dados mostrar: resultado da busca ou lista principal
  const displayData = search.length > 0 && searched ? [searched] : data;

  return (
    <View style={{ flex: 1, paddingVertical: 32 }}>
      <SearchBar value={search} onChangeText={setSearch} />
      <Link href="/favorites" style={styles.link}>
        <Text>Ver Favoritos</Text>
      </Link>

      {/* Mostrar loading da busca quando apropriado */}
      {isSearching && (
        <View style={styles.searchLoading}>
          <ActivityIndicator size="small" />
          <Text>Buscando...</Text>
        </View>
      )}

      {/* Mostrar erro de busca quando apropriado */}
      {isSearchError && search.length > 0 && (
        <View style={styles.searchError}>
          <Text>Pokémon não encontrado</Text>
        </View>
      )}

      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isFav = favorites.some((p) => p.id === item.id);
          return (
            <PokemonCard
              pokemon={item}
              isFavorite={isFav}
              onToggle={toggleMutation.mutate}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  link: {
    padding: 12,
    textAlign: "center",
    backgroundColor: "#EEE",
  },
  searchLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  searchError: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFE6E6",
  },
  // Removidos estilos não utilizados (card, image, name)
});
