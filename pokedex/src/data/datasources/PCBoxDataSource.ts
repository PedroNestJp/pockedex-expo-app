import AsyncStorage from "@react-native-async-storage/async-storage";
import { PCBox } from "../../domain/models/PCBox";

const STORAGE_KEY = "@pc_boxes";

export class PCBoxDataSource {
  async getAll(): Promise<PCBox[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveAll(boxes: PCBox[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(boxes));
  }
}
