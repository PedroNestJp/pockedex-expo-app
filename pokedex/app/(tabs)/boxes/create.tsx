// app/boxes/create.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PokemonRepository } from "../../../src/data/repositories/PokemonRepository";
import { PCBoxRepository } from "../../../src/data/repositories/PCBoxRepository";
import { colors, spacing, typography } from "../../../src/theme";

const pokeRepo = new PokemonRepository();
const boxRepo = new PCBoxRepository();

export default function CreateBoxScreen() {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const router = useRouter();

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["types"],
    queryFn: () => pokeRepo.getTypes(),
  });

  console.log("TIPOS:", types);

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }
  async function handleSave() {
    if (name.trim().length < 6) {
      Alert.alert("Erro", "O nome deve ter no mínimo 6 caracteres.");
      return;
    }
    if (selectedTypes.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos 1 tipo.");
      return;
    }

    try {
      const box = await boxRepo.addBox(name.trim(), selectedTypes);
      console.log("✅ Box salva:", box);
      router.back();
    } catch (error) {
      console.error("❌ Erro ao salvar a Box:", error);
      Alert.alert("Erro", "Falha ao salvar a box.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar nova Box</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da box"
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.border}
      />

      <Text style={styles.label}>Selecione os tipos:</Text>
      {isLoading && <Text>Carregando tipos...</Text>}

      {!isLoading && types.length === 0 && <Text>Nenhum tipo disponível.</Text>}
      <FlatList
        data={types}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.typesList}
        renderItem={({ item }) => {
          const selected = selectedTypes.includes(item);
          return (
            <TouchableOpacity
              onPress={() => toggleType(item)}
              style={[styles.typeButton, selected && styles.typeButtonSelected]}
            >
              <Text
                style={[styles.typeText, selected && styles.typeTextSelected]}
              >
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Box</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 40,
    marginBottom: spacing.md,
    color: colors.text,
  },
  label: {
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.md,
  },
  typesList: {
    marginBottom: spacing.lg,
  },
  typeButton: {
    padding: spacing.sm,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: spacing.sm,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
  },
  typeText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  typeTextSelected: {
    color: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: typography.fontWeight.bold,
  },
});
