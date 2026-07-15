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

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/password/details",
          params: {
            id: item.id,
          },
        })
      }
    >
      <View>

        <Text style={styles.appName}>
          {item.app_name}
        </Text>

        <Text style={styles.username}>
          {item.username}
        </Text>

      </View>

      <Text style={styles.arrow}>
        ➜
      </Text>

    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
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

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          🔍 Search Passwords
        </Text>

      </View>
            <View style={styles.searchContainer}>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by App Name..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

      </View>

      {filteredPasswords.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            🔍
          </Text>

          <Text style={styles.emptyTitle}>
            No Passwords Found
          </Text>

          <Text style={styles.emptySubtitle}>
            Try another search or add a new password.
          </Text>

        </View>

      ) : (

        <FlatList
          data={filteredPasswords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
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
    paddingTop: 10,
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
    color: "#666",
  },

  header: {
    marginBottom: 20,
  },

  back: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
  },

  searchContainer: {
    marginBottom: 20,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    height: 55,
    borderRadius: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  username: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },

  arrow: {
    fontSize: 22,
    color: "#2563EB",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 24,
  },
});

