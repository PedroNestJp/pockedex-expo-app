import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Busque pelo nome ou número do Pokémon"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor={colors.border}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
    backgroundColor: colors.background,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
});
