import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "../src/context/NotificationsContext";
import { ExpoNotificationService } from "../src/services/NotificationService";

const queryClient = new QueryClient();
const notificationService = new ExpoNotificationService();

export default function RootLayout() {
  return (
    <NotificationsProvider notificationService={notificationService}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </NotificationsProvider>
  );
}
