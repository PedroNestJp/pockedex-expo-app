// src/domain/models/PokemonDetails.ts
export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string;
    other: {
      ["official-artwork"]: {
        front_default: string | null;
      };
      ["dream_world"]?: {
        front_default: string | null;
      };
    };
  };
  species: {
    name: string;
  };
  abilities: {
    ability: {
      name: string;
    };
  }[];
}
