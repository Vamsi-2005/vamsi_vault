import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(float, {
            toValue: -12,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(float, {
            toValue: 12,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Background blobs */}

      <Animated.View
        style={[
          styles.blob1,
          {
            transform: [{ translateY: float }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.blob2,
          {
            transform: [{ translateY: Animated.multiply(float, -1) }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.glassCard,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/splish.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Vamsi Vault</Text>

        <Text style={styles.subtitle}>
          Secure • Private • Encrypted
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View style={styles.progressFill} />
        </View>

        <Text style={styles.loading}>
          Preparing your secure vault...
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071120",
    justifyContent: "center",
    alignItems: "center",
  },

  blob1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#3B82F6",
    opacity: 0.18,
    top: 80,
    left: -50,
  },

  blob2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#06B6D4",
    opacity: 0.15,
    bottom: 70,
    right: -40,
  },

  glassCard: {
    width: "82%",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 16,
    color: "#B6D4FF",
    marginTop: 8,
  },

  progressTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    marginTop: 35,
    overflow: "hidden",
  },

  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#60A5FA",
    borderRadius: 10,
  },

  loading: {
    marginTop: 18,
    color: "#E2E8F0",
    fontSize: 15,
  },
});