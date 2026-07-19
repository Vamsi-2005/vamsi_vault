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
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hidePassword, setHidePassword] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // LOGIN
  // =====================================

  const login = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address."
      );

      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Password Required",
        "Please enter your password."
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setLoading(false);

      if (error) {
        Alert.alert(
          "Login Failed",
          "Invalid email or password."
        );

        return;
      }

      // =====================================
      // EMAIL VERIFICATION
      // =====================================

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();

        Alert.alert(
          "Email Not Verified",
          "Please verify your email first before logging in."
        );

        return;
      }

      // =====================================
      // SUCCESS
      // =====================================

      Alert.alert(
        "Success",
        "Login Successful."
      );

      router.replace(
        "/(tabs)/dashboard"
      );

    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
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
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* =====================================
              HEADER
          ===================================== */}

          <View
            style={styles.header}
          >

            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Welcome back
            </Text>

            <Text
              style={styles.subtitle}
            >
              Sign in to your Vamsi Vault
            </Text>

            <Text
              style={styles.subtitle}
            >
              to access your secure passwords
            </Text>

          </View>

          {/* =====================================
              LOGIN CARD
          ===================================== */}

          <View
            style={styles.loginCard}
          >

            {/* EMAIL */}

            <View
              style={styles.inputGroup}
            >

              <Text
                style={styles.label}
              >
                EMAIL ADDRESS
              </Text>

              <View
                style={styles.inputWrapper}
              >

                <Ionicons
                  name="mail-outline"
                  size={21}
                  color="#727780"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />

              </View>

            </View>

            {/* PASSWORD */}

            <View
              style={styles.inputGroup}
            >

              <Text
                style={styles.label}
              >
                PASSWORD
              </Text>

              <View
                style={styles.inputWrapper}
              >

                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#727780"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={
                    hidePassword
                  }
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setHidePassword(
                      !hidePassword
                    )
                  }
                >

                  <Ionicons
                    name={
                      hidePassword
                        ? "eye-outline"
                        : "eye-off-outline"
                    }
                    size={22}
                    color="#727780"
                  />

                </TouchableOpacity>

              </View>

            </View>

            {/* FORGOT PASSWORD */}

            <TouchableOpacity
              style={
                styles.forgotButton
              }
              onPress={() =>
                router.push(
                  "/(auth)/forgot-password"
                )
              }
            >

              <Text
                style={styles.forgotText}
              >
                Forgot Password?
              </Text>

            </TouchableOpacity>

            {/* LOGIN BUTTON */}

            <TouchableOpacity
              style={[
                styles.loginButton,

                loading &&
                  styles.loginButtonDisabled,
              ]}
              onPress={login}
              disabled={loading}
              activeOpacity={0.85}
            >

              {loading ? (

                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

              ) : (

                <>

                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Login Securely
                  </Text>

                  <Ionicons
                    name="log-in-outline"
                    size={21}
                    color="#FFFFFF"
                  />

                </>

              )}

            </TouchableOpacity>

            {/* DIVIDER */}

            <View
              style={
                styles.dividerContainer
              }
            >

              <View
                style={styles.divider}
              />

              <Text
                style={styles.orText}
              >
                OR
              </Text>

              <View
                style={styles.divider}
              />

            </View>

            {/* CREATE ACCOUNT */}

            <TouchableOpacity
              style={
                styles.createAccountButton
              }
              onPress={() =>
                router.replace(
                  "/(auth)/register"
                )
              }
              activeOpacity={0.8}
            >

              <Text
                style={
                  styles.createAccountText
                }
              >
                Create Account
              </Text>

            </TouchableOpacity>

          </View>

          {/* =====================================
              BRANDING
          ===================================== */}

          <View
            style={styles.branding}
          >

            <Text
              style={styles.brandName}
            >
              <Text style={styles.brandVamsi}>
                Vamsi
              </Text>{" "}

              <Text style={styles.brandVault}>
                Vault
              </Text>
            </Text>

            <Text
              style={styles.brandSubtitle}
            >
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

  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },

  // =====================================
  // HEADER
  // =====================================

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: "#191C1E",
    marginBottom: 8,
    textAlign: "center",
    width: "100%",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#41474F",
    textAlign: "center",
  },

  // =====================================
  // LOGIN CARD
  // =====================================

  loginCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E3E5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  // =====================================
  // INPUT GROUP
  // =====================================

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#41474F",
    marginBottom: 8,
  },

  inputWrapper: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C1C7D0",
    borderRadius: 9,
    paddingHorizontal: 12,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#191C1E",
    fontWeight: "400",
  },

  eyeButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================
  // FORGOT PASSWORD
  // =====================================

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#064B78",
  },

  // =====================================
  // LOGIN BUTTON
  // =====================================

  loginButton: {
    height: 56,
    borderRadius: 9,
    backgroundColor: "#064B78",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 4,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // =====================================
  // DIVIDER
  // =====================================

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#C1C7D0",
  },

  orText: {
    marginHorizontal: 14,
    fontSize: 12,
    fontWeight: "600",
    color: "#727780",
    letterSpacing: 1,
  },

  // =====================================
  // CREATE ACCOUNT
  // =====================================

  createAccountButton: {
    height: 56,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#727780",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  createAccountText: {
    color: "#003456",
    fontSize: 16,
    fontWeight: "700",
  },

  // =====================================
  // BRANDING
  // =====================================

  branding: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 0,
  },

  brandName: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // Vamsi → #123B63
  brandVamsi: {
    color: "#123B63",
  },

  // Vault → #D89B24
  brandVault: {
    color: "#D89B24",
  },

  brandSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#727780",
    letterSpacing: 0.3,
  },

});

