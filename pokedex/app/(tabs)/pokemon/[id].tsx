import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PokemonRepository } from "../../../src/data/repositories/PokemonRepository";
import { PCBoxRepository } from "../../../src/data/repositories/PCBoxRepository";
import type { PokemonDetails } from "../../../src/domain/models/PokemonDetails";
import { spacing, typography, colors } from "../../../src/theme";
import { Ionicons } from "@expo/vector-icons";

const repo = new PokemonRepository();
const boxRepo = new PCBoxRepository();

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<PokemonDetails>({
    queryKey: ["pokemon", id],
    queryFn: () => repo.getPokemonById(Number(id)),
    enabled: !!id,
  });

  const { data: boxes = [] } = useQuery({
    queryKey: ["pcBoxes"],
    queryFn: () => boxRepo.getBoxes(),
  });

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (isError || !data)
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar detalhes.</Text>
      </View>
    );

  function handleAddToBox() {
    if (boxes.length === 0) {
      Alert.alert("Você ainda não criou nenhuma Box.");
      return;
    }

    Alert.alert(
      "Adicionar à Box",
      "Escolha uma Box:",
      boxes.map((box) => ({
        text: box.name,
        onPress: async () => {
          await boxRepo.togglePokemon(box.id, data!.id);
          Alert.alert("Sucesso", `Pokémon adicionado à box "${box.name}"`);
        },
      }))
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Image
          source={require("../../../assets/splash/img3.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.name}>
        {data.name} #{data.id}
      </Text>

      <Image
        source={{
          uri:
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Atributos */}
      <View style={styles.attributes}>
        <View style={styles.attrBlock}>
          <Text style={styles.label}>Altura:</Text>
          <Text>{(data.height / 10).toFixed(1)}m</Text>
        </View>
        <View style={styles.attrBlock}>
          <Text style={styles.label}>Categoria:</Text>
          <Text>{data.species.name}</Text>
        </View>
        <View style={styles.attrBlock}>
          <Text style={styles.label}>Peso:</Text>
          <Text>{(data.weight / 10).toFixed(1)}kg</Text>
        </View>
        <View style={styles.attrBlock}>
          <Text style={styles.label}>Habilidades:</Text>
          <Text>{data.abilities.map((a) => a.ability.name).join(", ")}</Text>
        </View>
      </View>

      {/* Tipo */}
      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.typeWrapper}>
        {data.types.map((t) => (
          <View key={t.type.name} style={styles.typeTag}>
            <Text style={styles.typeText}>{t.type.name}</Text>
          </View>
        ))}
      </View>

      {/* Estatísticas */}
      <Text style={styles.label}>Estatísticas</Text>
      <View style={styles.statsContainer}>
        {data.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statLabel}>{formatStatName(s.stat.name)}</Text>
            <View style={styles.barWrapper}>
              <View
                style={[styles.bar, { width: `${(s.base_stat / 150) * 100}%` }]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={handleAddToBox}>
        <Text style={styles.buttonText}>Adicionar à Box</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatStatName(name: string) {
  switch (name) {
    case "hp":
      return "HP";
    case "attack":
      return "Ataque";
    case "defense":
      return "Defesa";
    case "special-attack":
      return "Ataque Esp.";
    case "special-defense":
      return "Defesa Esp.";
    case "speed":
      return "Velocidade";
    default:
      return name;
  }
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: spacing.md,
  },

  backButton: {
    marginRight: spacing.md,
  },

  logo: {
    width: 130,
    height: 32,
    resizeMode: "contain",
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.md,
    textTransform: "capitalize",
    color: colors.textPrimary,
  },
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    backgroundColor: "#FFF8F2",
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  attributes: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  attrBlock: {
    width: "48%",
    marginBottom: spacing.sm,
  },
  label: {
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  typeWrapper: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeTag: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  typeText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsContainer: {
    backgroundColor: "#EEEEEE",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statRow: {
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  barWrapper: {
    backgroundColor: "#ddd",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: 8,
    backgroundColor: "#4CAF50",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
