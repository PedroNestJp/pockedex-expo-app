// src/services/types.ts
// Arquivo de tipos para evitar dependências cíclicas e seguir DIP
export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonRepository {
  getRandomPokemons(count: number): Promise<Pokemon[]>;
}

export interface NotificationService {
  scheduleNotification(title: string, body: string): Promise<void>;
}
