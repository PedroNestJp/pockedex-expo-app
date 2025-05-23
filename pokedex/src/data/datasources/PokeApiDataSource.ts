import axios from "axios";
import { PokemonDetails } from "../../domain/models/PokemonDetails";
import { PokemonWithTypes } from "../../domain/models/PokemonWithTypes";

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

  async fetchByNameOrId(nameOrId: string) {
    const { data } = await axios.get<PokemonDetails>(
      `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`
    );
    return data;
  }

  async fetchTypes(): Promise<PokemonWithTypes[]> {
    const { data } = await axios.get<{ results: PokemonWithTypes[] }>(
      `https://pokeapi.co/api/v2/type`
    );
    return data.results;
  }
}
