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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
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

  const [loading, setLoading] = useState(false);

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
            emailRedirectTo: "vamsivault://",
            data: {
              full_name: name.trim(),
            },
          },
        });

      setLoading(false);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("already") ||
          error.message
            .toLowerCase()
            .includes("registered")
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

        {/* Header */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Create{" "}
            <Text style={styles.titleAccent}>
              Account
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Join Vamsi Vault today and secure your passwords
          </Text>

        </View>

        {/* Form */}

        <View style={styles.form}>

          {/* Full Name */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Full Name
            </Text>

            <View style={styles.inputWrapper}>

              <Text style={styles.inputIcon}>
                👤
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

            </View>

          </View>

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
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={hidePassword}
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
                <Text style={styles.eyeIcon}>
                  {hidePassword
                    ? "🙈"
                    : "👁️"}
                </Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* Confirm Password */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.inputWrapper}>

              <Text style={styles.inputIcon}>
                🔒
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={
                  hideConfirmPassword
                }
                value={confirmPassword}
                onChangeText={
                  setConfirmPassword
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
                <Text style={styles.eyeIcon}>
                  {hideConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* Register Button */}

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading &&
                styles.registerButtonDisabled,
            ]}
            onPress={register}
            disabled={loading}
          >

            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.registerButtonText}>
                CREATE ACCOUNT
              </Text>
            )}

          </TouchableOpacity>

        </View>

        {/* Login Link - Single Line */}

        <View style={styles.loginContainer}>

          <Text style={styles.loginQuestion}>
            Already have an account?  {" "}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.replace(
                "/(auth)/login"
              )
            }
          >
            <Text style={styles.loginText}>
              LOGIN
            </Text>
          </TouchableOpacity>

        </View>

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
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 130,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#123B63",
    textAlign: "center",
  },

  titleAccent: {
    color: "#D89B24",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#7A8491",
    textAlign: "center",
  },

  form: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#123B63",
    marginBottom: 6,
  },

  inputWrapper: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7E0E8",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#123B63",
  },

  eyeButton: {
    width: 38,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  eyeIcon: {
    fontSize: 21,
  },

  registerButton: {
    height: 55,
    backgroundColor: "#064B78",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,

    elevation: 5,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  loginQuestion: {
    fontSize: 13,
    color: "#7A8491",
  },

  loginText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#2563EB",
    letterSpacing: 0.5,
  },

  branding: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 20,
  },

  brandName: {
    fontSize: 21,
    fontWeight: "900",
    color: "#123B63",
  },

  brandAccent: {
    color: "#D89B24",
  },

  brandSubtitle: {
    marginTop: 5,
    fontSize: 11,
    color: "#A5ADB7",
    letterSpacing: 0.4,
  },

});