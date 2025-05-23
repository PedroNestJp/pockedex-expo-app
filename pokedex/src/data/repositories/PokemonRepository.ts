import { PokeApiDataSource } from "../datasources/PokeApiDataSource";
import type { Pokemon } from "../../domain/models/Pokemon";
import { PokemonDetails } from "../../domain/models/PokemonDetails";

export class PokemonRepository {
  private api = new PokeApiDataSource();

  async getPokemons(offset = 0, limit = 20): Promise<Pokemon[]> {
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
}
