import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Text style={styles.logo}>🔐</Text>

        <Text style={styles.title}>
          Welcome to{"\n"}Vamsi Vault
        </Text>

        <Text style={styles.subtitle}>
          Keep all your passwords safe,
          secure and accessible anytime,
          anywhere.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.registerText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Version 1.0.0
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  logo: {
    fontSize: 90,
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 50,
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerButton: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  registerText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    color: "#999",
    fontSize: 14,
  },
});