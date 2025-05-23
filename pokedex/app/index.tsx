// app/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";

import { globalStyles } from "../src/theme/styles";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { SearchBar } from "../src/components/SearchBar";

const repo = new PokemonRepository();

export default function PokemonListScreen() {
  const [search, setSearch] = useState("");

  // 1) Busca (dispara se houver texto)
  const {
    data: searchResult,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["search", search],
    queryFn: () => repo.getPokemonByNameOrId(search),
    enabled: search.length > 0,
  });

  // 2) Listagem da 1ª geração
  const {
    data: list,
    isLoading: isListLoading,
    isError: isListError,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons", 0],
    queryFn: () => repo.getPokemons(0, 20),
  });

  // 3) Composições de estado
  const isLoading = isListLoading || isSearching;
  const isError =
    (isListError && search.length === 0) ||
    (isSearchError && search.length > 0);

  // 4) Dados a exibir
  const pokemonsToShow =
    search.length > 0 ? (searchResult ? [searchResult] : []) : list ?? [];

  return (
    <SafeAreaView style={styles.container}>
      {/*  Sempre visível */}
      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : isError ? (
          <Text>Erro ao carregar Pokémons.</Text>
        ) : pokemonsToShow.length === 0 && search.length > 0 ? (
          <Text>Nenhum Pokémon encontrado.</Text>
        ) : (
          <FlatList
            data={pokemonsToShow}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Link href={`/${item.id}`}>
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </Link>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  list: {
    paddingVertical: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  image: {
    width: 56,
    height: 56,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
