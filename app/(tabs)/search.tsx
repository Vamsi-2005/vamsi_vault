import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function SearchScreen() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [passwords, setPasswords] = useState<any[]>([]);

  const [filteredPasswords, setFilteredPasswords] = useState<any[]>([]);

  // ================================
  // LOAD PASSWORDS
  // ================================

  useEffect(() => {
    loadPasswords();
  }, []);

  // ================================
  // SEARCH FILTER
  // ================================

  useEffect(() => {
    const searchText = search.trim().toLowerCase();

    if (searchText === "") {
      setFilteredPasswords(passwords);
      return;
    }

    const filtered = passwords.filter((item) =>
      item.app_name?.toLowerCase().includes(searchText)
    );

    setFilteredPasswords(filtered);
  }, [search, passwords]);

  // ================================
  // LOAD PASSWORDS + APP LOGOS
  // ================================

  const loadPasswords = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Load user's saved passwords
      const { data: passwordData, error: passwordError } =
        await supabase
          .from("passwords")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (passwordError) {
        console.log("Password Error:", passwordError.message);
        setLoading(false);
        return;
      }

      // Load app logos from app_catalog
      const { data: catalogData, error: catalogError } =
        await supabase
          .from("app_catalog")
          .select("app_name, logo_url");

      if (catalogError) {
        console.log("Catalog Error:", catalogError.message);
      }

      // Combine password data with logo data
      const combinedData = (passwordData || []).map((password) => {
        const catalogApp = (catalogData || []).find(
          (app) =>
            app.app_name?.trim().toLowerCase() ===
            password.app_name?.trim().toLowerCase()
        );

        return {
          ...password,
          logo_url: catalogApp?.logo_url || null,
        };
      });

      setPasswords(combinedData);
      setFilteredPasswords(combinedData);

      setLoading(false);
    } catch (error) {
      console.log("Load Error:", error);
      setLoading(false);
    }
  };

  // ================================
  // OPEN DETAILS
  // ================================

  const openPassword = (id: string) => {
    router.push({
      pathname: "/password/details",
      params: {
        id,
      },
    });
  };

  // ================================
  // PASSWORD ITEM
  // ================================

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.passwordCard}
        onPress={() => openPassword(item.id)}
        activeOpacity={0.75}
      >
        {/* APP LOGO */}

        <View style={styles.logoBox}>
          {item.logo_url ? (
            <Image
              source={{
                uri: item.logo_url,
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.logoLetter}>
              {item.app_name?.charAt(0)?.toUpperCase()}
            </Text>
          )}
        </View>

        {/* APP NAME */}

        <Text style={styles.appName} numberOfLines={1}>
          {item.app_name}
        </Text>
      </TouchableOpacity>
    );
  };

  // ================================
  // LOADING SCREEN
  // ================================

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#8B5CF6"
        />

        <Text style={styles.loadingText}>
          Loading passwords...
        </Text>
      </SafeAreaView>
    );
  }

  // ================================
  // MAIN UI
  // ================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* TOP SPACE */}

      <View style={styles.topSpace} />

      {/* SEARCH BAR */}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={23}
          color="#78716C"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search app or website"
          placeholderTextColor="#A8A29E"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={21}
              color="#A8A29E"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* SECTION TITLE */}

      <Text style={styles.sectionTitle}>
        {search.trim() === ""
          ? "SUGGESTED PASSWORDS"
          : "SEARCH RESULTS"}
      </Text>

      {/* RESULTS */}

      {filteredPasswords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={58}
            color="#D6D3D1"
          />

          <Text style={styles.emptyTitle}>
            No Password Found
          </Text>

          <Text style={styles.emptySubtitle}>
            Try another app or website name.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPasswords}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

// =================================
// STYLES
// =================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    paddingHorizontal: 20,
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

  // TOP SPACE

  topSpace: {
    height: 50,
  },

  // SEARCH BAR

  searchContainer: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E7E5E4",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 12,

    fontSize: 16,
    color: "#292524",

    // Important for Android
    paddingVertical: 0,
  },

  // SECTION TITLE

  sectionTitle: {
    marginTop: 28,
    marginBottom: 15,

    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#57534E",
  },

  // LIST

  listContent: {
    paddingBottom: 40,
  },

  // PASSWORD CARD

  passwordCard: {
    height: 76,

    backgroundColor: "#FFFFFF",
    borderRadius: 18,

    paddingHorizontal: 16,
    marginBottom: 12,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#F0EFED",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  // LOGO

  logoBox: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#F0EFED",
  },

  logo: {
    width: 36,
    height: 36,
  },

  logoLetter: {
    fontSize: 22,
    fontWeight: "900",
    color: "#8B5CF6",
  },

  // APP NAME

  appName: {
    flex: 1,
    marginLeft: 16,

    fontSize: 17,
    fontWeight: "800",

    color: "#292524",
  },

  // EMPTY STATE

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 18,

    fontSize: 21,
    fontWeight: "900",

    color: "#44403C",
  },

  emptySubtitle: {
    marginTop: 8,

    fontSize: 15,
    color: "#A8A29E",

    textAlign: "center",
  },
});