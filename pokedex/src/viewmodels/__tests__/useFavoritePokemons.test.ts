import { FavoriteRepository } from "../../data/repositories/FavoriteRepository";

describe("FavoriteRepository", () => {
  const repo = new FavoriteRepository();

  const sample = {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    image: "url",
  };

  it("deve adicionar e remover um favorito corretamente", async () => {
    await repo.toggleFavorite(sample);
    let favs = await repo.getFavorites();
    expect(favs).toContainEqual(expect.objectContaining({ id: 1 }));

    await repo.toggleFavorite(sample);
    favs = await repo.getFavorites();
    expect(favs).not.toContainEqual(expect.objectContaining({ id: 1 }));
  });
});
