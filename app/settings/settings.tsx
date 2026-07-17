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
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";

export default function SettingsScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] =
    useState(true);

  const [loading, setLoading] = useState(false);

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

    if (!confirmPassword.trim()) {
      Alert.alert(
        "Validation",
        "Please confirm your password."
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* TOP SPACE */}

        <View style={styles.topSpace} />

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Change Password
          </Text>

          <Text style={styles.subtitle}>
            Update your password to keep your account secure.
          </Text>
        </View>

        {/* PASSWORD SECTION */}

        <View style={styles.passwordCard}>

          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#064B78"
              />
            </View>

            <View>
              <Text style={styles.cardTitle}>
                New Password
              </Text>

              <Text style={styles.cardSubtitle}>
                Create a strong password
              </Text>
            </View>
          </View>

          {/* NEW PASSWORD */}

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="key-outline"
              size={21}
              color="#064B78"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={hideNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setHideNewPassword(
                  !hideNewPassword
                )
              }
            >
              <Ionicons
                name={
                  hideNewPassword
                    ? "eye-outline"
                    : "eye-off-outline"
                }
                size={23}
                color="#6B7280"
              />
            </TouchableOpacity>

          </View>

          {/* CONFIRM PASSWORD */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color="#064B78"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
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
                size={23}
                color="#6B7280"
              />
            </TouchableOpacity>

          </View>

          {/* CHANGE BUTTON */}

          <TouchableOpacity
            style={styles.button}
            onPress={changePassword}
            disabled={loading}
            activeOpacity={0.85}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.buttonText}>
                  Change Password
                </Text>
              </>

            )}

          </TouchableOpacity>

        </View>

        {/* APP VERSION */}

        <View style={styles.versionCard}>

          <Ionicons
            name="shield-checkmark-outline"
            size={25}
            color="#064B78"
          />

          <View style={styles.versionTextContainer}>

            <Text style={styles.versionTitle}>
              Vamsi Vault
            </Text>

            <Text style={styles.versionText}>
              Version 1.0.0
            </Text>

          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  topSpace: {
    height: 55,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#123047",
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 22,
  },

  passwordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#E8F2F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#123047",
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#7B8790",
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 14,
  },

  inputContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: "#DCE5EA",
    borderRadius: 16,
    backgroundColor: "#FAFCFD",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 11,
    marginRight: 10,
    fontSize: 16,
    color: "#1F2937",
  },

  button: {
    height: 59,
    borderRadius: 17,
    backgroundColor: "#064B78",
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 9,
  },

  versionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  versionTextContainer: {
    marginLeft: 13,
  },

  versionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#123047",
  },

  versionText: {
    fontSize: 13,
    color: "#7B8790",
    marginTop: 3,
  },

});