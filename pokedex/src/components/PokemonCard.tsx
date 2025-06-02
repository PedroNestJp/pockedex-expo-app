import React, { JSX } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Pokemon } from "../domain/models/Pokemon";
import { colors, spacing, typography } from "../theme";

interface Props {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggle: (p: Pokemon) => void;
}

export const PokemonCard: React.FC<Props> = React.memo(function Card({
  pokemon,
  isFavorite,
  onToggle,
}: Props): JSX.Element {
  const imageSource =
    pokemon.image ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onToggle(pokemon)}
        style={styles.favoriteIcon}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? colors.favorite : colors.textSecondary}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: imageSource }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.name}>
        {pokemon.name} #{pokemon.id}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: Platform.OS === "ios" ? 0.05 : 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
    textTransform: "capitalize",
  },
});
