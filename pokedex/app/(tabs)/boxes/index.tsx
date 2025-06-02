import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { PCBoxRepository } from "../../../src/data/repositories/PCBoxRepository";
import { spacing, colors, typography } from "../../../src/theme";

const repo = new PCBoxRepository();

export default function BoxesScreen() {
  const queryClient = useQueryClient();

  const {
    data: boxes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["pcBoxes"],
    queryFn: () => repo.getBoxes(),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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
    <FlatList
      data={boxes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={() => (
        <Link href="/boxes/create" asChild>
          <TouchableOpacity style={styles.box}>
            <Text style={[styles.boxText, { color: colors.background }]}>
              + Nova Box
            </Text>
          </TouchableOpacity>
        </Link>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>Nenhuma Box criada ainda.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Link href={`/boxes/${item.id}`} asChild>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.boxText}>{item.name}</Text>
          </TouchableOpacity>
        </Link>
      )}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      getItemLayout={(_, index) => ({
        length: 72, // altura estimada de cada box
        offset: 72 * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  box: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  boxText: {
    textAlign: "center",
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.md,
    borderRadius: spacing.sm,
    padding: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
