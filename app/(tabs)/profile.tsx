import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  TextInput,
  Modal,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "../../services/supabase";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [passwordCount, setPasswordCount] =
    useState(0);

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [editName, setEditName] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

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
        Alert.alert("Error", error.message);
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

      const name =
        user.user_metadata?.full_name || "User";

      const image =
        user.user_metadata?.avatar_url || null;

      setFullName(name);
      setEmail(user.email || "");
      setProfileImage(image);

      await loadPasswordCount(user.id);

      setLoading(false);

    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Error",
        "Unable to load profile."
      );
    }
  };

  const loadPasswordCount = async (
    userId: string
  ) => {
    try {
      const { count, error } =
        await supabase
          .from("passwords")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", userId);

      if (error) {
        console.log(
          "Password count error:",
          error.message
        );

        return;
      }

      setPasswordCount(count || 0);

    } catch (error) {
      console.log(error);
    }
  };

  const chooseImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (result.canceled) {
      return;
    }

    const selectedAsset =
      result.assets[0];

    if (
      selectedAsset.fileSize &&
      selectedAsset.fileSize >
        5 * 1024 * 1024
    ) {
      Alert.alert(
        "Image Too Large",
        "Please choose an image smaller than 5 MB."
      );

      return;
    }

    setSelectedImage(
      selectedAsset.uri
    );
  };

  const uploadProfileImage = async (
    uri: string,
    userId: string
  ) => {
    try {
      const response =
        await fetch(uri);

      const blob =
        await response.blob();

      const filePath =
        `profiles/${userId}.jpg`;

      const { error } =
        await supabase.storage
          .from("avatars")
          .upload(
            filePath,
            blob,
            {
              contentType: "image/jpeg",
              upsert: true,
            }
          );

      if (error) {
        throw error;
      }

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

      return (
        publicUrlData.publicUrl +
        `?t=${Date.now()}`
      );

    } catch (error) {
      console.log(
        "Upload error:",
        error
      );

      return null;
    }
  };

  const saveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert(
        "Validation",
        "Please enter your name."
      );

      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        setSaving(false);

        router.replace("/(auth)/login");

        return;
      }

      let avatarUrl =
        profileImage;

      if (selectedImage) {
        const uploadedUrl =
          await uploadProfileImage(
            selectedImage,
            user.id
          );

        if (!uploadedUrl) {
          Alert.alert(
            "Upload Failed",
            "Unable to upload profile picture."
          );

          setSaving(false);

          return;
        }

        avatarUrl =
          uploadedUrl;
      }

      const { error } =
        await supabase.auth.updateUser({
          data: {
            full_name:
              editName.trim(),

            avatar_url:
              avatarUrl,
          },
        });

      if (error) {
        Alert.alert(
          "Update Failed",
          error.message
        );

        setSaving(false);

        return;
      }

      setFullName(
        editName.trim()
      );

      setProfileImage(
        avatarUrl
      );

      setSelectedImage(null);

      setEditModalVisible(false);

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );

      setSaving(false);

    } catch (error) {
      setSaving(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  const openEditProfile = () => {
    setEditName(fullName);

    setSelectedImage(
      profileImage
    );

    setEditModalVisible(true);
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
          onPress: confirmLogout,
        },
      ]
    );
  };

  const confirmLogout = async () => {
    try {
      setLogoutLoading(true);

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        setLogoutLoading(false);

        Alert.alert(
          "Logout Failed",
          error.message
        );

        return;
      }

      router.replace("/home");

    } catch (error) {
      setLogoutLoading(false);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.loadingContainer
        }
      >
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#064B78"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading Profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="dark" />

      <View
        style={styles.topSpace}
      />

      <Text
        style={styles.pageTitle}
      >
        PROFILE
      </Text>

      {/* PROFILE CARD */}

      <View
        style={styles.profileCard}
      >
        <View
          style={styles.profileInfo}
        >

          <View
            style={styles.avatar}
          >
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={
                  styles.avatarImage
                }
              />
            ) : (
              <Text
                style={
                  styles.avatarText
                }
              >
                👤
              </Text>
            )}
          </View>

          <View
            style={styles.userDetails}
          >
            <Text
              style={styles.name}
            >
              {fullName}
            </Text>

            <Text
              style={styles.email}
            >
              {email}
            </Text>
          </View>

        </View>

        <TouchableOpacity
          style={
            styles.editButton
          }
          onPress={
            openEditProfile
          }
        >
          <Text
            style={styles.editText}
          >
            ✏️ Edit Profile
          </Text>
        </TouchableOpacity>

      </View>

      {/* YOUR VAULT */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        YOUR VAULT
      </Text>

      <View
        style={
          styles.vaultRow
        }
      >

        <View
          style={
            styles.vaultCard
          }
        >
          <Text
            style={
              styles.vaultIcon
            }
          >
            🔐
          </Text>

          <Text
            style={
              styles.vaultNumber
            }
          >
            {passwordCount}
          </Text>

          <Text
            style={
              styles.vaultLabel
            }
          >
            Passwords
          </Text>
        </View>

        <View
          style={
            styles.vaultCard
          }
        >
          <Text
            style={
              styles.vaultIcon
            }
          >
            🛡️
          </Text>

          <Text
            style={
              styles.secureText
            }
          >
            Secure
          </Text>

          <Text
            style={
              styles.vaultLabel
            }
          >
            Vault
          </Text>
        </View>

      </View>

      {/* ACCOUNT */}

      <Text
        style={
          styles.accountTitle
        }
      >
        ACCOUNT
      </Text>

      {/* SETTINGS */}

      <TouchableOpacity
        style={
          styles.menuCard
        }
        onPress={() =>
          router.push(
            "/settings/settings"
          )
        }
      >
        <Text
          style={
            styles.menuText
          }
        >
          ⚙️ Settings
        </Text>

        <Text
          style={
            styles.arrow
          }
        >
          ›
        </Text>
      </TouchableOpacity>

      {/* ABOUT */}

      <TouchableOpacity
        style={
          styles.menuCard
        }
        onPress={() =>
          router.push(
            "/settings/about"
          )
        }
      >
        <Text
          style={
            styles.menuText
          }
        >
          ℹ️ About
        </Text>

        <Text
          style={
            styles.arrow
          }
        >
          ›
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}

      <TouchableOpacity
        style={
          styles.logoutButton
        }
        onPress={logout}
        activeOpacity={0.8}
        disabled={
          logoutLoading
        }
      >
        {logoutLoading ? (
          <ActivityIndicator
            color="#FFFFFF"
          />
        ) : (
          <Text
            style={
              styles.logoutText
            }
          >
            🚪 Logout
          </Text>
        )}
      </TouchableOpacity>

      {/* EDIT MODAL */}

      <Modal
        visible={
          editModalVisible
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setEditModalVisible(
            false
          )
        }
      >
        <View
          style={
            styles.modalBackground
          }
        >

          <View
            style={
              styles.modalContainer
            }
          >

            <Text
              style={
                styles.modalTitle
              }
            >
              Edit Profile
            </Text>

            <TouchableOpacity
              style={
                styles.editAvatar
              }
              onPress={
                chooseImage
              }
            >
              {selectedImage ? (
                <Image
                  source={{
                    uri: selectedImage,
                  }}
                  style={
                    styles.editAvatarImage
                  }
                />
              ) : (
                <Text
                  style={
                    styles.editAvatarText
                  }
                >
                  👤
                </Text>
              )}

              <View
                style={
                  styles.cameraBadge
                }
              >
                <Text>
                  📷
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={
                styles.changePhotoText
              }
            >
              Tap to choose photo
            </Text>

            <TextInput
              style={
                styles.nameInput
              }
              placeholder="Enter your name"
              value={editName}
              onChangeText={
                setEditName
              }
            />

            <TouchableOpacity
              style={
                styles.saveButton
              }
              onPress={
                saveProfile
              }
              disabled={
                saving
              }
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.saveText
                  }
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setEditModalVisible(
                  false
                )
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  topSpace: {
    height: 25,
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

  pageTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 18,
    letterSpacing: 2,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    elevation: 3,
  },

  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarText: {
    fontSize: 38,
  },

  userDetails: {
    marginLeft: 16,
    flex: 1,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  email: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  editButton: {
    alignSelf: "flex-end",
    marginTop: 14,
  },

  editText: {
    color: "#064B78",
    fontSize: 15,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },

  vaultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  vaultCard: {
    width: "48%",
    height: 125,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  vaultIcon: {
    fontSize: 30,
    marginBottom: 5,
  },

  vaultNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#064B78",
  },

  secureText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#064B78",
  },

  vaultLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  accountTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },

  menuCard: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  menuText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
  },

  arrow: {
    fontSize: 30,
    color: "#9CA3AF",
  },

  logoutButton: {
    height: 58,
    backgroundColor: "#064B78",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    elevation: 3,

    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 28,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 25,
  },

  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },

  editAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  editAvatarText: {
    fontSize: 52,
  },

  cameraBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#064B78",
    justifyContent: "center",
    alignItems: "center",
  },

  changePhotoText: {
    marginTop: 12,
    color: "#064B78",
    fontSize: 14,
    fontWeight: "600",
  },

  nameInput: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 25,
    backgroundColor: "#F9FAFB",
  },

  saveButton: {
    width: "100%",
    height: 55,
    borderRadius: 14,
    backgroundColor: "#064B78",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 5,
  },

});