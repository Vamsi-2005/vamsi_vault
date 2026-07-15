import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >

        {/* Back Button */}

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Header */}

        <View style={styles.header}>

          <Text style={styles.logo}>
            🔐
          </Text>

          <Text style={styles.title}>
            Vamsi Vault
          </Text>

          <Text style={styles.subtitle}>
            Secure Password Manager
          </Text>

        </View>
                {/* Version */}

        <View style={styles.card}>

          <Text style={styles.label}>
            📱 Version
          </Text>

          <Text style={styles.value}>
            1.0.0
          </Text>

        </View>

        {/* Developer */}

        <View style={styles.card}>

          <Text style={styles.label}>
            👨‍💻 Developer
          </Text>

          <Text style={styles.value}>
            Muluguru Vamsi
          </Text>

        </View>

        {/* College */}

        <View style={styles.card}>

          <Text style={styles.label}>
            🎓 College
          </Text>

          <Text style={styles.value}>
            Rayalaseema University
          </Text>

          <Text style={styles.value}>
            College of Engineering
          </Text>

        </View>

        {/* Technologies */}

        <View style={styles.card}>

          <Text style={styles.label}>
            💻 Technologies
          </Text>

          <Text style={styles.value}>
            React Native
          </Text>

          <Text style={styles.value}>
            Expo Router
          </Text>

          <Text style={styles.value}>
            Supabase
          </Text>

          <Text style={styles.value}>
            TypeScript
          </Text>

        </View>

        {/* Copyright */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            © 2026 Vamsi Vault
          </Text>

          <Text style={styles.footerText}>
            All Rights Reserved.
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  back: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    fontSize: 70,
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 12,
  },

  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    lineHeight: 24,
  },

  footer: {
    marginTop: 25,
    marginBottom: 30,
    alignItems: "center",
  },

  footerText: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginBottom: 5,
  },
});

