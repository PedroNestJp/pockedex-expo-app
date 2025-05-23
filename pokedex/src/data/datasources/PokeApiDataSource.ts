import axios from "axios";
import type { Pokemon } from "../../domain/models/Pokemon";
import { PokemonDetails } from "../../domain/models/PokemonDetails";

interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export class PokeApiDataSource {
  async fetchList(offset: number, limit: number) {
    const { data } = await axios.get<PokeApiListResponse>(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    return data;
  }

  async fetchById(id: number) {
    const { data } = await axios.get<PokemonDetails>(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    return data;
  }
}
