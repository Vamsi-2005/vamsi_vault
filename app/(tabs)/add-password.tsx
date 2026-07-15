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
  MaterialIcons,
} from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function AddPasswordScreen() {
  const [appName, setAppName] = useState("");
  const [username, setUsername] =useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");

  const [category, setCategory] =
    useState("Social");

  const [hidePassword, setHidePassword] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const savePassword = async () => {

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

        Alert.alert(
          "Error",
          error.message
        );

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

        <LinearGradient
          colors={["#5B5FEF", "#7C4DFF"]}
          style={styles.header}
        >

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <MaterialCommunityIcons
            name="shield-lock"
            size={60}
            color="#FFFFFF"
          />

          <Text style={styles.title}>
            Add Password
          </Text>

          <Text style={styles.subtitle}>
            Securely save your credentials
          </Text>

        </LinearGradient>

        {/* App Name */}

        <Text style={styles.label}>
          App / Website
        </Text>

        <View style={styles.inputCard}>

          <MaterialCommunityIcons
            name="web"
            size={22}
            color="#6366F1"
          />

          <TextInput
            style={styles.input}
            placeholder="Instagram"
            value={appName}
            onChangeText={setAppName}
            placeholderTextColor="#9CA3AF"
          />

        </View>        {/* Username */}

        <Text style={styles.label}>
          Username
        </Text>

        <View style={styles.inputCard}>

          <Ionicons
            name="person-outline"
            size={22}
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

        {/* Email */}

        <Text style={styles.label}>
          Email (Optional)
        </Text>

        <View style={styles.inputCard}>

          <MaterialCommunityIcons
            name="email-outline"
            size={22}
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

        {/* Password */}

        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.inputCard}>

          <Ionicons
            name="lock-closed-outline"
            size={22}
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

        {/* Website */}

        <Text style={styles.label}>
          Website URL (Optional)
        </Text>

        <View style={styles.inputCard}>

          <MaterialCommunityIcons
            name="link-variant"
            size={22}
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

        {/* Category */}

        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.categoryContainer}>

          {[
            "Social",
            "Email",
            "Development",
            "Banking",
            "Shopping",
            "Education",
            "Entertainment",
            "Others",
          ].map((item) => (

            <TouchableOpacity
              key={item}
              style={[
                styles.categoryChip,
                category === item &&
                  styles.selectedChip,
              ]}
              onPress={() =>
                setCategory(item)
              }
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
                {/* Save Button */}

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

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>
                <Ionicons
                  name="shield-checkmark"
                  size={22}
                  color="#FFFFFF"
                />

                <Text style={styles.saveButtonText}>
                  Save Password
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
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    height: 210,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    position: "absolute",
    left: 18,
    top: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 15,
  },

  subtitle: {
    color: "#E5E7FF",
    fontSize: 15,
    marginTop: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginTop: 16,
  },

  inputCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 18,
    height: 62,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  categoryChip: {
    width: "48%",
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  selectedChip: {
    backgroundColor: "#5B5FEF",
  },

  categoryText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  saveButton: {
    marginTop: 28,
    marginBottom: 40,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

});