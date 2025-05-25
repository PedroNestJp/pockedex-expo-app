// app/index.tsx
import React, { useState, useEffect, useRef } from "react";
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
import { PokemonService } from "../src/services/PokemonService";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { FavoriteRepository } from "../src/data/repositories/FavoriteRepository";
import { PokemonCard } from "../src/components/PokemonCard";
import { SearchBar } from "../src/components/SearchBar";
import { useNotifications } from "../src/context/NotificationsContext";

const mainRepo = new PokemonRepository();
const service = new PokemonService();
const favRepo = new FavoriteRepository();

export default function PokemonListScreen() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { notifyNearby } = useNotifications();
  const hasNotifiedRef = useRef(false);

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
    queryFn: () => mainRepo.getPokemonByNameOrId(search),
    enabled: search.length > 0,
  });

  // Listagem completa
  const {
    data: allPokemons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons", 0],
    queryFn: () => mainRepo.getPokemons(0, 151),
  });

  // Pokémons por perto
  const {
    data: nearby = [],
    isFetching: isFetchingNearby,
    isError: isErrorNearby,
  } = useQuery<Pokemon[], Error, Pokemon[]>({
    queryKey: ["nearby"],
    queryFn: () => service.getRandomPokemons(3),
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (nearby.length > 0) {
      if (hasNotifiedRef.current) {
        notifyNearby(nearby.map((p) => p.name));
      } else {
        hasNotifiedRef.current = true;
      }
    }
  }, [nearby, notifyNearby]);

  // Estados de loading/erro iniciais
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
          <Text style={styles.nearbyError}>
            Não foi possível carregar os Pokémons por perto.
          </Text>
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
  nearbyError: {
    color: "#b00020",
    textAlign: "center",
    marginVertical: 8,
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
