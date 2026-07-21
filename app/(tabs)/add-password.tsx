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
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

const DRAFT_KEY = "vamsi_vault_add_password_draft";

const CATEGORIES = [
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
];

export default function AddPasswordScreen() {
  // =========================
  // FORM STATES
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
  // APP SEARCH STATES
  // =========================

  const [appSuggestions, setAppSuggestions] =
    useState<any[]>([]);

  const [searchingApps, setSearchingApps] =
    useState(false);

  const [draftLoaded, setDraftLoaded] =
    useState(false);

  // =====================================================
  // LOAD SAVED FORM DATA
  // =====================================================

  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const savedDraft =
        await AsyncStorage.getItem(DRAFT_KEY);

      if (savedDraft) {
        const draft = JSON.parse(savedDraft);

        setAppName(draft.appName || "");
        setUsername(draft.username || "");
        setEmail(draft.email || "");
        setPassword(draft.password || "");
        setWebsite(draft.website || "");
        setCategory(draft.category || "Social");
      }
    } catch (error) {
      console.log(
        "Load draft error:",
        error
      );
    } finally {
      setDraftLoaded(true);
    }
  };

  // =====================================================
  // AUTOMATICALLY SAVE FORM DATA
  // =====================================================

  useEffect(() => {
    if (!draftLoaded) {
      return;
    }

    const saveDraft = async () => {
      try {
        const draft = {
          appName,
          username,
          email,
          password,
          website,
          category,
        };

        await AsyncStorage.setItem(
          DRAFT_KEY,
          JSON.stringify(draft)
        );
      } catch (error) {
        console.log(
          "Save draft error:",
          error
        );
      }
    };

    saveDraft();
  }, [
    appName,
    username,
    email,
    password,
    website,
    category,
    draftLoaded,
  ]);

  // =====================================================
  // SEARCH APP CATALOG
  // =====================================================

  useEffect(() => {
    const searchApps = async () => {
      const searchText =
        appName.trim();

      if (!searchText) {
        setAppSuggestions([]);
        return;
      }

      try {
        setSearchingApps(true);

        const {
          data,
          error,
        } = await supabase
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
      } catch (error) {
        console.log(
          "App search error:",
          error
        );

        setAppSuggestions([]);
      } finally {
        setSearchingApps(false);
      }
    };

    const timer = setTimeout(() => {
      searchApps();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [appName]);

  // =====================================================
  // SELECT APP
  // =====================================================

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

  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = async () => {
    setAppName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setWebsite("");
    setCategory("Social");

    setAppSuggestions([]);

    try {
      await AsyncStorage.removeItem(
        DRAFT_KEY
      );
    } catch (error) {
      console.log(
        "Clear draft error:",
        error
      );
    }
  };

  // =====================================================
  // SAVE PASSWORD
  // =====================================================

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
      } =
        await supabase.auth.getUser();

      if (!user) {
        setLoading(false);

        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace(
          "/(auth)/login"
        );

        return;
      }

      const {
        error,
      } = await supabase
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

      if (error) {
        setLoading(false);

        Alert.alert(
          "Save Failed",
          error.message
        );

        return;
      }

      // CLEAR LOCAL DRAFT
      await AsyncStorage.removeItem(
        DRAFT_KEY
      );

      // CLEAR FORM
      setAppName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setWebsite("");
      setCategory("Social");

      setLoading(false);

      Alert.alert(
        "Success",
        "Password saved successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace(
                "/(tabs)/dashboard"
              );
            },
          },
        ]
      );
    } catch (error) {
      setLoading(false);

      console.log(
        "Save password error:",
        error
      );

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scroll
          }
        >
          {/* =========================
              HEADER
          ========================== */}

          <View style={styles.header}>
            <Text
              style={styles.title}
            >
              Add Password
            </Text>

            <Text
              style={styles.subtitle}
            >
              Securely save your account details
            </Text>
          </View>

          {/* =========================
              APP / WEBSITE
          ========================== */}

          <Text
            style={styles.label}
          >
            App or Website
          </Text>

          <View
            style={styles.inputBox}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color="#7A8491"
            />

            <TextInput
              style={styles.input}
              placeholder="Search Instagram, Google..."
              placeholderTextColor="#9CA3AF"
              value={appName}
              onChangeText={setAppName}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
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

          {/* SEARCH LOADING */}

          {searchingApps && (
            <View
              style={
                styles.searchLoading
              }
            >
              <ActivityIndicator
                size="small"
                color="#064B78"
              />
            </View>
          )}

          {/* APP SUGGESTIONS */}

          {appSuggestions.length > 0 && (
            <View
              style={
                styles.suggestionBox
              }
            >
              {appSuggestions.map(
                (app) => (
                  <TouchableOpacity
                    key={app.id}
                    style={
                      styles.appSuggestion
                    }
                    onPress={() =>
                      selectApp(app)
                    }
                    activeOpacity={0.7}
                  >
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
                          style={
                            styles.logo
                          }
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="web"
                          size={24}
                          color="#374151"
                        />
                      )}
                    </View>

                    <Text
                      style={
                        styles.appName
                      }
                      numberOfLines={1}
                    >
                      {app.app_name}
                    </Text>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          {/* =========================
              USERNAME
          ========================== */}

          <Text
            style={styles.label}
          >
            Username
          </Text>

          <View
            style={styles.inputBox}
          >
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
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* =========================
              EMAIL
          ========================== */}

          <Text
            style={styles.label}
          >
            Email
          </Text>

          <View
            style={styles.inputBox}
          >
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
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* =========================
              PASSWORD
          ========================== */}

          <Text
            style={styles.label}
          >
            Password
          </Text>

          <View
            style={styles.inputBox}
          >
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
              secureTextEntry={
                hidePassword
              }
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
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

          <Text
            style={styles.label}
          >
            Website URL
          </Text>

          <View
            style={styles.inputBox}
          >
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
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="done"
            />
          </View>

          {/* =========================
              CATEGORY
          ========================== */}

          <Text
            style={styles.categoryTitle}
          >
            CATEGORY
          </Text>

          <View
            style={
              styles.categoryContainer
            }
          >
            {CATEGORIES.map(
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
                  activeOpacity={0.8}
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
                  style={
                    styles.saveText
                  }
                >
                  Save to Vault
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 50,
  },

  // HEADER

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

  // LABEL

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#123B63",
    marginTop: 20,
    marginBottom: 9,
    letterSpacing: 0.3,
  },

  // INPUT

  inputBox: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D7E0E8",
    borderRadius: 9,
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

  // SEARCH LOADING

  searchLoading: {
    paddingVertical: 12,
    alignItems: "center",
  },

  // SUGGESTIONS

  suggestionBox: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E0E8",
    borderRadius: 9,
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
    borderRadius: 9,
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

  // CATEGORY

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
    borderRadius: 9,
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

  // SAVE BUTTON

  saveButton: {
    height: 61,
    borderRadius: 9,
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