import { FavoriteDataSource } from "../datasources/FavoriteDataSource";
import type { Pokemon } from "../../domain/models/Pokemon";
import { PokeApiDataSource } from "../datasources/PokeApiDataSource";
import { PokemonRepository } from "./PokemonRepository";
import { PokemonWithTypes } from "../../domain/models/PokemonWithTypes";

export class FavoriteRepository {
  private ds = new FavoriteDataSource();

  async getFavorites(): Promise<Pokemon[]> {
    return this.ds.getFavorites();
  }

  async toggleFavorite(pokemon: Pokemon): Promise<void> {
    const list = await this.ds.getFavorites();
    const exists = list.some((p) => p.id === pokemon.id);
    const updated = exists
      ? list.filter((p) => p.id !== pokemon.id)
      : [...list, pokemon];
    await this.ds.saveFavorites(updated);
  }

  async getFavoritesWithTypes(): Promise<PokemonWithTypes[]> {
    const list = await this.getFavorites();
    const pokeRepo = new PokemonRepository();
    return Promise.all(
      list.map(async (p) => {
        const details = await pokeRepo.getPokemonById(p.id);
        return {
          id: p.id,
          name: p.name,
          image: p.image,
          types: details.types.map((t) => t.type.name),
        };
      })
    );
  }
}
