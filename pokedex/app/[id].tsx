// app/[id].tsx
import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import { globalStyles } from "../src/theme/styles";
import type { PokemonDetails } from "../src/domain/models/PokemonDetails";

const repo = new PokemonRepository();
export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery<PokemonDetails>({
    queryKey: ["pokemon", id],
    queryFn: () => repo.getPokemonById(Number(id)),
    // refetchOnWindowFocus: false, // desabilita o refetch quando a tela volta a ter foco
  });
  if (isLoading)
    return (
      <View style={globalStyles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (isError || !data)
    return (
      <View style={globalStyles.containerCenter}>
        <Text>Erro ao carregar detalhes.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: data.sprites.front_default }}
        style={styles.image}
      />
      <Text style={styles.name}>{data.name}</Text>
      <Text>Altura: {data.height}</Text>
      <Text>Peso: {data.weight}</Text>
      <Text>Tipos:</Text>
      {data.types.map((t) => (
        <Text key={t.slot}>• {t.type.name}</Text>
      ))}
      <Text>Stats:</Text>
      {data.stats.map((s) => (
        <Text key={s.stat.name}>
          {s.stat.name}: {s.base_stat}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 12,
  },
});
