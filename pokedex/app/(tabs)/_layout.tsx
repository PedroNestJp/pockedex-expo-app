import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "../../src/context/NotificationsContext";
import { ExpoNotificationService } from "../../src/services/NotificationService";

const queryClient = new QueryClient();
const notificationService = new ExpoNotificationService();

export default function TabsLayout() {
  return (
    <NotificationsProvider notificationService={notificationService}>
      <QueryClientProvider client={queryClient}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#74CB48",
            tabBarLabelStyle: { fontWeight: "600" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Pokémons",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="favorites"
            options={{
              title: "Favoritos",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="boxes"
            options={{
              title: "Boxes",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cube" color={color} size={size} />
              ),
            }}
          />
        </Tabs>
      </QueryClientProvider>
    </NotificationsProvider>
  );
}
