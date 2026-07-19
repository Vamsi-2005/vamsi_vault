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
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { supabase } from "../../services/supabase";

export default function DashboardScreen() {
  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [userName, setUserName] =
    useState("User");

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [totalPasswords, setTotalPasswords] =
    useState(0);

  const [recentPasswords, setRecentPasswords] =
    useState<any[]>([]);

  const [categoryCounts, setCategoryCounts] =
    useState<Record<string, number>>({});

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = [
    {
      name: "Education",
      icon: "school-outline",
      color: "#006B5F",
      background: "#D9F5EF",
    },

    {
      name: "Social",
      icon: "globe-outline",
      color: "#2B6290",
      background: "#CFE5FF",
    },

    {
      name: "Shopping",
      icon: "shopping-bag-outline",
      color: "#6C3A00",
      background: "#FFDEC1",
    },

    {
      name: "Banking",
      icon: "business-outline",
      color: "#4E2800",
      background: "#FFE9D8",
    },

    {
      name: "Entertainment",
      icon: "game-controller-outline",
      color: "#5B3B8A",
      background: "#EDE2FF",
    },
  ];

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // =====================================
      // GET CURRENT USER
      // =====================================

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/(auth)/login");
        return;
      }

      // =====================================
      // USER NAME
      // =====================================

      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      setUserName(fullName);

      // =====================================
      // PROFILE IMAGE
      // =====================================

      const avatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.profile_image ||
        null;

      setProfileImage(avatar);

      // =====================================
      // GET PASSWORDS
      // =====================================

      const {
        data: passwordData,
        error: passwordError,
      } =
        await supabase
          .from("passwords")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (passwordError) {
        console.log(
          "Password loading error:",
          passwordError.message
        );
      }

      const allPasswords =
        passwordData || [];

      // =====================================
      // TOTAL PASSWORDS
      // =====================================

      setTotalPasswords(
        allPasswords.length
      );

      // =====================================
      // CATEGORY COUNTS
      // =====================================

      const counts: Record<
        string,
        number
      > = {};

      categories.forEach(
        (category) => {
          counts[category.name] = 0;
        }
      );

      allPasswords.forEach(
        (password) => {
          const category =
            password.category;

          if (
            category &&
            counts[category] !== undefined
          ) {
            counts[category] += 1;
          }
        }
      );

      setCategoryCounts(counts);

      // =====================================
      // RECENT PASSWORDS
      // =====================================

      setRecentPasswords(
        allPasswords.slice(0, 3)
      );

      setLoading(false);

    } catch (error) {
      console.log(
        "Dashboard Error:",
        error
      );

      setLoading(false);
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh = async () => {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  };

  // =====================================
  // PROFILE IMAGE
  // =====================================

  const renderProfileImage = () => {
    if (profileImage) {
      return (
        <Image
          source={{
            uri: profileImage,
          }}
          style={styles.profileImage}
        />
      );
    }

    return (
      <View
        style={styles.profilePlaceholder}
      >
        <Ionicons
          name="person"
          size={30}
          color="#064B78"
        />
      </View>
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#064B78"
        />

        <Text
          style={styles.loadingText}
        >
          Loading Dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#064B78"
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <View
          style={styles.header}
        >

          <View
            style={styles.headerLeft}
          >

            {/* PROFILE IMAGE */}

            <View
              style={styles.profileBox}
            >
              {renderProfileImage()}
            </View>

            {/* USER NAME */}

            <View
              style={styles.welcomeContainer}
            >

              <Text
                style={styles.userName}
                numberOfLines={1}
              >
                {userName}
              </Text>

              <Text
                style={styles.secureText}
              >
                Your passwords are secure
              </Text>

            </View>

          </View>

          {/* SETTINGS */}

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() =>
              router.push(
                "/(tabs)/profile"
              )
            }
            activeOpacity={0.7}
          >

            <Ionicons
              name="settings-outline"
              size={25}
              color="#41474F"
            />

          </TouchableOpacity>

        </View>

        {/* =====================================
            TOTAL PASSWORDS
        ===================================== */}

        <View
          style={styles.totalCard}
        >

          <View
            style={styles.decorativeLock}
          >
            <Ionicons
              name="lock-closed"
              size={115}
              color="#FFFFFF"
            />
          </View>

          <View
            style={styles.totalHeader}
          >

            <View
              style={styles.shieldBox}
            >

              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#FFFFFF"
              />

            </View>

            <Text
              style={styles.totalLabel}
            >
              TOTAL PASSWORDS
            </Text>

          </View>

          <View
            style={styles.totalValueRow}
          >

            <Text
              style={styles.totalValue}
            >
              {totalPasswords}
            </Text>

            <Text
              style={styles.protectedText}
            >
              Protected items
            </Text>

          </View>

          <View
            style={styles.securityContainer}
          >

            <Text
              style={styles.securityText}
            >
              Security Score:{" "}
              {totalPasswords > 0
                ? "92%"
                : "0%"}
            </Text>

            <Text
              style={styles.excellentText}
            >
              {totalPasswords > 0
                ? "Excellent"
                : "Add passwords"}
            </Text>

          </View>

        </View>

        {/* =====================================
            CATEGORIES
        ===================================== */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Categories
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoryScroll
            }
          >

            {categories.map(
              (category) => (

                <TouchableOpacity
                  key={category.name}
                  style={
                    styles.categoryCard
                  }
                  activeOpacity={0.8}
                >

                  <View
                    style={[
                      styles.categoryIconBox,
                      {
                        backgroundColor:
                          category.background,
                      },
                    ]}
                  >

                    <Ionicons
                      name={
                        category.icon as any
                      }
                      size={22}
                      color={
                        category.color
                      }
                    />

                  </View>

                  <Text
                    style={
                      styles.categoryName
                    }
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>

                  <Text
                    style={
                      styles.categoryItems
                    }
                  >
                    {categoryCounts[
                      category.name
                    ] || 0}{" "}
                    ITEMS
                  </Text>

                </TouchableOpacity>

              )
            )}

          </ScrollView>

        </View>

        {/* =====================================
            RECENT PASSWORDS
        ===================================== */}

        <View
          style={styles.recentHeader}
        >

          <Text
            style={styles.sectionTitle}
          >
            Recent Passwords
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/(tabs)/search"
              )
            }
            activeOpacity={0.7}
          >

            <Text
              style={styles.seeAllText}
            >
              See all
            </Text>

          </TouchableOpacity>

        </View>

        {/* =====================================
            PASSWORD LIST
        ===================================== */}

        {recentPasswords.length ===
        0 ? (

          <View
            style={styles.emptyCard}
          >

            <Ionicons
              name="lock-open-outline"
              size={34}
              color="#064B78"
            />

            <Text
              style={styles.emptyTitle}
            >
              No Passwords Found
            </Text>

            <Text
              style={
                styles.emptySubtitle
              }
            >
              Add your first password
              to get started.
            </Text>

          </View>

        ) : (

          recentPasswords.map(
            (item) => (

              <TouchableOpacity
                key={item.id}
                style={
                  styles.passwordCard
                }
                onPress={() =>
                  router.push({
                    pathname:
                      "/password/details",
                    params: {
                      id: item.id,
                    },
                  })
                }
                activeOpacity={0.8}
              >

                <View
                  style={
                    styles.passwordLeft
                  }
                >

                  <View
                    style={
                      styles.passwordIconBox
                    }
                  >

                    <MaterialCommunityIcons
                      name="web"
                      size={26}
                      color="#064B78"
                    />

                  </View>

                  <View
                    style={
                      styles.passwordInfo
                    }
                  >

                    <Text
                      style={
                        styles.passwordTitle
                      }
                      numberOfLines={1}
                    >
                      {item.app_name}
                    </Text>

                    <Text
                      style={
                        styles.passwordEmail
                      }
                      numberOfLines={1}
                    >
                      {item.email ||
                        item.username ||
                        "No email added"}
                    </Text>

                  </View>

                </View>

                <TouchableOpacity
                  style={
                    styles.moreButton
                  }
                  onPress={() => {}}
                >

                  <Ionicons
                    name="ellipsis-vertical"
                    size={22}
                    color="#41474F"
                  />

                </TouchableOpacity>

              </TouchableOpacity>

            )
          )

        )}

        {/* =====================================
            ADD NEW PASSWORD
        ===================================== */}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push(
              "/(tabs)/add-password"
            )
          }
          activeOpacity={0.85}
        >

          <Ionicons
            name="add"
            size={26}
            color="#FFFFFF"
          />

          <Text
            style={styles.addButtonText}
          >
            Add New Password
          </Text>

        </TouchableOpacity>

      </ScrollView>

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
    paddingTop: 50,
    paddingBottom: 40,
  },

  // =====================================
  // LOADING
  // =====================================

  loadingContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F7F9FB",
  },

  loadingText: {
    marginTop: 14,

    fontSize: 15,

    color: "#41474F",

    fontWeight: "600",
  },

  // =====================================
  // HEADER
  // =====================================

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 26,
  },

  headerLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  profileBox: {
    width: 58,

    height: 58,

    borderRadius: 16,

    overflow: "hidden",

    backgroundColor: "#CFE5FF",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 14,
  },

  profileImage: {
    width: "100%",

    height: "100%",
  },

  profilePlaceholder: {
    width: "100%",

    height: "100%",

    justifyContent: "center",

    alignItems: "center",
  },

  welcomeContainer: {
    flex: 1,
  },

  userName: {
    fontSize: 27,

    lineHeight: 33,

    fontWeight: "800",

    color: "#003456",
  },

  secureText: {
    fontSize: 13,

    lineHeight: 19,

    color: "#41474F",

    marginTop: 3,
  },

  settingsButton: {
    width: 44,

    height: 44,

    justifyContent: "center",

    alignItems: "center",

    borderRadius: 22,
  },

  // =====================================
  // TOTAL PASSWORD CARD
  // =====================================

  totalCard: {
    backgroundColor: "#064B78",

    borderRadius: 14,

    padding: 20,

    overflow: "hidden",

    marginBottom: 28,

    shadowColor: "#2B6290",

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 12,

    elevation: 5,
  },

  decorativeLock: {
    position: "absolute",

    right: -17,

    top: -18,

    opacity: 0.08,
  },

  totalHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 9,
  },

  shieldBox: {
    width: 34,

    height: 34,

    borderRadius: 9,

    backgroundColor:
      "rgba(255,255,255,0.12)",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 10,
  },

  totalLabel: {
    fontSize: 12,

    fontWeight: "700",

    letterSpacing: 1.4,

    color: "rgba(255,255,255,0.78)",
  },

  totalValueRow: {
    flexDirection: "row",

    alignItems: "baseline",

    gap: 9,
  },

  totalValue: {
    fontSize: 34,

    lineHeight: 42,

    fontWeight: "800",

    color: "#FFFFFF",
  },

  protectedText: {
    fontSize: 14,

    color: "rgba(255,255,255,0.82)",
  },

  securityContainer: {
    marginTop: 16,

    paddingTop: 14,

    borderTopWidth: 1,

    borderTopColor:
      "rgba(255,255,255,0.12)",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  securityText: {
    fontSize: 13,

    color: "rgba(255,255,255,0.68)",
  },

  excellentText: {
    fontSize: 13,

    fontWeight: "700",

    color: "#71F8E4",
  },

  // =====================================
  // CATEGORIES
  // =====================================

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 21,

    lineHeight: 28,

    fontWeight: "700",

    color: "#003456",

    marginBottom: 14,
  },

  categoryScroll: {
    gap: 10,

    paddingRight: 10,
  },

  categoryCard: {
    width: 100,
    height: 100,

    backgroundColor: "#FFFFFF",

    borderRadius: 13,

    borderWidth: 1,

    borderColor:
      "rgba(193,199,208,0.45)",

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 5,

    shadowColor: "#2B6290",

    shadowOffset: {
      width: 0,

      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 8,

    elevation: 2,
  },

  categoryIconBox: {
    width: 38,

    height: 38,

    borderRadius: 10,

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 6,
  },

  categoryName: {
    fontSize: 12,

    fontWeight: "700",

    color: "#191C1E",

    textAlign: "center",
  },

  categoryItems: {
    fontSize: 8,

    fontWeight: "600",

    letterSpacing: 0.6,

    color: "#727780",

    marginTop: 3,
  },

  // =====================================
  // RECENT PASSWORDS
  // =====================================

  recentHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 13,
  },

  seeAllText: {
    fontSize: 15,

    fontWeight: "700",

    color: "#064B78",

    paddingVertical: 6,

    paddingHorizontal: 4,
  },

  // =====================================
  // PASSWORD CARD
  // =====================================

  passwordCard: {
    minHeight: 76,

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    paddingHorizontal: 14,

    paddingVertical: 12,

    marginBottom: 11,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    borderWidth: 1,

    borderColor:
      "rgba(193,199,208,0.25)",

    shadowColor: "#2B6290",

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.05,

    shadowRadius: 10,

    elevation: 2,
  },

  passwordLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,

    minWidth: 0,
  },

  passwordIconBox: {
    width: 48,

    height: 48,

    borderRadius: 12,

    backgroundColor: "#F2F4F6",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 12,
  },

  passwordInfo: {
    flex: 1,

    minWidth: 0,
  },

  passwordTitle: {
    fontSize: 16,

    fontWeight: "700",

    color: "#191C1E",

    marginBottom: 3,
  },

  passwordEmail: {
    fontSize: 13,

    color: "#41474F",
  },

  moreButton: {
    width: 36,

    height: 40,

    justifyContent: "center",

    alignItems: "center",

    marginLeft: 5,
  },

  // =====================================
  // EMPTY CARD
  // =====================================

  emptyCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 25,

    alignItems: "center",

    marginBottom: 15,

    borderWidth: 1,

    borderColor: "#E0E3E5",
  },

  emptyTitle: {
    fontSize: 17,

    fontWeight: "700",

    color: "#191C1E",

    marginTop: 10,

    marginBottom: 5,
  },

  emptySubtitle: {
    fontSize: 14,

    color: "#727780",

    textAlign: "center",
  },

  // =====================================
  // ADD BUTTON
  // =====================================

  addButton: {
    height: 58,

    backgroundColor: "#064B78",

    borderRadius: 13,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 8,

    marginTop: 10,

    marginBottom: 20,

    shadowColor: "#064B78",

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 4,
  },

  addButtonText: {
    fontSize: 16,

    fontWeight: "700",

    color: "#FFFFFF",
  },

});