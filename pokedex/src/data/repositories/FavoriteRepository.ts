import { FavoriteDataSource } from "../datasources/FavoriteDataSource";
import type { Pokemon } from "../../domain/models/Pokemon";

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
}
