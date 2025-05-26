// src/hooks/useNearbyPokemons.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { PokemonService } from "../services/PokemonService";
import { useNotifications } from "../context/NotificationsContext";
import type { Pokemon } from "../services/types";

export function useNearbyPokemons(count: number) {
  const service = new PokemonService();
  const { notifyNearby } = useNotifications();
  const hasNotifiedRef = useRef(false);
  const lastNamesRef = useRef<string[]>([]);

  const query = useQuery<Pokemon[], Error>({
    queryKey: ["nearby", count],
    queryFn: () => service.getRandomPokemons(count),
    refetchInterval: 1 * 60 * 1000, // 1 minuto
    staleTime: 1 * 60 * 1000, // evita refetch on focus
    refetchOnWindowFocus: false,
  });

  const pokemons = query.data ?? [];

  useEffect(() => {
    if (!hasNotifiedRef.current && pokemons.length > 0) {
      // primeiro load: só grava
      hasNotifiedRef.current = true;
      lastNamesRef.current = pokemons.map((p) => p.name);
      return;
    }
    const names = pokemons.map((p) => p.name);
    const changed =
      names.length !== lastNamesRef.current.length ||
      names.some((n, i) => n !== lastNamesRef.current[i]);
    if (changed && names.length > 0) {
      notifyNearby(names);
      lastNamesRef.current = names;
    }
  }, [pokemons, notifyNearby]);

  return {
    pokemons,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
