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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

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

      const { data, error } =
        await supabase.auth.signInWithPassword({
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

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();

        Alert.alert(
          "Email Not Verified",
          "Please verify your email first before logging in."
        );

        return;
      }

      Alert.alert(
        "Success",
        "Login Successful."
      );

      router.replace("/(tabs)/dashboard");

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

            <Text style={styles.title}>
              Welcome{" "}
              <Text style={styles.titleAccent}>
                Back
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Sign in to your Vamsi Vault
            </Text>

            <Text style={styles.subtitle}>
              to access your secure passwords
            </Text>

          </View>

          {/* Login Form */}

          <View style={styles.form}>

            {/* Email */}

            <View style={styles.inputGroup}>

              <Text style={styles.label}>
                Email Address
              </Text>

              <View style={styles.inputWrapper}>

                <Text style={styles.inputIcon}>
                  ✉️
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

              </View>

            </View>

            {/* Password */}

            <View style={styles.inputGroup}>

              <Text style={styles.label}>
                Password
              </Text>

              <View style={styles.inputWrapper}>

                <Text style={styles.inputIcon}>
                  🔑
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={hidePassword}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setHidePassword(!hidePassword)
                  }
                >
                  <Text style={styles.eyeIcon}>
                    {hidePassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>

              </View>

            </View>

            {/* Forgot Password */}

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                router.push(
                  "/(auth)/forgot-password"
                )
              }
            >
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading &&
                  styles.loginButtonDisabled,
              ]}
              onPress={login}
              disabled={loading}
            >

              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              ) : (
                <Text style={styles.loginButtonText}>
                  LOGIN SECURELY
                </Text>
              )}

            </TouchableOpacity>

          </View>

          {/* OR Divider */}

          <View style={styles.dividerContainer}>

            <View style={styles.divider} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.divider} />

          </View>

          {/* Create Account */}

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() =>
              router.replace(
                "/(auth)/register"
              )
            }
          >
            <Text style={styles.createAccountText}>
              CREATE ACCOUNT
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
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "center",
  },

  /* Header */

  header: {
    alignItems: "center",
    marginBottom: 38,
  },

  title: {
    fontSize: 35,
    fontWeight: "900",
    color: "#123B63",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  titleAccent: {
    color: "#D89B24",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#7A8491",
    textAlign: "center",
    lineHeight: 23,
  },

  /* Form */

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 21,
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#123B63",
    marginBottom: 9,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7E0E8",
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,

    shadowColor: "#123B63",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,

    elevation: 1,
  },

  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#123B63",
    fontWeight: "500",
  },

  eyeButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  eyeIcon: {
    fontSize: 23,
  },

  /* Forgot Password */

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 25,
  },

  forgotText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },

  /* Login Button */

  loginButton: {
    height: 61,
    backgroundColor: "#064B78",
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",

    elevation: 6,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  /* Divider */

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 27,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 15,
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "700",
  },

  /* Create Account */

  createAccountButton: {
    height: 59,
    borderWidth: 2,
    borderColor: "#064B78",
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  createAccountText: {
    color: "#064B78",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /* Branding */

  branding: {
    alignItems: "center",
    marginTop: 50,
  },

  brandName: {
    fontSize: 23,
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