import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { globalStyles } from "../src/theme/styles";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import type { Pokemon } from "../src/domain/models/Pokemon";
import { Link } from "expo-router";

const repo = new PokemonRepository();

export default function PokemonListScreen() {
  const { data, isLoading, isError } = useQuery<Pokemon[]>({
    queryKey: ["pokemons", 0],
    queryFn: () => repo.getPokemons(0, 20),
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

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Link href={`/${item.id}`}>
            <Text style={styles.name}>{item.name}</Text>
          </Link>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
