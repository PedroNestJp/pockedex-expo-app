import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../src/theme";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.delay(1000),
    ]).start(() => {
      router.replace("/"); // vai para tela principal
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/splash/img1.png")}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require("../assets/splash/img2.png")}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require("../assets/splash/img3.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 120,
    height: 120,
    position: "absolute",
  },
  logo: {
    width: 180,
    height: 60,
    marginTop: 240,
  },
});
