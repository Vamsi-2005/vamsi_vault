import React, { useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
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
  const [biometricEnabled, setBiometricEnabled] =
    useState(true);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  // =====================================
  // LOGOUT
  // =====================================

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
      setLogoutLoading(true);

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        setLogoutLoading(false);

        Alert.alert(
          "Logout Failed",
          error.message
        );

        return;
      }

      setLogoutLoading(false);

      router.replace("/home");

    } catch (error) {
      setLogoutLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  // =====================================
  // SETTINGS ROW
  // =====================================

  const SettingsRow = ({
    icon,
    title,
    onPress,
  }: {
    icon: any;
    title: string;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.7}
      >

        <View style={styles.rowLeft}>

          <View style={styles.iconBox}>

            <Ionicons
              name={icon}
              size={22}
              color="#003456"
            />

          </View>

          <Text style={styles.rowText}>
            {title}
          </Text>

        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#727780"
        />

      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >

      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* =====================================
            SETTINGS HEADING
        ===================================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            SETTINGS
          </Text>

        </View>

        {/* =====================================
            SECURITY
        ===================================== */}

        <Text style={styles.sectionTitle}>
          SECURITY
        </Text>

        <View style={styles.card}>

          {/* CHANGE PASSWORD */}

          <SettingsRow
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() =>
              router.push(
                "/password/change-password"
              )
            }
          />

          <View style={styles.divider} />

          {/* BIOMETRIC LOCK */}

          <View style={styles.row}>

            <View style={styles.rowLeft}>

              <View style={styles.iconBox}>

                <Ionicons
                  name="finger-print-outline"
                  size={23}
                  color="#003456"
                />

              </View>

              <Text style={styles.rowText}>
                Biometric Lock
              </Text>

            </View>

            {/* UI ONLY TOGGLE */}

            <TouchableOpacity
              style={[
                styles.toggle,
                biometricEnabled &&
                  styles.toggleActive,
              ]}
              onPress={() =>
                setBiometricEnabled(
                  !biometricEnabled
                )
              }
              activeOpacity={0.8}
            >

              <View
                style={[
                  styles.toggleCircle,
                  biometricEnabled &&
                    styles.toggleCircleActive,
                ]}
              />

            </TouchableOpacity>

          </View>

        </View>

        {/* =====================================
            INFORMATION
        ===================================== */}

        <Text style={styles.sectionTitle}>
          INFORMATION
        </Text>

        <View style={styles.card}>

          {/* PRIVACY POLICY */}

          <SettingsRow
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() =>
              router.push(
                "/settings/privacy-policy"
              )
            }
          />

          <View style={styles.divider} />

          {/* CONTACT SUPPORT */}

          <SettingsRow
            icon="chatbubble-ellipses-outline"
            title="Contact Support"
            onPress={() =>
              router.push(
                "/settings/contact-support"
              )
            }
          />

          <View style={styles.divider} />

          {/* ABOUT */}

          <SettingsRow
            icon="information-circle-outline"
            title="About"
            onPress={() =>
              router.push(
                "/settings/about"
              )
            }
          />

          <View style={styles.divider} />

          {/* APP VERSION */}

          <View style={styles.row}>

            <View style={styles.rowLeft}>

              <View style={styles.iconBox}>

                <Ionicons
                  name="code-slash-outline"
                  size={22}
                  color="#003456"
                />

              </View>

              <View>

                <Text
                  style={styles.rowText}
                >
                  App Version
                </Text>

                <Text
                  style={styles.smallText}
                >
                  Current installation
                </Text>

              </View>

            </View>

            <View
              style={styles.versionBadge}
            >

              <Text
                style={styles.versionText}
              >
                v1.0.0
              </Text>

            </View>

          </View>

        </View>

        {/* =====================================
            ACCOUNT
        ===================================== */}

        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutCard}
          onPress={logout}
          disabled={logoutLoading}
          activeOpacity={0.7}
        >

          <View style={styles.rowLeft}>

            <View
              style={
                styles.logoutIconBox
              }
            >

              <Ionicons
                name="log-out-outline"
                size={22}
                color="#BA1A1A"
              />

            </View>

            <Text
              style={styles.logoutText}
            >
              Logout
            </Text>

          </View>

          {logoutLoading ? (

            <ActivityIndicator
              color="#BA1A1A"
            />

          ) : (

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#BA1A1A"
            />

          )}

        </TouchableOpacity>

        {/* =====================================
            FOOTER
        ===================================== */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Vamsi Vault v1.0.0
          </Text>

          <Text style={styles.footerSubText}>
            Securely protect your digital life
          </Text>

        </View>

      </ScrollView>

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
    backgroundColor: "#F7F9FB",
  },

  // =====================================
  // MAIN SCROLL
  // =====================================

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },

  // =====================================
  // SETTINGS HEADING
  // =====================================

  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",

    // IMPORTANT:
    // No extra space below SETTINGS

    marginBottom: 0,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#003456",
    letterSpacing: 1.5,
  },

  // =====================================
  // SECTION TITLE
  // =====================================

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#727780",
    letterSpacing: 1.5,

    marginTop: 10,
    marginBottom: 10,

    paddingHorizontal: 4,
  },

  // =====================================
  // CARD
  // =====================================

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 9,

    overflow: "hidden",

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
  // ROW
  // =====================================

  row: {
    minHeight: 72,

    paddingHorizontal: 20,

    paddingVertical: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  // =====================================
  // ROW LEFT
  // =====================================

  rowLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  // =====================================
  // ICON BOX
  // =====================================

  iconBox: {
    width: 42,

    height: 42,

    borderRadius: 9,

    backgroundColor: "#ECEEF0",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 15,
  },

  // =====================================
  // ROW TEXT
  // =====================================

  rowText: {
    fontSize: 16,

    color: "#191C1E",

    fontWeight: "500",
  },

  // =====================================
  // SMALL TEXT
  // =====================================

  smallText: {
    fontSize: 12,

    color: "#727780",

    marginTop: 3,
  },

  // =====================================
  // DIVIDER
  // =====================================

  divider: {
    height: 1,

    backgroundColor: "#E6E8EA",

    marginHorizontal: 20,
  },

  // =====================================
  // BIOMETRIC TOGGLE
  // =====================================

  toggle: {
    width: 52,

    height: 30,

    borderRadius: 9,

    backgroundColor: "#C1C7D0",

    justifyContent: "center",

    paddingHorizontal: 3,
  },

  toggleActive: {
    backgroundColor: "#064B78",
  },

  toggleCircle: {
    width: 24,

    height: 24,

    borderRadius: 9,

    backgroundColor: "#FFFFFF",
  },

  toggleCircleActive: {
    alignSelf: "flex-end",
  },

  // =====================================
  // VERSION BADGE
  // =====================================

  versionBadge: {
    backgroundColor: "#ECEEF0",

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 9,
  },

  versionText: {
    fontSize: 12,

    color: "#727780",

    fontWeight: "600",
  },

  // =====================================
  // LOGOUT
  // =====================================

  logoutCard: {
    minHeight: 72,

    paddingHorizontal: 20,

    paddingVertical: 14,

    backgroundColor: "#FFF1F0",

    borderWidth: 1,

    borderColor: "#FFDAD6",

    borderRadius: 9,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  logoutIconBox: {
    width: 42,

    height: 42,

    borderRadius: 9,

    backgroundColor: "#FFE4E1",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 15,
  },

  logoutText: {
    fontSize: 16,

    fontWeight: "700",

    color: "#BA1A1A",
  },

  // =====================================
  // FOOTER
  // =====================================

  footer: {
    alignItems: "center",

    marginTop: 35,

    opacity: 0.6,
  },

  footerText: {
    fontSize: 12,

    color: "#727780",

    fontWeight: "600",
  },

  footerSubText: {
    fontSize: 11,

    color: "#727780",

    marginTop: 5,
  },

});