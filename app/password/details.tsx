import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function PasswordDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [hidePassword, setHidePassword] =
    useState(true);

  const [passwordData, setPasswordData] =
    useState<any>(null);

  const [logoUrl, setLogoUrl] =
    useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPassword();
    }
  }, [id]);

  // =====================================
  // LOAD PASSWORD + APP LOGO
  // =====================================

  const loadPassword = async () => {
    try {
      setLoading(true);

      // LOAD PASSWORD DETAILS
      const {
        data: password,
        error: passwordError,
      } = await supabase
        .from("passwords")
        .select("*")
        .eq("id", id)
        .single();

      if (passwordError) {
        Alert.alert(
          "Error",
          passwordError.message
        );

        setLoading(false);

        return;
      }

      setPasswordData(password);

      // LOAD APP LOGO FROM APP CATALOG
      const {
        data: catalogApp,
        error: catalogError,
      } = await supabase
        .from("app_catalog")
        .select("logo_url")
        .ilike(
          "app_name",
          password.app_name
        )
        .maybeSingle();

      if (
        !catalogError &&
        catalogApp?.logo_url
      ) {
        setLogoUrl(
          catalogApp.logo_url
        );
      }

      setLoading(false);

    } catch (error) {
      console.log(error);

      setLoading(false);

      Alert.alert(
        "Error",
        "Unable to load password details."
      );
    }
  };

  // =====================================
  // DELETE PASSWORD
  // =====================================

  const deletePassword = () => {
    Alert.alert(
      "Delete Password",
      "Are you sure you want to delete this password?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);

      const {
        error,
      } = await supabase
        .from("passwords")
        .delete()
        .eq("id", id);

      setLoading(false);

      if (error) {
        Alert.alert(
          "Delete Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Deleted",
        "Password deleted successfully."
      );

      router.replace(
        "/(tabs)/dashboard"
      );

    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#064B78"
        />

        <Text
          style={styles.loadingText}
        >
          Loading details...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================
  // MAIN SCREEN
  // =====================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* TOP SPACE */}

        <View
          style={styles.topSpace}
        />

        {/* APP HEADER */}

        <View
          style={styles.appHeader}
        >

          {/* LOGO BOX */}

          <View
            style={styles.logoContainer}
          >

            {logoUrl ? (

              <Image
                source={{
                  uri: logoUrl,
                }}
                style={styles.logo}
                resizeMode="contain"
              />

            ) : (

              <View
                style={styles.defaultLogo}
              >

                <Text
                  style={
                    styles.defaultLogoText
                  }
                >
                  {passwordData?.app_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </Text>

              </View>

            )}

          </View>

          {/* APP NAME */}

          <View
            style={styles.appTitleContainer}
          >

            <Text
              style={styles.appName}
            >
              {passwordData?.app_name}
            </Text>

            <Text
              style={styles.appSubtitle}
            >
              Account Details
            </Text>

          </View>

        </View>

        {/* ACCOUNT INFORMATION */}

        <Text
          style={styles.sectionTitle}
        >
          ACCOUNT INFORMATION
        </Text>

        {/* USERNAME */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.infoLabel}
          >
            Username
          </Text>

          <Text
            style={styles.infoValue}
          >
            {passwordData?.username ||
              "Not Available"}
          </Text>

        </View>

        {/* EMAIL */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.infoLabel}
          >
            Email
          </Text>

          <Text
            style={styles.infoValue}
          >
            {passwordData?.email ||
              "Not Available"}
          </Text>

        </View>

        {/* PASSWORD */}

        <View
          style={styles.infoCard}
        >

          <View
            style={styles.passwordHeader}
          >

            <Text
              style={styles.infoLabel}
            >
              Password
            </Text>

            <TouchableOpacity
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
                color="#064B78"
              />

            </TouchableOpacity>

          </View>

          <Text
            style={styles.infoValue}
          >
            {hidePassword
              ? "••••••••••••"
              : passwordData?.password}
          </Text>

        </View>

        {/* WEBSITE */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.infoLabel}
          >
            Website
          </Text>

          <Text
            style={styles.websiteValue}
          >
            {passwordData?.website ||
              "Not Available"}
          </Text>

        </View>

        {/* CATEGORY */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.infoLabel}
          >
            Category
          </Text>

          <Text
            style={styles.infoValue}
          >
            {passwordData?.category ||
              "Not Available"}
          </Text>

        </View>

        {/* ACTIONS */}

        <Text
          style={[
            styles.sectionTitle,
            styles.actionsTitle,
          ]}
        >
          ACTIONS
        </Text>

        {/* EDIT BUTTON */}

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname:
                "/password/edit",
              params: {
                id: passwordData?.id,
              },
            })
          }
        >

          <Text
            style={styles.editButtonText}
          >
            Edit Password
          </Text>

        </TouchableOpacity>

        {/* DELETE BUTTON */}

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={deletePassword}
        >

          <Text
            style={styles.deleteButtonText}
          >
            Delete Password
          </Text>

        </TouchableOpacity>

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
    backgroundColor: "#FAFAF9",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  topSpace: {
    height: 35,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#78716C",
  },

  // =====================================
  // APP HEADER
  // =====================================

  appHeader: {
    backgroundColor: "#064B78",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",

    marginTop: 20,
    marginBottom: 32,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 5,
  },

  // =====================================
  // WHITE LOGO BOX
  // =====================================

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  logo: {
    width: 60,
    height: 60,
  },

  defaultLogo: {
    width: 76,
    height: 76,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",
  },

  defaultLogoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#064B78",
  },

  // =====================================
  // APP NAME
  // =====================================

  appTitleContainer: {
    marginLeft: 18,
    flex: 1,
  },

  appName: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  appSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#D7E8F2",
    fontWeight: "500",
  },

  // =====================================
  // SECTION
  // =====================================

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#57534E",
    marginBottom: 14,
  },

  actionsTitle: {
    marginTop: 18,
  },

  // =====================================
  // INFORMATION CARDS
  // =====================================

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 13,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#78716C",
    marginBottom: 8,
  },

  infoValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#292524",
  },

  websiteValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#064B78",
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // =====================================
  // EDIT BUTTON
  // =====================================

  editButton: {
    height: 58,
    borderRadius: 17,

    backgroundColor: "#064B78",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 14,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 5,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  // =====================================
  // DELETE BUTTON
  // =====================================

  deleteButton: {
    height: 58,
    borderRadius: 17,

    backgroundColor: "#FEF2F2",

    borderWidth: 1,
    borderColor: "#FECACA",

    justifyContent: "center",
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#DC2626",
    fontSize: 17,
    fontWeight: "800",
  },

});