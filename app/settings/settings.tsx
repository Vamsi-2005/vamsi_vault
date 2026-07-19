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
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";

export default function SettingsScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] =
    useState(true);

  const [loading, setLoading] = useState(false);

  // =====================================
  // CHANGE PASSWORD
  // =====================================

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

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Change Password
          </Text>

          <Text style={styles.subtitle}>
            Update your password to keep your account secure.
          </Text>

        </View>

        {/* =====================================
            MAIN PASSWORD CARD
        ===================================== */}

        <View style={styles.passwordCard}>

          {/* CARD HEADER */}

          <View style={styles.cardHeader}>

            <View>

              <Text style={styles.cardTitle}>
                New Password
              </Text>

              <Text style={styles.cardSubtitle}>
                Create a strong password
              </Text>

            </View>

          </View>

          {/* =====================================
              NEW PASSWORD
          ===================================== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              New Password
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="key-outline"
                size={21}
                color="#334155"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#94A3B8"
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
                style={styles.eyeButton}
              >

                <Ionicons
                  name={
                    hideNewPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#94A3B8"
                />

              </TouchableOpacity>

            </View>

          </View>

          {/* =====================================
              CONFIRM PASSWORD
          ===================================== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#334155"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
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
                style={styles.eyeButton}
              >

                <Ionicons
                  name={
                    hideConfirmPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={22}
                  color="#94A3B8"
                />

              </TouchableOpacity>

            </View>

          </View>

          {/* =====================================
              CHANGE PASSWORD BUTTON
          ===================================== */}

          <TouchableOpacity
            style={[
              styles.changeButton,
              loading && styles.disabledButton,
            ]}
            onPress={changePassword}
            disabled={loading}
            activeOpacity={0.8}
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

        {/* =====================================
            FOOTER BRANDING
        ===================================== */}

        <View style={styles.versionCard}>

          <View style={styles.footerIconBox}>

            <Ionicons
              name="shield-checkmark-outline"
              size={25}
              color="#2563EB"
            />

          </View>

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


// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 160,
  },

  // =====================================
  // HEADER
  // =====================================

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E3A5F",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },

  // =====================================
  // PASSWORD CARD
  // =====================================

  passwordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 28,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  // =====================================
  // CARD HEADER
  // =====================================

  cardHeader: {
   alignItems: "center",
   justifyContent:"center",
    marginBottom: 30,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  cardTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  cardSubtitle: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 6,
    textAlign: "center"
  },

  // =====================================
  // INPUT GROUP
  // =====================================

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  inputContainer: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#CBD5E1",

    borderRadius: 7,

    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,

    fontSize: 15,
    color: "#334155",
  },

  eyeButton: {
    padding: 3,
  },

  // =====================================
  // CHANGE PASSWORD BUTTON
  // =====================================

  changeButton: {
    height: 62,

    marginTop: 6,

    backgroundColor: "#064B78",

    borderRadius: 7,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#1E3A8A",
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

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 9,
  },

  // =====================================
  // FOOTER BRANDING
  // =====================================

  versionCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    padding: 20,

    marginTop: 24,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 5,

    elevation: 1,
  },

  footerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  versionTextContainer: {
    marginLeft: 14,
  },

  versionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
  },

  versionText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

});

