import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY_COLOR = "#064B78";

function AnimatedTabIcon({
  focused,
  name,
  size,
}: {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  size: number;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0.85,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Ionicons
        name={name}
        size={size}
        color={focused ? PRIMARY_COLOR : "#9CA3AF"}
      />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.tabBarLabel,

        tabBarItemStyle: styles.tabBarItem,

        animation: "shift",

        sceneStyle: {
          backgroundColor: "#FAFAF9",
        },
      }}
    >
      {/* HOME */}

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",

          tabBarIcon: ({ focused, size }) => (
            <AnimatedTabIcon
              focused={focused}
              name={focused ? "home" : "home-outline"}
              size={size}
            />
          ),
        }}
      />

      {/* ADD */}

      <Tabs.Screen
        name="add-password"
        options={{
          title: "Add",

          tabBarIcon: ({ focused, size }) => (
            <AnimatedTabIcon
              focused={focused}
              name={focused ? "add-circle" : "add-circle-outline"}
              size={size}
            />
          ),
        }}
      />

      {/* SEARCH */}

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",

          tabBarIcon: ({ focused, size }) => (
            <AnimatedTabIcon
              focused={focused}
              name={focused ? "search" : "search-outline"}
              size={size}
            />
          ),
        }}
      />

      {/* PROFILE */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ focused, size }) => (
            <AnimatedTabIcon
              focused={focused}
              name={focused ? "person" : "person-outline"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",

    paddingTop: 7,
    paddingBottom: 8,

    elevation: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  tabBarItem: {
    justifyContent: "center",
    alignItems: "center",
  },

  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});