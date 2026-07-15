import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../services/supabase";

export default function PasswordDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  const [hidePassword, setHidePassword] =
    useState(true);

  const [passwordData, setPasswordData] =
    useState<any>(null);

  useEffect(() => {
    if (id) {
      loadPassword();
    }
  }, []);

  const loadPassword = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert(
          "Error",
          error.message
        );
      } else {
        setPasswordData(data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Unable to load password."
      );
    }
  };

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

      const { error } = await supabase
        .from("passwords")
        .delete()
        .eq("id", id);

      setLoading(false);

      if (error) {
        Alert.alert(
          "Error",
          error.message
        );

        return;
      }

      Alert.alert(
        "Success",
        "Password deleted successfully."
      );

      router.replace("/(tabs)/dashboard");

    } catch (error) {

      setLoading(false);

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
          Loading...
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

      <Text style={styles.title}>
        🔐 Password Details
      </Text>

      {/* App Name */}

      <View style={styles.card}>

        <Text style={styles.label}>
          🏷 App / Website
        </Text>

        <Text style={styles.value}>
          {passwordData?.app_name}
        </Text>

      </View>

      {/* Username */}

      <View style={styles.card}>

        <Text style={styles.label}>
          👤 Username
        </Text>

        <Text style={styles.value}>
          {passwordData?.username}
        </Text>

      </View>

      {/* Email */}

      <View style={styles.card}>

        <Text style={styles.label}>
          📧 Email
        </Text>

        <Text style={styles.value}>
          {passwordData?.email || "Not Available"}
        </Text>

      </View>

      {/* Password */}

      <View style={styles.card}>

        <Text style={styles.label}>
          🔒 Password
        </Text>

        <View style={styles.passwordRow}>

          <Text style={styles.value}>
            {hidePassword
              ? "••••••••••••"
              : passwordData?.password}
          </Text>

          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Text style={styles.eye}>
              {hidePassword ? "👁" : "🙈"}
            </Text>
          </TouchableOpacity>

        </View>

      </View>

      {/* Website */}

      <View style={styles.card}>

        <Text style={styles.label}>
          🌐 Website
        </Text>

        <Text style={styles.value}>
          {passwordData?.website || "Not Available"}
        </Text>

      </View>

      {/* Category */}

      <View style={styles.card}>

        <Text style={styles.label}>
          📂 Category
        </Text>

        <Text style={styles.value}>
          {passwordData?.category}
        </Text>

      </View>

      {/* Edit Button */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/password/edit",
            params: {
              id: passwordData?.id,
            },
          })
        }
      >
        <Text style={styles.editText}>
          ✏️ Edit Password
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={deletePassword}
      >
        <Text style={styles.deleteText}>
          🗑 Delete Password
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
    paddingTop: 30,
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

  back: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },

  value: {
    fontSize: 18,
    color: "#222",
    fontWeight: "600",
  },

  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eye: {
    fontSize: 22,
  },

  editButton: {
    backgroundColor: "#2563EB",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },

  editText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    elevation: 3,
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
