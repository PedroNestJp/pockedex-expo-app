// src/data/datasources/FavoriteDataSource.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Pokemon } from "../../domain/models/Pokemon";

const FAVORITES_KEY = "favorites";

export class FavoriteDataSource {
  async getFavorites(): Promise<Pokemon[]> {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  }
  async saveFavorites(items: Pokemon[]): Promise<void> {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }
}
