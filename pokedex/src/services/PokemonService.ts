// src/services/PokemonService.ts
import { PokeApiDataSource } from "../data/datasources/PokeApiDataSource";
import { PokemonRepository, Pokemon } from "./types";

// Responsável por buscar Pokémons; segue Single Responsibility Principle
export class PokemonService implements PokemonRepository {
  private api = new PokeApiDataSource();

  async getRandomPokemons(count: number): Promise<Pokemon[]> {
    const list = await this.api.fetchList(0, 151);
    const pokemons: Pokemon[] = list.results.map((item) => {
      const parts = item.url.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      return {
        id,
        name: item.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    // Shuffle e slice
    return pokemons.sort(() => Math.random() - 0.5).slice(0, count);
  }
}
