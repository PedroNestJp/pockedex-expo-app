import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PokemonRepository } from "../src/data/repositories/PokemonRepository";
import { globalStyles } from "../src/theme/styles";
import { PCBoxRepository } from "../src/data/repositories/PCBoxRepository";
import type { PokemonDetails } from "../src/domain/models/PokemonDetails";
import { spacing, typography } from "../src/theme";

const repo = new PokemonRepository();
const boxRepo = new PCBoxRepository();

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<PokemonDetails>({
    queryKey: ["pokemon", id],
    queryFn: () => repo.getPokemonById(Number(id)),
    enabled: !!id,
  });

  const { data: boxes = [] } = useQuery({
    queryKey: ["pcBoxes"],
    queryFn: () => boxRepo.getBoxes(),
  });

  const boxesWithPokemon = boxes?.filter((box) =>
    box.pokemons.includes(data?.id ?? -1)
  );

  async function handleAddToBox() {
    try {
      if (boxes.length === 0) {
        Alert.alert("Você ainda não criou nenhuma box.");
        return;
      }

      Alert.alert(
        "Adicionar à Box",
        "Escolha uma box:",
        boxes.map((box) => ({
          text: box.name,
          onPress: async () => {
            await boxRepo.togglePokemon(box.id, data!.id);
            Alert.alert(
              "Sucesso",
              `Pokémon ${data!.name} foi atualizado na box "${box.name}"`
            );
          },
        }))
      );
    } catch (error) {
      console.error("Erro ao adicionar à box:", error);
      Alert.alert("Erro", "Falha ao adicionar Pokémon à box.");
    }
  }

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

      <View style={{ marginTop: spacing.lg }}>
        <Button title="Adicionar à Box" onPress={handleAddToBox} />
        {boxesWithPokemon && boxesWithPokemon.length > 0 && (
          <View style={{ marginTop: spacing.md }}>
            <Text style={{ fontWeight: typography.fontWeight.medium }}>
              Este Pokémon está em:
            </Text>
            {boxesWithPokemon.map((box) => (
              <Text key={box.id} style={{ marginLeft: spacing.sm }}>
                • {box.name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: spacing.md,
  },
});
