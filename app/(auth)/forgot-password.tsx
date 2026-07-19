import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../services/supabase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // RESET PASSWORD
  // =====================================

  const resetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your registered email address."
      );

      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: "vamsivault://",
          }
        );

      setLoading(false);

      if (error) {
        Alert.alert(
          "Reset Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email."
      );

      router.replace("/(auth)/login");

    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* =====================================
              HEADER
          ===================================== */}

          <View style={styles.header}>

            <Text style={styles.title}>
              Reset Your Password
            </Text>

            <Text style={styles.description}>
              Enter your registered email address and
              {"\n"}
              we'll send you a secure reset link.
            </Text>

          </View>

          {/* =====================================
              FORM
          ===================================== */}

          <View style={styles.form}>

            {/* EMAIL LABEL */}

            <Text style={styles.label}>
              Email Address
            </Text>

            {/* EMAIL INPUT */}

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            {/* =====================================
                SEND RESET LINK
            ===================================== */}

            <TouchableOpacity
              style={[
                styles.resetButton,
                loading && styles.disabledButton,
              ]}
              onPress={resetPassword}
              disabled={loading}
              activeOpacity={0.85}
            >

              {loading ? (

                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

              ) : (

                <Text style={styles.resetButtonText}>
                  SEND RESET LINK
                </Text>

              )}

            </TouchableOpacity>

            {/* =====================================
                BACK TO LOGIN
            ===================================== */}

            <TouchableOpacity
              style={styles.backLoginButton}
              onPress={() =>
                router.replace(
                  "/(auth)/login"
                )
              }
              activeOpacity={0.8}
            >

              <Ionicons
                name="arrow-back"
                size={20}
                color="#064B78"
              />

              <Text style={styles.backLoginText}>
                BACK TO LOGIN
              </Text>

            </TouchableOpacity>

          </View>

          {/* =====================================
              BRANDING
          ===================================== */}

          <View style={styles.branding}>

            <Text style={styles.brandName}>
              Vamsi{" "}

              <Text style={styles.brandAccent}>
                Vault
              </Text>
            </Text>

            <Text style={styles.brandSubtitle}>
              Secure • Private • Protected
            </Text>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  // =====================================
  // CONTAINER
  // =====================================

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal: 24,

    paddingTop: 64,

    paddingBottom: 30,

    justifyContent: "center",
  },

  // =====================================
  // HEADER
  // =====================================

  header: {
    alignItems: "center",

    marginBottom: 40,
  },

  title: {
    fontSize: 30,

    fontWeight: "800",

    color: "#064B78",

    textAlign: "center",

    marginBottom: 16,
  },

  description: {
    fontSize: 14,

    lineHeight: 22,

    color: "#94A3B8",

    textAlign: "center",
  },

  // =====================================
  // FORM
  // =====================================

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,

    fontWeight: "700",

    color: "#334155",

    marginBottom: 9,

    marginLeft: 4,
  },

  input: {
    width: "100%",

    height: 64,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E2E8F0",

    borderRadius: 9,

    paddingHorizontal: 20,

    fontSize: 16,

    color: "#334155",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 5,

    elevation: 1,
  },

  // =====================================
  // SEND RESET LINK BUTTON
  // =====================================

  resetButton: {
    width: "100%",

    height: 64,

    backgroundColor: "#064B78",

    borderRadius: 9,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 24,

    shadowColor: "#064B78",

    shadowOffset: {
      width: 0,

      height: 5,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  resetButtonText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "800",

    letterSpacing: 1,
  },

  // =====================================
  // BACK TO LOGIN BUTTON
  // =====================================

  backLoginButton: {
    width: "100%",

    height: 64,

    backgroundColor: "#EFF6FF",

    borderWidth: 1,

    borderColor: "#DBEAFE",

    borderRadius: 9,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 24,
  },

  backLoginText: {
    marginLeft: 10,

    color: "#064B78",

    fontSize: 14,

    fontWeight: "800",

    letterSpacing: 0.8,
  },

  // =====================================
  // BRANDING
  // =====================================

  branding: {
    alignItems: "center",

    marginTop: 70,
  },

  brandName: {
    fontSize: 22,

    fontWeight: "900",

    color: "#123B63",

    letterSpacing: 0.5,
  },

  brandAccent: {
    color: "#D89B24",
  },

  brandSubtitle: {
    marginTop: 7,

    fontSize: 12,

    color: "#A5ADB7",

    letterSpacing: 0.5,
  },

});