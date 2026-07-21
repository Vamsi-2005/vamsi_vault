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
  ScrollView,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function ProfileScreen() {
  // =====================================
  // STATES
  // =====================================

  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [passwordCount, setPasswordCount] =
    useState(0);

  const [categoryCount, setCategoryCount] =
    useState(0);

  const [biometricEnabled, setBiometricEnabled] =
    useState(true);

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

  // =====================================
  // LOAD PROFILE
  // =====================================

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
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "User";

      const image =
        user.user_metadata?.avatar_url ||
        null;

      setFullName(name);

      setEmail(user.email || "");

      setProfileImage(image);

      await loadPasswordCount(user.id);

      await loadCategoryCount(user.id);

      setLoading(false);

    } catch (error) {
      console.log("LOAD PROFILE ERROR:", error);

      setLoading(false);

      Alert.alert(
        "Error",
        "Unable to load profile."
      );
    }
  };

  // =====================================
  // PASSWORD COUNT
  // =====================================

  const loadPasswordCount = async (
    userId: string
  ) => {
    try {
      const {
        count,
        error,
      } = await supabase
        .from("passwords")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId);

      if (error) {
        console.log(
          "PASSWORD COUNT ERROR:",
          error.message
        );

        return;
      }

      setPasswordCount(count || 0);

    } catch (error) {
      console.log(error);
    }
  };

  // =====================================
  // CATEGORY COUNT
  // =====================================

  const loadCategoryCount = async (
    userId: string
  ) => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("passwords")
        .select("category")
        .eq("user_id", userId);

      if (error) {
        console.log(
          "CATEGORY COUNT ERROR:",
          error.message
        );

        return;
      }

      const uniqueCategories =
        new Set(
          (data || [])
            .map((item) => item.category)
            .filter(Boolean)
        );

      setCategoryCount(
        uniqueCategories.size
      );

    } catch (error) {
      console.log(error);
    }
  };

  // =====================================
  // CHOOSE IMAGE
  // =====================================

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

  // =====================================
  // UPLOAD PROFILE IMAGE
  // =====================================

  const uploadProfileImage = async (
    uri: string,
    userId: string
  ) => {
    try {
      const response =
        await fetch(uri);

      if (!response.ok) {
        throw new Error(
          "Unable to read selected image."
        );
      }

      const arrayBuffer =
        await response.arrayBuffer();

      const filePath =
        `profiles/${userId}.jpg`;

      const {
        error,
      } = await supabase.storage
        .from("avatars")
        .upload(
          filePath,
          arrayBuffer,
          {
            contentType:
              "image/jpeg",

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
          .getPublicUrl(
            filePath
          );

      return (
        publicUrlData.publicUrl +
        `?t=${Date.now()}`
      );

    } catch (error: any) {
      console.log(
        "PROFILE IMAGE UPLOAD ERROR:",
        error?.message ||
          error
      );

      return null;
    }
  };

  // =====================================
  // SAVE PROFILE
  // =====================================

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
        setSaving(false);

        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace(
          "/(auth)/login"
        );

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
          setSaving(false);

          Alert.alert(
            "Upload Failed",
            "Unable to upload profile picture."
          );

          return;
        }

        avatarUrl =
          uploadedUrl;
      }

      const {
        error,
      } =
        await supabase.auth.updateUser({
          data: {
            full_name:
              editName.trim(),

            avatar_url:
              avatarUrl,
          },
        });

      if (error) {
        setSaving(false);

        Alert.alert(
          "Update Failed",
          error.message
        );

        return;
      }

      setFullName(
        editName.trim()
      );

      setProfileImage(
        avatarUrl
      );

      setSelectedImage(null);

      setEditModalVisible(
        false
      );

      setSaving(false);

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );

    } catch (error: any) {
      console.log(
        "SAVE PROFILE ERROR:",
        error?.message ||
          error
      );

      setSaving(false);

      Alert.alert(
        "Error",
        error?.message ||
          "Something went wrong."
      );
    }
  };

  // =====================================
  // OPEN EDIT PROFILE
  // =====================================

  const openEditProfile = () => {
    setEditName(fullName);

    setSelectedImage(null);

    setEditModalVisible(true);
  };

  // =====================================
  // CLOSE EDIT PROFILE
  // =====================================

  const closeEditProfile = () => {
    setSelectedImage(null);

    setEditModalVisible(false);
  };

  // =====================================
  // LOGOUT
  // =====================================

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
      setLogoutLoading(true);

      const {
        error,
      } =
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

  // =====================================
  // LOADING SCREEN
  // =====================================

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

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* PAGE TITLE */}

        <View
          style={
            styles.topHeader
          }
        >
          <Text
            style={
              styles.pageTitle
            }
          >
            PROFILE
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/settings/settings"
              )
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color="#003456"
            />
          </TouchableOpacity>
        </View>

        {/* =====================================
            IDENTITY HEADER
        ===================================== */}

        <View
          style={
            styles.identitySection
          }
        >

          <View
            style={
              styles.avatarWrapper
            }
          >

            <View
              style={
                styles.avatarLarge
              }
            >

              {profileImage ? (

                <Image
                  source={{
                    uri:
                      profileImage,
                  }}
                  style={
                    styles.avatarImage
                  }
                />

              ) : (

                <Ionicons
                  name="person"
                  size={42}
                  color="#064B78"
                />

              )}

            </View>

            <TouchableOpacity
              style={
                styles.cameraButton
              }
              onPress={
                openEditProfile
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          <Text
            style={
              styles.identityName
            }
          >
            {fullName}
          </Text>

        </View>

        {/* =====================================
            PERSONAL INFORMATION
        ===================================== */}

        <View
          style={
            styles.infoCard
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <Ionicons
              name="person-outline"
              size={22}
              color="#003456"
            />

            <Text
              style={
                styles.cardTitle
              }
            >
              Personal Information
            </Text>

          </View>

          <View
            style={
              styles.infoRows
            }
          >

            <View
              style={
                styles.infoRow
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Full Name
              </Text>

              <Text
                style={
                  styles.infoValue
                }
                numberOfLines={1}
              >
                {fullName}
              </Text>
            </View>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.infoRow
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Email
              </Text>

              <Text
                style={
                  styles.infoValue
                }
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {email}
              </Text>
            </View>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.infoRow
              }
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Joined
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                20 Jul 2026
              </Text>
            </View>

          </View>

        </View>

        {/* =====================================
            SECURITY CARD
        ===================================== */}

        <View
          style={
            styles.infoCard
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <Ionicons
              name="shield-outline"
              size={22}
              color="#003456"
            />

            <Text
              style={
                styles.cardTitle
              }
            >
              Security
            </Text>

          </View>

          <View
            style={
              styles.infoRows
            }
          >

            {/* PASSWORD */}

            <View
              style={
                styles.infoRow
              }
            >

              <Text
                style={
                  styles.infoLabel
                }
                numberOfLines={1}
              >
                Password
              </Text>

              <View
                style={
                  styles.securityStatus
                }
              >

                {/* IMPORTANT:
                    Protected stays in ONE LINE
                */}

                <Text
                  style={
                    styles.protectedText
                  }
                  numberOfLines={1}
                >
                  Protected
                </Text>

                <View
                  style={
                    styles.statusDot
                  }
                />

              </View>

            </View>

            <View
              style={
                styles.divider
              }
            />

            {/* BIOMETRICS */}

            <View
              style={
                styles.infoRow
              }
            >

              <Text
                style={
                  styles.infoLabel
                }
                numberOfLines={1}
              >
                Biometrics
              </Text>

              <View
                style={
                  styles.biometricStatus
                }
              >

                <Text
                  style={
                    styles.biometricText
                  }
                  numberOfLines={1}
                >
                  {biometricEnabled
                    ? "Enabled"
                    : "Disabled"}
                </Text>

                <View
                  style={[
                    styles.activeBadge,
                    !biometricEnabled &&
                      styles.disabledBadge,
                  ]}
                >

                  <Text
                    style={[
                      styles.activeBadgeText,
                      !biometricEnabled &&
                        styles.disabledBadgeText,
                    ]}
                  >
                    {biometricEnabled
                      ? "Active"
                      : "Off"}
                  </Text>

                </View>

              </View>

            </View>

          </View>

        </View>

        {/* =====================================
            VAULT STATISTICS
        ===================================== */}

        <View
          style={
            styles.infoCard
          }
        >

          <View
            style={
              styles.cardHeader
            }
          >

            <Ionicons
              name="bar-chart-outline"
              size={22}
              color="#003456"
            />

            <Text
              style={
                styles.cardTitle
              }
            >
              Vault Statistics
            </Text>

          </View>

          <View
            style={
              styles.statisticsRow
            }
          >

            {/* ACCOUNTS */}

            <View
              style={
                styles.statBox
              }
            >

              <Text
                style={
                  styles.statNumber
                }
              >
                {passwordCount}
              </Text>

              <Text
                style={
                  styles.statLabel
                }
              >
                ACCOUNTS
              </Text>

            </View>

            {/* CATEGORIES */}

            <View
              style={
                styles.statBox
              }
            >

              <Text
                style={
                  styles.statNumber
                }
              >
                {categoryCount}
              </Text>

              <Text
                style={
                  styles.statLabel
                }
              >
                CATEGORIES
              </Text>

            </View>

          </View>

        </View>

        {/* FOOTER */}

        <View
          style={
            styles.footer
          }
        >

          <Text
            style={
              styles.footerText
            }
          >
            VAMSI VAULT
          </Text>

        </View>

      </ScrollView>

      {/* =====================================
          EDIT PROFILE MODAL
      ===================================== */}

      <Modal
        visible={
          editModalVisible
        }
        transparent
        animationType="slide"
        onRequestClose={
          closeEditProfile
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

            {/* EDIT AVATAR */}

            <TouchableOpacity
              style={
                styles.editAvatar
              }
              onPress={
                chooseImage
              }
              activeOpacity={0.8}
            >

              {selectedImage ||
              profileImage ? (

                <Image
                  source={{
                    uri:
                      selectedImage ||
                      profileImage ||
                      "",
                  }}
                  style={
                    styles.editAvatarImage
                  }
                />

              ) : (

                <Ionicons
                  name="person"
                  size={55}
                  color="#064B78"
                />

              )}

              <View
                style={
                  styles.cameraBadge
                }
              >

                <Ionicons
                  name="camera"
                  size={18}
                  color="#FFFFFF"
                />

              </View>

            </TouchableOpacity>

            <Text
              style={
                styles.changePhotoText
              }
            >
              Tap to choose photo
            </Text>

            {/* NAME */}

            <TextInput
              style={
                styles.nameInput
              }
              placeholder="Enter your name"
              placeholderTextColor="#727780"
              value={
                editName
              }
              onChangeText={
                setEditName
              }
            />

            {/* SAVE */}

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

            {/* CANCEL */}

            <TouchableOpacity
              onPress={
                closeEditProfile
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

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 50,
  },

  // =====================================
  // LOADING
  // =====================================

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#41474F",
  },

  // =====================================
  // TOP HEADER
  // =====================================

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#003456",
    letterSpacing: 1.5,
  },

  // =====================================
  // IDENTITY
  // =====================================

  identitySection: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 20,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 9,
    overflow: "hidden",
    backgroundColor: "#CFE5FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#E0E3E5",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  cameraButton: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#003456",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F7F9FB",
  },

  identityName: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: "#191C1E",
  },

  // =====================================
  // CARD
  // =====================================

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 20,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: "rgba(193,199,208,0.3)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003456",
  },

  infoRows: {
    gap: 12,
  },

  infoRow: {
    minHeight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    color: "#41474F",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 0,
  },

  infoValue: {
    color: "#191C1E",
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
    marginLeft: 10,
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(193,199,208,0.2)",
  },

  // =====================================
  // SECURITY STATUS
  // =====================================

  securityStatus: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 10,
  },

  protectedText: {
    color: "#191C1E",
    fontSize: 15,
    fontWeight: "700",
    includeFontPadding: false,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#006B5F",
    marginLeft: 8,
  },

  biometricStatus: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 10,
  },

  biometricText: {
    color: "#191C1E",
    fontSize: 15,
    fontWeight: "700",
    includeFontPadding: false,
  },

  activeBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: "#6DF5E1",
  },

  activeBadgeText: {
    color: "#006B5F",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  disabledBadge: {
    backgroundColor: "#E0E3E5",
  },

  disabledBadgeText: {
    color: "#727780",
  },

  // =====================================
  // STATISTICS
  // =====================================

  statisticsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#F2F4F6",
    borderRadius: 9,
    padding: 16,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003456",
  },

  statLabel: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "700",
    color: "#41474F",
    letterSpacing: 1,
  },

  // =====================================
  // FOOTER
  // =====================================

  footer: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },

  footerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#727780",
    letterSpacing: 2,
  },

  // =====================================
  // MODAL
  // =====================================

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    padding: 26,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#191C1E",
    marginBottom: 24,
  },

  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 9,
    backgroundColor: "#CFE5FF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },

  editAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
    resizeMode: "cover",
  },

  cameraBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 9,
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
    borderColor: "#C1C7D0",
    borderRadius: 9,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 24,
    backgroundColor: "#F7F9FB",
    color: "#191C1E",
  },

  saveButton: {
    width: "100%",
    height: 55,
    borderRadius: 9,
    backgroundColor: "#064B78",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  cancelText: {
    color: "#41474F",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 5,
  },

});