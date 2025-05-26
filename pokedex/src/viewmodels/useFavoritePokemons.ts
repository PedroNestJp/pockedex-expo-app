import { useQuery } from "@tanstack/react-query";
import { FavoriteRepository } from "../data/repositories/FavoriteRepository";
import type { PokemonWithTypes } from "../domain/models/PokemonWithTypes";

const repo = new FavoriteRepository();

export function useFavoritePokemons() {
  const {
    data: favs,
    isLoading,
    isError,
  } = useQuery<PokemonWithTypes[], Error>({
    queryKey: ["favoritesWithTypes"],
    queryFn: () => repo.getFavoritesWithTypes(),
  });

  const groupedFavorites = favs
    ? Object.entries(
        favs.reduce((map, p) => {
          p.types.forEach((type) => {
            if (!map[type]) map[type] = [];
            map[type].push(p);
          });
          return map;
        }, {} as Record<string, PokemonWithTypes[]>)
      ).map(([title, data]) => ({ title, data }))
    : [];

  return {
    isLoading,
    isError,
    groupedFavorites,
  };
}
