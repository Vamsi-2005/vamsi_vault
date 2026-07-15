import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { supabase } from "../../services/supabase";

export default function SettingsScreen() {
  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [hidePassword, setHidePassword] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const changePassword = async () => {

    if (!newPassword.trim()) {

      Alert.alert(
        "Validation",
        "Please enter a new password."
      );

      return;
    }

    if (newPassword.length < 6) {

      Alert.alert(
        "Validation",
        "Password must be at least 6 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {

      Alert.alert(
        "Validation",
        "Passwords do not match."
      );

      return;
    }

    try {

      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      setLoading(false);

      if (error) {

        Alert.alert(
          "Update Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Success",
        "Password updated successfully."
      );

      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {

      setLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }

  };

  const logout = () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: confirmLogout,
        },
      ]
    );

  };

  const confirmLogout = async () => {

    try {

      const { error } =
        await supabase.auth.signOut();

      if (error) {

        Alert.alert(
          "Logout Failed",
          error.message
        );

        return;
      }

      router.replace("/home");

    } catch (error) {

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }

  };

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
                <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          ⚙️ Settings
        </Text>

        <Text style={styles.subtitle}>
          Manage your account settings.
        </Text>

        {/* Change Password */}

        <Text style={styles.label}>
          🔐 New Password
        </Text>

        <View style={styles.passwordContainer}>

          <TextInput
            style={styles.passwordInput}
            placeholder="Enter New Password"
            secureTextEntry={hidePassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Text style={styles.show}>
              {hidePassword ? "👁" : "🙈"}
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.label}>
          🔒 Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={hidePassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={changePassword}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.buttonText}>
              🔐 Change Password
            </Text>

          )}

        </TouchableOpacity>

        {/* Logout */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            🚪 Logout
          </Text>
        </TouchableOpacity>

        {/* App Version */}

        <View style={styles.versionCard}>

          <Text style={styles.versionTitle}>
            📱 App Version
          </Text>

          <Text style={styles.versionText}>
            Version 1.0.0
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    height: 55,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    height: 55,
    paddingHorizontal: 16,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  show: {
    fontSize: 22,
    marginLeft: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    elevation: 3,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  versionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 35,
    alignItems: "center",
    elevation: 2,
  },

  versionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },

  versionText: {
    fontSize: 16,
    color: "#666",
  },
});

