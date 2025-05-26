import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "../src/context/NotificationsContext";
import { ExpoNotificationService } from "../src/services/NotificationService";
import { Stack } from "expo-router";

const queryClient = new QueryClient();
const notificationService = new ExpoNotificationService();

export default function RootLayout() {
  const isFirstLaunch = true;

  return (
    <NotificationsProvider notificationService={notificationService}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </NotificationsProvider>
  );
}
