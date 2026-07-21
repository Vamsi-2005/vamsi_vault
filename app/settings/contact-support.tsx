import React from "react";

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { Ionicons } from "@expo/vector-icons";

export default function ContactSupportScreen() {

  const openEmail = () => {
    Linking.openURL(
      "mailto:support@vamsivault.com"
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar style="dark" />

      <View style={styles.content}>

        <Text style={styles.title}>
          Contact Support
        </Text>

        <Text style={styles.subtitle}>
          Need help? Contact our support team.
        </Text>

        <TouchableOpacity
          style={styles.emailCard}
          onPress={openEmail}
          activeOpacity={0.8}
        >

          <View style={styles.iconBox}>

            <Ionicons
              name="mail-outline"
              size={28}
              color="#003456"
            />

          </View>

          <View>

            <Text style={styles.emailTitle}>
              Email Support
            </Text>

            <Text style={styles.emailText}>
              support@vamsivault.com
            </Text>

          </View>

        </TouchableOpacity>

      </View>

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
  },

  subtitle: {
    fontSize: 16,
    color: "#727780",
    marginTop: 10,
    marginBottom: 30,
  },

  emailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#ECEEF0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  emailTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#191C1E",
  },

  emailText: {
    fontSize: 14,
    color: "#727780",
    marginTop: 5,
  },

});