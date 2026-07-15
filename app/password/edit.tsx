import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../services/supabase";

export default function EditPasswordScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [appName, setAppName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");

  const [hidePassword, setHidePassword] =
    useState(true);

  useEffect(() => {
    loadPassword();
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

        setAppName(data.app_name);
        setUsername(data.username);
        setEmail(data.email || "");
        setPassword(data.password);
        setWebsite(data.website || "");
        setCategory(data.category);

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

  const updatePassword = async () => {

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

      setSaving(true);

      const { error } = await supabase
        .from("passwords")
        .update({
          app_name: appName,
          username: username,
          email: email,
          password: password,
          website: website,
          category: category,
        })
        .eq("id", id);

      setSaving(false);

      if (error) {

        Alert.alert(
          "Update Failed",
          error.message
        );

        return;
      }

      Alert.alert(
        "Success",
        "Password updated successfully."
      );

      router.replace({
        pathname: "/password/details",
        params: { id: String(id) },
      });

    } catch (error) {

      setSaving(false);

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          ✏️ Edit Password
        </Text>

        <Text style={styles.subtitle}>
          Update your saved credentials.
        </Text>

        {/* App Name */}

        <Text style={styles.label}>
          🏷 App / Website Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Instagram"
          value={appName}
          onChangeText={setAppName}
        />

        {/* Username */}

        <Text style={styles.label}>
          👤 Username
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Email */}

        <Text style={styles.label}>
          📧 Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}

        <Text style={styles.label}>
          🔒 Password
        </Text>

        <View style={styles.passwordContainer}>

          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Text style={styles.show}>
              {hidePassword ? "👁" : "🙈"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Website */}

        <Text style={styles.label}>
          🌐 Website URL
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          value={website}
          onChangeText={setWebsite}
          autoCapitalize="none"
        />

        {/* Category */}

        <Text style={styles.label}>
          📂 Category
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Social"
          value={category}
          onChangeText={setCategory}
        />

        {/* Update Button */}

        <TouchableOpacity
          style={styles.button}
          onPress={updatePassword}
          disabled={saving}
        >

          {saving ? (

            <ActivityIndicator
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.buttonText}>
              💾 Update Password
            </Text>

          )}

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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 55,
    fontSize: 16,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 55,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  show: {
    fontSize: 22,
    marginLeft: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
    elevation: 3,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

