// app/boxes/create.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { PCBoxRepository } from "../../../src/data/repositories/PCBoxRepository";
import { spacing, colors, typography } from "../../../src/theme";

const repo = new PCBoxRepository();

export default function BoxesScreen() {
  const {
    data: boxes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pcBoxes"],
    queryFn: () => repo.getBoxes(),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Carregando caixas…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Erro ao carregar as boxes.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Link href="/boxes/create">
        <TouchableOpacity
          style={[styles.box, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.boxText, { color: colors.background }]}>
            + Nova Box
          </Text>
        </TouchableOpacity>
      </Link>
      <FlatList
        data={boxes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/boxes/${item.id}`} asChild>
            <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  box: {
    textAlign: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
  },
  boxText: {
    textAlign: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
