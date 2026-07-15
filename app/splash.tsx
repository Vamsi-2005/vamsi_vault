import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.logo}>🔐</Text>

        <Text style={styles.title}>
          Vamsi Vault
        </Text>

        <Text style={styles.subtitle}>
          Secure Password Manager
        </Text>

        <Text style={styles.description}>
          Store your passwords securely{"\n"}
          and access them anytime.
        </Text>

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.loader}
        />

        <Text style={styles.loading}>
          Loading...
        </Text>
      </View>

      <Text style={styles.version}>
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563EB",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logo: {
    fontSize: 90,
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 18,
    color: "#E5E7EB",
    marginTop: 10,
    fontWeight: "600",
  },

  description: {
    textAlign: "center",
    color: "#F3F4F6",
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
  },

  loader: {
    marginTop: 40,
  },

  loading: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },

  version: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
  },
});