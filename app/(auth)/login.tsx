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
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password.");
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
    } catch (err) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.back}>
          ← Back
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.icon}>
          🔐
        </Text>

        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to your account
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={hidePassword}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() =>
          setHidePassword(!hidePassword)
        }
      >
        <Text style={styles.showPassword}>
          {hidePassword
            ? "Show Password"
            : "Hide Password"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/(auth)/forgot-password")
        }
      >
        <Text style={styles.forgot}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.replace("/(auth)/register")
        }
      >        <Text style={styles.register}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  back: {
    marginTop: 10,
    marginBottom: 20,
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  icon: {
    fontSize: 70,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
  },

  subtitle: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 15,
  },

  showPassword: {
    alignSelf: "flex-end",
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10,
  },

  forgot: {
    alignSelf: "flex-end",
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 25,
  },

  button: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  register: {
    marginTop: 25,
    textAlign: "center",
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
});