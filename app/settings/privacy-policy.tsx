import React from "react";

import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import { StatusBar } from "expo-status-bar";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
      >

        <Text style={styles.title}>
          Privacy Policy
        </Text>

        <Text style={styles.text}>
          Vamsi Vault is designed to help you securely
          manage your account credentials.

          {"\n\n"}

          Your password data is associated with your
          authenticated account and protected using
          Supabase authentication and database security.

          {"\n\n"}

          We do not sell your personal information.

          {"\n\n"}

          Please keep your login credentials secure and
          do not share your account password with anyone.
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },

  content: {
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003456",
    marginBottom: 24,
  },

  text: {
    fontSize: 16,
    lineHeight: 27,
    color: "#41474F",
  },

});