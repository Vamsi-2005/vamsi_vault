import React, { useState } from "react";
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
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function AddPasswordScreen() {
  const [appName, setAppName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");

  const [category, setCategory] = useState("Social");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const savePassword = async () => {
    if (!appName.trim()) {
      Alert.alert("Validation", "Please enter App Name.");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Validation", "Please enter Username.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Validation", "Please enter Password.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        setLoading(false);
        router.replace("/(auth)/login");
        return;
      }

      const { error } = await supabase
        .from("passwords")
        .insert([
          {
            user_id: user.id,
            app_name: appName,
            username: username,
            email: email,
            password: password,
            website: website,
            category: category,
          },
        ]);

      setLoading(false);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "Success",
        "Password Saved Successfully."
      );

      setAppName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setWebsite("");
      setCategory("Social");

      router.replace("/(tabs)/dashboard");

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

        {/* MAIN HEADING */}
        <Text style={styles.mainTitle}>
          ADD PASSWORD
        </Text>

        {/* APP / WEBSITE */}
        <Text style={styles.label}>
          App or Website
        </Text>

        <View style={styles.inputCard}>
          <MaterialCommunityIcons
            name="web"
            size={23}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="Instagram"
            value={appName}
            onChangeText={setAppName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* USERNAME */}
        <Text style={styles.label}>
          Username
        </Text>

        <View style={styles.inputCard}>
          <Ionicons
            name="person-outline"
            size={23}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="vamsi123"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* EMAIL */}
        <Text style={styles.label}>
          Email
        </Text>

        <View style={styles.inputCard}>
          <MaterialCommunityIcons
            name="email-outline"
            size={23}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="vamsi@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* PASSWORD */}
        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.inputCard}>
          <Ionicons
            name="lock-closed-outline"
            size={23}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Ionicons
              name={
                hidePassword
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={24}
              color="#6366F1"
            />
          </TouchableOpacity>
        </View>

        {/* CATEGORY */}
        <Text style={styles.categoryTitle}>
          CATEGORY
        </Text>

        <View style={styles.categoryContainer}>
          {[
            "Social",
            "Email",
            "Banking",
            "Shopping",
            "Work",
            "Others",
          ].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryChip,
                category === item &&
                  styles.selectedChip,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item &&
                    styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* WEBSITE */}
        <Text style={styles.label}>
          Website URL (Optional)
        </Text>

        <View style={styles.inputCard}>
          <MaterialCommunityIcons
            name="link-variant"
            size={23}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="https://instagram.com"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={savePassword}
          disabled={loading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#5B5FEF", "#7C4DFF"]}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={23}
                  color="#FFFFFF"
                />

                <Text style={styles.saveButtonText}>
                  Save to Vault
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingTop: 30,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },

  inputCard: {
    height: 62,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },

  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 28,
    marginBottom: 12,
    letterSpacing: 1,
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryChip: {
    width: "31%",
    height: 45,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedChip: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  saveButton: {
    marginTop: 28,
    marginBottom: 30,
    borderRadius: 18,
    overflow: "hidden",
  },

  gradientButton: {
    height: 62,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 9,
  },
});