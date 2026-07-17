import React, { useEffect, useState } from "react";
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
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function AddPasswordScreen() {
  // =========================
  // PASSWORD FORM STATES
  // =========================

  const [appName, setAppName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");

  const [category, setCategory] = useState("Social");

  const [hidePassword, setHidePassword] = useState(true);

  const [loading, setLoading] = useState(false);

  // =========================
  // APP CATALOG STATES
  // =========================

  const [appSuggestions, setAppSuggestions] =
    useState<any[]>([]);

  const [searchingApps, setSearchingApps] =
    useState(false);

  // =========================
  // SEARCH APP CATALOG
  // =========================

  useEffect(() => {
    const searchApps = async () => {
      const searchText = appName.trim();

      if (!searchText) {
        setAppSuggestions([]);
        return;
      }

      try {
        setSearchingApps(true);

        const { data, error } = await supabase
          .from("app_catalog")
          .select("*")
          .ilike(
            "app_name",
            `%${searchText}%`
          )
          .limit(10);

        if (error) {
          console.log(
            "Search error:",
            error.message
          );

          setAppSuggestions([]);
        } else {
          setAppSuggestions(data || []);
        }

        setSearchingApps(false);

      } catch (error) {
        console.log(error);

        setSearchingApps(false);
      }
    };

    const timer = setTimeout(() => {
      searchApps();
    }, 300);

    return () => clearTimeout(timer);

  }, [appName]);

  // =========================
  // SELECT APP
  // =========================

  const selectApp = (app: any) => {
    setAppName(app.app_name);

    if (app.category) {
      setCategory(app.category);
    }

    if (app.website_url) {
      setWebsite(app.website_url);
    }

    setAppSuggestions([]);
  };

  // =========================
  // SAVE PASSWORD
  // =========================

  const savePassword = async () => {
    if (!appName.trim()) {
      Alert.alert(
        "Validation",
        "Please enter App or Website name."
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
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);

        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace("/(auth)/login");

        return;
      }

      const { error } = await supabase
        .from("passwords")
        .insert([
          {
            user_id: user.id,
            app_name: appName.trim(),
            username: username.trim(),
            email: email.trim(),
            password: password,
            website: website.trim(),
            category: category,
          },
        ]);

      setLoading(false);

      if (error) {
        Alert.alert(
          "Save Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Success",
        "Password saved successfully."
      );

      // CLEAR FORM

      setAppName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setWebsite("");
      setCategory("Social");

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

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* =========================
            HEADER
        ========================== */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Add Password
          </Text>

          <Text style={styles.subtitle}>
            Securely save your account details
          </Text>

        </View>

        {/* =========================
            APP / WEBSITE
        ========================== */}

        <Text style={styles.label}>
          App or Website
        </Text>

        <View style={styles.searchBox}>

          <Ionicons
            name="search-outline"
            size={22}
            color="#7A8491"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search Instagram, Google..."
            placeholderTextColor="#9CA3AF"
            value={appName}
            onChangeText={setAppName}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {appName.length > 0 && (

            <TouchableOpacity
              onPress={() => {
                setAppName("");
                setAppSuggestions([]);
              }}
            >

              <Ionicons
                name="close-circle"
                size={21}
                color="#9CA3AF"
              />

            </TouchableOpacity>

          )}

        </View>

        {/* =========================
            SEARCH LOADING
        ========================== */}

        {searchingApps && (

          <View style={styles.searchLoading}>

            <ActivityIndicator
              size="small"
              color="#064B78"
            />

          </View>

        )}

        {/* =========================
            APP SUGGESTIONS
        ========================== */}

        {appSuggestions.length > 0 && (

          <View style={styles.suggestionBox}>

            {appSuggestions.map((app) => (

              <TouchableOpacity
                key={app.id}
                style={styles.appSuggestion}
                onPress={() =>
                  selectApp(app)
                }
                activeOpacity={0.7}
              >

                {/* LOGO */}

                <View
                  style={
                    styles.logoContainer
                  }
                >

                  {app.logo_url ? (

                    <Image
                      source={{
                        uri: app.logo_url,
                      }}
                      style={styles.logo}
                    />

                  ) : (

                    <MaterialCommunityIcons
                      name="web"
                      size={24}
                      color="#374151"
                    />

                  )}

                </View>

                {/* APP NAME */}

                <Text
                  style={styles.appName}
                >
                  {app.app_name}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />

              </TouchableOpacity>

            ))}

          </View>

        )}

        {/* =========================
            USERNAME
        ========================== */}

        <Text style={styles.label}>
          Username
        </Text>

        <View style={styles.inputBox}>

          <Ionicons
            name="person-outline"
            size={22}
            color="#7A8491"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

        </View>

        {/* =========================
            EMAIL
        ========================== */}

        <Text style={styles.label}>
          Email
        </Text>

        <View style={styles.inputBox}>

          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color="#7A8491"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

        </View>

        {/* =========================
            PASSWORD
        ========================== */}

        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.inputBox}>

          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#7A8491"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
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
              size={23}
              color="#7A8491"
            />

          </TouchableOpacity>

        </View>

        {/* =========================
            WEBSITE
        ========================== */}

        <Text style={styles.label}>
          Website URL
        </Text>

        <View style={styles.inputBox}>

          <MaterialCommunityIcons
            name="link-variant"
            size={22}
            color="#7A8491"
          />

          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            placeholderTextColor="#9CA3AF"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
          />

        </View>

        {/* =========================
            CATEGORY
        ========================== */}

        <Text style={styles.categoryTitle}>
          CATEGORY
        </Text>

        <View
          style={
            styles.categoryContainer
          }
        >

          {[
            "Social",
            "Email",
            "Banking",
            "Shopping",
            "Development",
            "Gaming",
            "Education",
            "Work",
            "Entertainment",
            "Finance",
            "Travel",
            "Health",
            "Others",
          ].map((item) => (

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

          ))}

        </View>

        {/* =========================
            SAVE BUTTON
        ========================== */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePassword}
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
                name="lock-closed"
                size={21}
                color="#FFFFFF"
              />

              <Text
                style={styles.saveText}
              >
                Save to Vault
              </Text>

            </>

          )}

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    paddingHorizontal: 22,

    // MORE TOP SPACE
    paddingTop: 60,

    paddingBottom: 50,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 35,
    fontWeight: "900",
    color: "#123B63",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#7A8491",
    textAlign: "center",
  },

  // =========================
  // LABEL
  // =========================

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#123B63",
    marginTop: 20,
    marginBottom: 9,
    letterSpacing: 0.3,
  },

  // =========================
  // SEARCH
  // =========================

  searchBox: {
    height: 58,

    borderWidth: 1,
    borderColor: "#D7E0E8",

    borderRadius: 17,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,

    backgroundColor: "#F8FAFC",
  },

  searchInput: {
    flex: 1,

    marginLeft: 11,

    fontSize: 16,

    color: "#123B63",

    fontWeight: "500",
  },

  // =========================
  // INPUT
  // =========================

  inputBox: {
    height: 58,

    borderWidth: 1,
    borderColor: "#D7E0E8",

    borderRadius: 17,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 16,

    backgroundColor: "#F8FAFC",
  },

  input: {
    flex: 1,

    marginLeft: 11,

    fontSize: 16,

    color: "#123B63",

    fontWeight: "500",
  },

  // =========================
  // SEARCH LOADING
  // =========================

  searchLoading: {
    paddingVertical: 12,

    alignItems: "center",
  },

  // =========================
  // SUGGESTIONS
  // =========================

  suggestionBox: {
    marginTop: 8,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D7E0E8",

    borderRadius: 17,

    overflow: "hidden",

    elevation: 3,
  },

  appSuggestion: {
    minHeight: 70,

    paddingHorizontal: 14,

    flexDirection: "row",

    alignItems: "center",

    borderBottomWidth: 1,

    borderBottomColor: "#F3F4F6",
  },

  logoContainer: {
    width: 44,

    height: 44,

    borderRadius: 12,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",
  },

  logo: {
    width: 44,

    height: 44,

    resizeMode: "contain",
  },

  appName: {
    flex: 1,

    marginLeft: 13,

    fontSize: 16,

    fontWeight: "700",

    color: "#123B63",
  },

  // =========================
  // CATEGORY
  // =========================

  categoryTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: "#123B63",

    marginTop: 30,

    marginBottom: 12,

    letterSpacing: 1,
  },

  categoryContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 10,
  },

  categoryChip: {
    paddingHorizontal: 16,

    height: 42,

    borderRadius: 21,

    borderWidth: 1,

    borderColor: "#D7E0E8",

    backgroundColor: "#FFFFFF",

    justifyContent: "center",

    alignItems: "center",
  },

  selectedCategory: {
    backgroundColor: "#064B78",

    borderColor: "#064B78",
  },

  categoryText: {
    fontSize: 13,

    fontWeight: "600",

    color: "#7A8491",
  },

  selectedCategoryText: {
    color: "#FFFFFF",
  },

  // =========================
  // SAVE BUTTON
  // =========================

  saveButton: {
    height: 61,

    borderRadius: 17,

    backgroundColor: "#064B78",

    marginTop: 34,

    flexDirection: "row",

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

  saveText: {
    color: "#FFFFFF",

    fontSize: 17,

    fontWeight: "800",

    marginLeft: 9,

    letterSpacing: 0.3,
  },

});

