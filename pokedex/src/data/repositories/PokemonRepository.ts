// src/data/repositories/FavoriteRepository.ts
import { PokeApiDataSource } from "../datasources/PokeApiDataSource";
import type { Pokemon } from "../../domain/models/Pokemon";
import { PokemonDetails } from "../../domain/models/PokemonDetails";
import axios from "axios";

export class PokemonRepository {
  private api = new PokeApiDataSource();

  async getPokemons(offset = 0, limit = 151): Promise<Pokemon[]> {
    const list = await this.api.fetchList(offset, limit);
    return list.results.map((item) => {
      const parts = item.url.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      return {
        id,
        name: item.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      } as Pokemon;
    });
  }

  async getPokemonById(id: number): Promise<PokemonDetails> {
    return this.api.fetchById(id);
  }

  async getPokemonByNameOrId(nameOrId: string): Promise<Pokemon> {
    const details = await this.api.fetchByNameOrId(nameOrId);
    return {
      id: details.id,
      name: details.name,
      image: details.sprites.front_default,
    };
  }

  async getTypes(): Promise<string[]> {
    const res = await axios.get("https://pokeapi.co/api/v2/type");
    return res.data.results.map((type: { name: string }) => type.name);
  }
}
