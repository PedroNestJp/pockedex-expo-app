import { PCBoxDataSource } from "../datasources/PCBoxDataSource";
import { PCBox } from "../../domain/models/PCBox";
import { v4 as uuidv4 } from "uuid";

const ds = new PCBoxDataSource();

export class PCBoxRepository {
  async getBoxes(): Promise<PCBox[]> {
    return ds.getAll();
  }

  async addBox(name: string, types: string[]): Promise<PCBox> {
    const boxes = await ds.getAll();
    const newBox: PCBox = {
      id: uuidv4(),
      name,
      types,
      pokemons: [],
    };
    const updated = [...boxes, newBox];
    await ds.saveAll(updated);
    return newBox;
  }

  async togglePokemon(boxId: string, pokemonId: number) {
    const boxes = await ds.getAll();
    const updated = boxes.map((box) =>
      box.id === boxId
        ? {
            ...box,
            pokemons: box.pokemons.includes(pokemonId)
              ? box.pokemons.filter((id) => id !== pokemonId)
              : [...box.pokemons, pokemonId],
          }
        : box
    );
    await ds.saveAll(updated);
  }

  async getBoxById(id: string): Promise<PCBox | undefined> {
    const boxes = await ds.getAll();
    return boxes.find((b) => b.id === id);
  }
}
