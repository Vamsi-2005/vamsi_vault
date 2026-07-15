import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../services/supabase";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userName, setUserName] = useState("");

  const [totalPasswords, setTotalPasswords] =
    useState(0);

  const [totalCategories, setTotalCategories] =
    useState(0);

  const [recentPasswords, setRecentPasswords] =
    useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      setUserName(
        user.user_metadata?.full_name || "User"
      );

      // Total Passwords

      const {
        count,
      } = await supabase
        .from("passwords")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      setTotalPasswords(count || 0);

      // Recent Passwords

      const {
        data: passwordData,
      } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(3);

      setRecentPasswords(passwordData || []);

      // Categories

      const {
        data: categoryData,
      } = await supabase
        .from("passwords")
        .select("category")
        .eq("user_id", user.id);

      const uniqueCategories =
        new Set(
          (categoryData || []).map(
            item => item.category
          )
        );

      setTotalCategories(
        uniqueCategories.size
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  };

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
          Loading Dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >

        {/* Header */}

        <View style={styles.header}>

          <View>

            <Text style={styles.welcome}>
              Welcome Back 👋
            </Text>

            <Text style={styles.userName}>
              {userName}
            </Text>

          </View>

          <View style={styles.logoBox}>
            <Text style={styles.logo}>
              🔐
            </Text>
          </View>

        </View>
                {/* Statistics */}

        <View style={styles.statsContainer}>

          <View style={styles.card}>

            <Text style={styles.cardIcon}>
              🔑
            </Text>

            <Text style={styles.cardValue}>
              {totalPasswords}
            </Text>

            <Text style={styles.cardTitle}>
              Total Passwords
            </Text>

          </View>

          <View style={styles.card}>

            <Text style={styles.cardIcon}>
              📂
            </Text>

            <Text style={styles.cardValue}>
              {totalCategories}
            </Text>

            <Text style={styles.cardTitle}>
              Categories
            </Text>

          </View>

        </View>

        {/* Recent Passwords */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            ⭐ Recent Passwords
          </Text>

        </View>

        {recentPasswords.length === 0 ? (

          <View style={styles.emptyCard}>

            <Text style={styles.emptyTitle}>
              No Passwords Found
            </Text>

            <Text style={styles.emptySubtitle}>
              Add your first password to get started.
            </Text>

          </View>

        ) : (

          recentPasswords.map((item) => (

            <TouchableOpacity
              key={item.id}
              style={styles.passwordCard}
              onPress={() =>
                router.push({
                  pathname: "/password/details",
                  params: {
                    id: item.id,
                  },
                })
              }
            >

              <View style={styles.passwordLeft}>

                <Text style={styles.passwordIcon}>
                  🔐
                </Text>

                <View>

                  <Text style={styles.passwordTitle}>
                    {item.app_name}
                  </Text>

                  <Text style={styles.passwordCategory}>
                    {item.category}
                  </Text>

                </View>

              </View>

              <Text style={styles.arrow}>
                ➜
              </Text>

            </TouchableOpacity>

          ))

        )}

        {/* Add Password */}

        <TouchableOpacity
          style={styles.addCard}
          onPress={() =>
            router.push("/(tabs)/add-password")
          }
        >

          <View>

            <Text style={styles.addTitle}>
              ➕ Add New Password
            </Text>

            <Text style={styles.addSubtitle}>
              Store your credentials securely.
            </Text>

          </View>

          <Text style={styles.arrowWhite}>
            ➜
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 30,
  },

  welcome: {
    fontSize: 16,
    color: "#666",
  },

  userName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 5,
  },

  logoBox: {
    width: 65,
    height: 65,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  logo: {
    fontSize: 34,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    elevation: 2,
  },

  cardIcon: {
    fontSize: 34,
  },

  cardValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 10,
  },

  cardTitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
    elevation: 2,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },

  passwordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  passwordLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  passwordIcon: {
    fontSize: 28,
    marginRight: 15,
  },

  passwordTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },

  passwordCategory: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },

  arrow: {
    fontSize: 22,
    color: "#2563EB",
    fontWeight: "bold",
  },

  addCard: {
    marginTop: 25,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
  },

  addTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 6,
  },

  addSubtitle: {
    color: "#EAF2FF",
    fontSize: 15,
    lineHeight: 22,
    width: 220,
  },

  arrowWhite: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});