import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationsProvider } from "../src/context/NotificationsContext";
import { ExpoNotificationService } from "../src/services/NotificationService";
import { NearbyPokemons } from "../src/components/NearbyPokemons";

const queryClient = new QueryClient();
const notificationService = new ExpoNotificationService();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotificationsProvider notificationService={notificationService}>
        <QueryClientProvider client={queryClient}>
          <View style={styles.screen}>
            <NearbyPokemons count={3} />
            <Slot />
          </View>
        </QueryClientProvider>
      </NotificationsProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1 } });
