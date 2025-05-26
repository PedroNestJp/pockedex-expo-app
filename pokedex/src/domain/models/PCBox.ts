export interface PCBox {
  id: string; // UUID
  name: string;
  types: string[];
  pokemons: number[]; // ids dos pokémons favoritos dentro da box
}
