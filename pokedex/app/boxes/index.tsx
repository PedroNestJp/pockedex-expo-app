// src/app/boxes/index.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { PokemonRepository } from "../../src/data/repositories/PokemonRepository";
import { globalStyles } from "../../src/theme/styles";

const repo = new PokemonRepository();

export default function BoxesScreen() {
  const {
    data: types = [],
    isLoading,
    isError,
  } = useQuery<string[], Error>({
    queryKey: ["types"],
    queryFn: () => repo.getTypes(),
  });

  if (isLoading)
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Carregando tipos…</Text>
      </View>
    );
  if (isError)
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar tipos.</Text>
      </View>
    );

  return (
    <FlatList
      data={types}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Link href={`/boxes/${item}`} asChild>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.boxText}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  box: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#EEE",
    borderRadius: 6,
  },
  boxText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
