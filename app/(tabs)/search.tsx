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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { supabase } from "../../services/supabase";

export default function SearchScreen() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [passwords, setPasswords] = useState<any[]>([]);

  const [filteredPasswords, setFilteredPasswords] = useState<any[]>([]);

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPasswords(passwords);
    } else {
      const filtered = passwords.filter((item) =>
        item.app_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

      setFilteredPasswords(filtered);
    }
  }, [search, passwords]);

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

      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.log(error.message);
      } else {
        setPasswords(data || []);
        setFilteredPasswords(data || []);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const openPassword = (id: string) => {
    router.push({
      pathname: "/password/details",
      params: {
        id,
      },
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.passwordCard}
      onPress={() => openPassword(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardLeft}>

        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>
            🔐
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.appName}>
            {item.app_name}
          </Text>

          <Text style={styles.username}>
            {item.username}
          </Text>
        </View>

      </View>

      <Text style={styles.arrow}>
        →
      </Text>

    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading Passwords...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Search Bar */}

      <View style={styles.searchContainer}>

        <Text style={styles.searchIcon}>
          🔍
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search passwords..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
          >
            <Text style={styles.clearButton}>
              ✕
            </Text>
          </TouchableOpacity>
        )}

      </View>

      {/* Suggested Passwords */}

      <Text style={styles.sectionTitle}>
        {search.trim() === ""
          ? "SUGGESTED PASSWORDS"
          : "SEARCH RESULTS"}
      </Text>

      {/* Password List */}

      {filteredPasswords.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            🔍
          </Text>

          <Text style={styles.emptyTitle}>
            No Passwords Found
          </Text>

          <Text style={styles.emptySubtitle}>
            Try searching with another app name.
          </Text>

        </View>

      ) : (

        <FlatList
          data={filteredPasswords}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B7280",
  },

  /* Search Bar */

  searchContainer: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E1E7ED",
    marginBottom: 25,

    elevation: 2,
  },

  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#123B63",
  },

  clearButton: {
    fontSize: 18,
    color: "#9CA3AF",
    padding: 5,
  },

  /* Section Title */

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#123B63",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  /* Password List */

  listContent: {
    paddingBottom: 30,
  },

  passwordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 2,

    shadowColor: "#123B63",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EAF2F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  appIconText: {
    fontSize: 23,
  },

  textContainer: {
    flex: 1,
  },

  appName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#123B63",
  },

  username: {
    marginTop: 5,
    fontSize: 13,
    color: "#7A8491",
  },

  arrow: {
    fontSize: 25,
    color: "#D89B24",
    fontWeight: "bold",
    marginLeft: 10,
  },

  /* Empty State */

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 58,
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#123B63",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#7A8491",
    textAlign: "center",
    lineHeight: 23,
  },

});