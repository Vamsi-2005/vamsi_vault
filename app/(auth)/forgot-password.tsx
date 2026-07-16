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
import { router } from "expo-router";
import { supabase } from "../../services/supabase";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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

          {/* Header */}
          <View style={styles.header}>

            <View style={styles.iconContainer}>
              <Text style={styles.icon}>
                🔐
              </Text>
            </View>

            <Text style={styles.title}>
              Reset Your{" "}
              <Text style={styles.titleAccent}>
                Password
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              No worries, it happens.
            </Text>

            <Text style={styles.description}>
              Enter your registered email address and
              {"\n"}
              we'll send you a secure reset link.
            </Text>

          </View>

          {/* Form */}
          <View style={styles.form}>

            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            {/* Send Reset Link */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={resetPassword}
              disabled={loading}
            >

              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              ) : (
                <Text style={styles.buttonText}>
                  SEND RESET LINK
                </Text>
              )}

            </TouchableOpacity>

          </View>

          {/* Back to Login Button */}
          <TouchableOpacity
            style={styles.backLoginButton}
            onPress={() =>
              router.replace("/(auth)/login")
            }
          >
            <Text style={styles.backArrow}>
              ←
            </Text>

            <Text style={styles.backLoginText}>
              BACK TO LOGIN
            </Text>
          </TouchableOpacity>

          {/* Branding */}
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 30,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
  },

  iconContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#F1F7FB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  icon: {
    fontSize: 48,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#123B63",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  titleAccent: {
    color: "#D89B24",
  },

  subtitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "600",
    color: "#526579",
  },

  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    color: "#7A8491",
  },

  form: {
    marginTop: 42,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 9,
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D8E0E8",
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#123B63",
    backgroundColor: "#F8FAFC",
  },

  button: {
    height: 58,
    backgroundColor: "#064B78",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

    elevation: 5,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /*
   * BACK TO LOGIN BUTTON
   */

  backLoginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#EAF2F8",
    borderWidth: 1,
    borderColor: "#B8D0E2",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 24,
  },

  backArrow: {
    fontSize: 28,
    fontWeight: "700",
    color: "#064B78",
    marginRight: 10,
    lineHeight: 30,
  },

  backLoginText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#064B78",
    letterSpacing: 0.8,
  },

  branding: {
    alignItems: "center",
    marginTop: 55,
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