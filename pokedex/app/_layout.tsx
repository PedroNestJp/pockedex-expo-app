import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider } from "../src/context/NotificationsContext";
import { ExpoNotificationService } from "../src/services/NotificationService";
import { NearbyPokemons } from "../src/components/NearbyPokemons";

const queryClient = new QueryClient();
const notificationService = new ExpoNotificationService();

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.root}>
      <NotificationsProvider notificationService={notificationService}>
        <QueryClientProvider client={queryClient}>
          {/* Seção fixa de Nearby */}
          <View style={styles.nearbyWrapper}>
            <NearbyPokemons count={3} />
          </View>
          {/* Conteúdo das rotas */}
          <View style={styles.content}>
            <Slot />
          </View>
        </QueryClientProvider>
      </NotificationsProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  nearbyWrapper: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fafafa",
  },
  content: {
    flex: 1,
  },
});
