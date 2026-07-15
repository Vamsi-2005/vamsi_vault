import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { supabase } from "../../services/supabase";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        Alert.alert(
          "Error",
          error.message
        );

        setLoading(false);
        return;
      }

      if (!user) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace("/(auth)/login");
        return;
      }

      setEmail(user.email || "");

      setFullName(
        user.user_metadata?.full_name || "User"
      );

      setLoading(false);

    } catch (error) {

      setLoading(false);

      Alert.alert(
        "Error",
        "Unable to load profile."
      );
    }
  };

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

      const { error } =
        await supabase.auth.signOut();

      if (error) {

        Alert.alert(
          "Logout Failed",
          error.message
        );

        return;
      }

      router.replace("/home");

    } catch (error) {

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }

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
          Loading Profile...
        </Text>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
            <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.back}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Profile Header */}

      <View style={styles.profileContainer}>

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>
            👤
          </Text>

        </View>

        <Text style={styles.name}>
          {fullName}
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

      </View>

      {/* Menu */}

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() =>
          router.push("/settings/settings")
        }
      >

        <Text style={styles.menuText}>
          ⚙️ Settings
        </Text>

        <Text style={styles.arrow}>
          ➜
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() =>
          router.push("/settings/about")
        }
      >

        <Text style={styles.menuText}>
          ℹ️ About
        </Text>

        <Text style={styles.arrow}>
          ➜
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >

        <Text style={styles.logoutText}>
          🚪 Logout
        </Text>

      </TouchableOpacity>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 30,
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

  back: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 20,
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },

  avatarText: {
    fontSize: 50,
    color: "#FFFFFF",
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },

  email: {
    fontSize: 16,
    color: "#666",
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  menuText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  arrow: {
    fontSize: 22,
    color: "#2563EB",
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

