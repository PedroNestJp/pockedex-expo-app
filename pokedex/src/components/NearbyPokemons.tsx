// src/components/NearbyPokemons.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";

import type { Pokemon } from "../services/types";
import { PokemonService } from "../services/PokemonService";
import { useNotifications } from "../context/NotificationsContext";
import { PokemonCard } from "./PokemonCard";

const repo = new PokemonService();

export function NearbyPokemons({ count = 3 }: { count?: number }) {
  const { notifyNearby } = useNotifications();
  const hasNotifiedRef = useRef(false);

  const {
    data: pokemons = [],
    isFetching,
    isError,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["nearby"],
    queryFn: () => repo.getRandomPokemons(count),
    refetchInterval: 5 * 60 * 1000, // refetch a cada 5 minutos
    // Handle errors using the isError state
  });

  // só notifica a partir do segundo fetch, evitando duplicação inicial
  useEffect(() => {
    if (pokemons.length > 0) {
      const names = pokemons.map((p) => p.name);
      if (hasNotifiedRef.current) {
        notifyNearby(names);
      } else {
        hasNotifiedRef.current = true;
      }
    }
  }, [pokemons, notifyNearby]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémons por perto</Text>

      {isFetching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {isError && (
        <View style={styles.errorContainer}>
          <Text>
            Erro ao carregar Pokémons por perto. Verifique sua conexão.
          </Text>
        </View>
      )}
      {!isFetching && !isError && (
        <FlatList
          horizontal
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              isFavorite={false}
              onToggle={() => {}}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Nenhum Pokémon por perto.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 12,
  },
  errorContainer: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FDECEA",
  },
  list: {
    paddingHorizontal: 12,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 12,
  },
});
