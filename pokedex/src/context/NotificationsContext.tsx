// src/context/NotificationsContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import { NotificationService } from "../services/types";

interface NotificationsContextData {
  notifyNearby: (names: string[]) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData | null>(
  null
);

export function NotificationsProvider({
  children,
  notificationService,
}: {
  children: ReactNode;
  notificationService: NotificationService;
}) {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const notifyNearby = async (names: string[]) => {
    const title = "Pokémons por perto!";
    const body = `Encontrei: ${names.join(", ")}`;
    await notificationService.scheduleNotification(title, body);
  };

  return (
    <NotificationsContext.Provider value={{ notifyNearby }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
}
