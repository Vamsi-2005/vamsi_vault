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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [hidePassword, setHidePassword] =
    useState(true);

  const [hideConfirmPassword, setHideConfirmPassword] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // REGISTER USER
  // =====================================

  const register = async () => {
    if (!name.trim()) {
      Alert.alert(
        "Name Required",
        "Please enter your full name."
      );
      return;
    }

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

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert(
        "Confirm Password",
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,

          options: {
            emailRedirectTo:
              "vamsivault://",

            data: {
              full_name: name.trim(),
            },
          },
        });

      setLoading(false);

      if (error) {
        const errorMessage =
          error.message.toLowerCase();

        if (
          errorMessage.includes("already") ||
          errorMessage.includes("registered")
        ) {
          Alert.alert(
            "Account Exists",
            "This email is already registered. Please login."
          );

          return;
        }

        Alert.alert(
          "Registration Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Verify Your Email",
        "Your account has been created successfully.\n\nA verification email has been sent to your email address.\n\nPlease verify your email first, then login."
      );

      router.replace(
        "/(auth)/login"
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
              Create Account
            </Text>

            <Text
              style={styles.subtitle}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Join Vamsi Vault today and secure your passwords
            </Text>

          </View>

          {/* =====================================
              REGISTER CARD
          ===================================== */}

          <View
            style={styles.formCard}
          >

            {/* FULL NAME */}

            <View
              style={styles.inputGroup}
            >

              <Text
                style={styles.label}
              >
                FULL NAME
              </Text>

              <View
                style={styles.inputWrapper}
              >

                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#727780"
                />

                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />

              </View>

            </View>

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
                />

                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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
                />

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={
                    hidePassword
                  }
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

            {/* CONFIRM PASSWORD */}

            <View
              style={styles.inputGroup}
            >

              <Text
                style={styles.label}
              >
                CONFIRM PASSWORD
              </Text>

              <View
                style={styles.inputWrapper}
              >

                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#727780"
                />

                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={
                    setConfirmPassword
                  }
                  secureTextEntry={
                    hideConfirmPassword
                  }
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setHideConfirmPassword(
                      !hideConfirmPassword
                    )
                  }
                >

                  <Ionicons
                    name={
                      hideConfirmPassword
                        ? "eye-outline"
                        : "eye-off-outline"
                    }
                    size={22}
                    color="#727780"
                  />

                </TouchableOpacity>

              </View>

            </View>

            {/* CREATE ACCOUNT BUTTON */}

            <TouchableOpacity
              style={[
                styles.registerButton,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={register}
              disabled={loading}
              activeOpacity={0.85}
            >

              {loading ? (

                <ActivityIndicator
                  color="#FFFFFF"
                />

              ) : (

                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  Create Account
                </Text>

              )}

            </TouchableOpacity>

            {/* LOGIN */}

            <View
              style={styles.loginContainer}
            >

              <Text
                style={styles.loginQuestion}
              >
                Already have an account?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.replace(
                    "/(auth)/login"
                  )
                }
              >

                <Text
                  style={styles.loginText}
                >
                  Login
                </Text>

              </TouchableOpacity>

            </View>

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

              <Text
                style={styles.brandVamsi}
              >
                Vamsi
              </Text>

              {" "}

              <Text
                style={styles.brandVault}
              >
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    justifyContent: "center",
  },

  // =====================================
  // HEADER
  // =====================================

  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 0,
    width: "100%",
  },

  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: "#191C1E",
    textAlign: "center",
    letterSpacing: -0.5,
    width: "100%",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#41474F",
    textAlign: "center",
    width: "100%",
  },

  // =====================================
  // FORM CARD
  // =====================================

  formCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,

    borderWidth: 1,
    borderColor: "#E0E3E5",

    shadowColor: "#003456",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 3,
  },

  // =====================================
  // INPUT GROUP
  // =====================================

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    fontWeight: "600",
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

    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    marginLeft: 10,

    fontSize: 15,
    color: "#191C1E",
  },

  eyeButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================
  // REGISTER BUTTON
  // =====================================

  registerButton: {
    height: 56,
    marginTop: 4,

    backgroundColor: "#064B78",

    borderRadius: 9,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
    gap: 8,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,

    elevation: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  // =====================================
  // LOGIN LINK
  // =====================================

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 20,
  },

  loginQuestion: {
    fontSize: 14,
    color: "#41474F",
  },

  loginText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#064B78",
  },

  // =====================================
  // BRANDING
  // =====================================

  branding: {
    alignItems: "center",
    marginTop: 20,
  },

  // Vamsi → #123B63
  brandName: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  brandVamsi: {
    color: "#123B63",
  },

  // Vault → #D89B24
  brandVault: {
    color: "#D89B24",
  },

  brandSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#727780",
  },

});
