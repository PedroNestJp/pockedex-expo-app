// src/services/NotificationService.ts
import * as Notifications from "expo-notifications";
import { NotificationService } from "./types";

// Responsável por agendar notificações (SRP)
export class ExpoNotificationService implements NotificationService {
  async scheduleNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // dispara imediatamente
    });
  }
}
