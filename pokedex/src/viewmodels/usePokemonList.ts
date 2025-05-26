import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PokemonRepository } from "../data/repositories/PokemonRepository";
import { FavoriteRepository } from "../data/repositories/FavoriteRepository";
import type { Pokemon } from "../domain/models/Pokemon";

const pokemonRepo = new PokemonRepository();
const favoriteRepo = new FavoriteRepository();

export function usePokemonList() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery<Pokemon[], Error>({
    queryKey: ["favorites"],
    queryFn: () => favoriteRepo.getFavorites(),
  });

  const toggleFavorite = useMutation({
    mutationFn: (p: Pokemon) => favoriteRepo.toggleFavorite(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoritesWithTypes"] });
    },
  });

  const {
    data: searched,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery<Pokemon, Error>({
    queryKey: ["search", search],
    queryFn: () => pokemonRepo.getPokemonByNameOrId(search),
    enabled: !!search,
  });

  const {
    data: allPokemons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<Pokemon[], Error>({
    queryKey: ["pokemons"],
    queryFn: () => pokemonRepo.getPokemons(0, 20),
  });

  const displayData = search ? (searched ? [searched] : []) : allPokemons;

  return {
    search,
    setSearch,
    displayData,
    isLoadingAll,
    isErrorAll,
    isSearching,
    isSearchError,
    favorites,
    toggleFavorite: toggleFavorite.mutate,
    refetchAll: () => queryClient.invalidateQueries({ queryKey: ["pokemons"] }),
  };
}
