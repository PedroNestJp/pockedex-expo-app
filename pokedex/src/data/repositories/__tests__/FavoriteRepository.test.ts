import { FavoriteRepository } from "../FavoriteRepository";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("FavoriteRepository", () => {
  const repo = new FavoriteRepository();

  const sample = {
    id: 25,
    name: "pikachu",
    types: ["electric"],
    image: "https://example.com/pikachu.png",
  };

  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("deve adicionar um pokémon aos favoritos", async () => {
    await repo.toggleFavorite(sample);
    const favs = await repo.getFavorites();

    expect(favs).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 25 })])
    );
  });

  it("deve remover um pokémon dos favoritos se já estiver adicionado", async () => {
    await repo.toggleFavorite(sample); // adiciona
    await repo.toggleFavorite(sample); // remove

    const favs = await repo.getFavorites();
    expect(favs).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 25 })])
    );
  });
});
