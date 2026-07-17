import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function EditPasswordScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [appName, setAppName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [logoUrl, setLogoUrl] =
    useState<string | null>(null);

  const [hidePassword, setHidePassword] =
    useState(true);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = [
    "Social",
    "Email",
    "Banking",
    "Shopping",
    "Work",
    "Development",
    "Gaming",
    "Entertainment",
    "Education",
    "Cloud",
    "Other",
  ];

  // =====================================
  // LOAD PASSWORD
  // =====================================

  useEffect(() => {
    if (id) {
      loadPassword();
    }
  }, [id]);

  const loadPassword = async () => {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("passwords")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert(
          "Error",
          error.message
        );

        setLoading(false);

        return;
      }

      setAppName(
        data.app_name || ""
      );

      setUsername(
        data.username || ""
      );

      setEmail(
        data.email || ""
      );

      setPassword(
        data.password || ""
      );

      setWebsite(
        data.website || ""
      );

      setCategory(
        data.category || ""
      );

      // =====================================
      // LOAD LOGO
      // =====================================

      const {
        data: catalogApp,
        error: catalogError,
      } = await supabase
        .from("app_catalog")
        .select("logo_url")
        .ilike(
          "app_name",
          data.app_name
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
        "Unable to load password."
      );
    }
  };

  // =====================================
  // UPDATE PASSWORD
  // =====================================

  const updatePassword = async () => {
    if (!appName.trim()) {
      Alert.alert(
        "Validation",
        "Please enter App Name."
      );

      return;
    }

    if (!username.trim()) {
      Alert.alert(
        "Validation",
        "Please enter Username."
      );

      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Validation",
        "Please enter Password."
      );

      return;
    }

    try {
      setSaving(true);

      const {
        error,
      } = await supabase
        .from("passwords")
        .update({
          app_name: appName.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password,
          website: website.trim(),
          category: category,
        })
        .eq("id", id);

      setSaving(false);

      if (error) {
        Alert.alert(
          "Update Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Updated",
        "Password updated successfully."
      );

      router.replace({
        pathname:
          "/password/details",
        params: {
          id: String(id),
        },
      });

    } catch (error) {
      setSaving(false);

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
        style={
          styles.loadingContainer
        }
      >
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#064B78"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading account...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="dark" />

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

        {/* HEADER */}

        <View
          style={styles.headerCard}
        >

          {/* LOGO */}

          <View
            style={styles.logoBox}
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

              <Text
                style={styles.logoLetter}
              >
                {appName
                  ?.charAt(0)
                  ?.toUpperCase()}
              </Text>

            )}

          </View>

          {/* APP NAME */}

          <View
            style={styles.headerText}
          >

            <Text
              style={styles.appName}
            >
              {appName}
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Edit Account
            </Text>

          </View>

        </View>

        {/* DIVIDER */}

        <View
          style={styles.divider}
        />

        {/* ACCOUNT DETAILS */}

        <Text
          style={styles.sectionTitle}
        >
          ACCOUNT DETAILS
        </Text>

        {/* APP NAME */}

        <Text
          style={styles.label}
        >
          App / Website Name
        </Text>

        <View
          style={styles.inputCard}
        >

          <Ionicons
            name="apps-outline"
            size={21}
            color="#064B78"
          />

          <TextInput
            style={styles.input}
            value={appName}
            onChangeText={setAppName}
            placeholder="Instagram"
            placeholderTextColor="#A8A29E"
          />

        </View>

        {/* USERNAME */}

        <Text
          style={styles.label}
        >
          Username
        </Text>

        <View
          style={styles.inputCard}
        >

          <Ionicons
            name="person-outline"
            size={21}
            color="#064B78"
          />

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#A8A29E"
            autoCapitalize="none"
          />

        </View>

        {/* EMAIL */}

        <Text
          style={styles.label}
        >
          Email
        </Text>

        <View
          style={styles.inputCard}
        >

          <Ionicons
            name="mail-outline"
            size={21}
            color="#064B78"
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            placeholderTextColor="#A8A29E"
            keyboardType="email-address"
            autoCapitalize="none"
          />

        </View>

        {/* PASSWORD */}

        <Text
          style={styles.label}
        >
          Password
        </Text>

        <View
          style={styles.inputCard}
        >

          <Ionicons
            name="lock-closed-outline"
            size={21}
            color="#064B78"
          />

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#A8A29E"
            secureTextEntry={
              hidePassword
            }
          />

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
              color="#78716C"
            />

          </TouchableOpacity>

        </View>

        {/* WEBSITE */}

        <Text
          style={styles.label}
        >
          Website URL
        </Text>

        <View
          style={styles.inputCard}
        >

          <Ionicons
            name="globe-outline"
            size={21}
            color="#064B78"
          />

          <TextInput
            style={styles.input}
            value={website}
            onChangeText={setWebsite}
            placeholder="https://example.com"
            placeholderTextColor="#A8A29E"
            autoCapitalize="none"
            keyboardType="url"
          />

        </View>

        {/* CATEGORY */}

        <Text
          style={styles.categoryTitle}
        >
          CATEGORY
        </Text>

        <View
          style={styles.categoryContainer}
        >

          {categories.map(
            (item) => (

              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,

                  category === item &&
                    styles.selectedCategory,
                ]}
                onPress={() =>
                  setCategory(item)
                }
              >

                <Text
                  style={[
                    styles.categoryText,

                    category === item &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {item}
                </Text>

              </TouchableOpacity>

            )
          )}

        </View>

        {/* SAVE CHANGES BUTTON */}

        <TouchableOpacity
          style={
            styles.updateButton
          }
          onPress={
            updatePassword
          }
          disabled={saving}
          activeOpacity={0.85}
        >

          {saving ? (

            <ActivityIndicator
              color="#FFFFFF"
            />

          ) : (

            <>

              <Ionicons
                name="checkmark-circle-outline"
                size={23}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.updateText
                }
              >
                Save Changes
              </Text>

            </>

          )}

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
  // HEADER
  // =====================================

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 3,
  },

  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  logo: {
    width: 60,
    height: 60,
  },

  logoLetter: {
    fontSize: 32,
    fontWeight: "900",
    color: "#064B78",
  },

  headerText: {
    marginLeft: 18,
    flex: 1,
  },

  // TOP HEADER APP NAME COLOR

  appName: {
    fontSize: 25,
    fontWeight: "900",
    color: "#064B78",
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#78716C",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E7E5E4",
    marginVertical: 25,
  },

  // =====================================
  // SECTION
  // =====================================

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#57534E",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#57534E",
    marginBottom: 8,
    marginTop: 12,
  },

  // =====================================
  // INPUT
  // =====================================

  inputCard: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#292524",
  },

  // =====================================
  // CATEGORY
  // =====================================

  categoryTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#57534E",
    marginTop: 28,
    marginBottom: 13,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryChip: {
    paddingHorizontal: 17,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedCategory: {
    backgroundColor: "#064B78",
    borderColor: "#064B78",
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#78716C",
  },

  selectedCategoryText: {
    color: "#FFFFFF",
  },

  // =====================================
  // SAVE CHANGES BUTTON
  // =====================================

  updateButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#064B78",
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 4,
  },

  updateText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginLeft: 9,
  },

});