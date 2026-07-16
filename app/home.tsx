import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function HomeScreen() {
  // Logo entrance animation
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;

  // Logo continuous animation
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Title animation
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(25)).current;
  const titleScale = useRef(new Animated.Value(0.9)).current;

  // Content animation
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),

      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous logo zoom in and out
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoomAnim, {
          toValue: 1.08,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(zoomAnim, {
          toValue: 0.96,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(zoomAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous logo blink
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.65,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title entrance
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 700,
        delay: 500,
        useNativeDriver: true,
      }),

      Animated.spring(titleScale, {
        toValue: 1,
        friction: 6,
        tension: 45,
        delay: 500,
        useNativeDriver: true,
      }),

      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 700,
        delay: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle and description entrance
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 700,
        delay: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 700,
        delay: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>

        {/* Animated Logo */}
        <Animated.View
          style={{
            opacity: Animated.multiply(logoOpacity, blinkAnim),
            transform: [
              { translateY: logoTranslateY },
              { scale: logoScale },
              { scale: zoomAnim },
            ],
          }}
        >
          <Image
            source={require("../assets/images/splish.png")}
            style={styles.logo}
          />
        </Animated.View>

        {/* Animated Brand Name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [
              { translateY: titleTranslateY },
              { scale: titleScale },
            ],
          }}
        >
          <Text style={styles.title}>
            Vamsi{" "}
            <Text style={styles.titleAccent}>
              Vault
            </Text>
          </Text>
        </Animated.View>

        {/* Subtitle and Description */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <Text style={styles.subtitle}>
            Secure Password Manager
          </Text>

          <Text style={styles.description}>
            Store all your passwords securely{"\n"}
            and access them anytime, anywhere.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonSection,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.getStartedText}>
              GET STARTED
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginQuestion}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          Version 1.0.0
        </Text>

        <Text style={styles.copy}>
          © 2026 Vamsi Vault
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingVertical: 35,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
    marginBottom: 22,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#123B63",
    letterSpacing: 0.8,
  },

  titleAccent: {
    color: "#D89B24",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 17,
    color: "#526579",
    fontWeight: "600",
    marginTop: 10,
    letterSpacing: 0.3,
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 25,
  },

  buttonSection: {
    width: "100%",
    marginTop: 65,
  },

  getStartedButton: {
    width: "100%",
    backgroundColor: "#064B78",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#064B78",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  getStartedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  loginQuestion: {
    fontSize: 14,
    color: "#7A8491",
  },

  loginLink: {
    fontSize: 14,
    color: "#1E6FD9",
    fontWeight: "800",
  },

  footerContainer: {
    alignItems: "center",
  },

  footer: {
    color: "#A5ADB7",
    fontSize: 12,
    marginBottom: 5,
  },

  copy: {
    color: "#C4C4C4",
    fontSize: 11,
  },
});