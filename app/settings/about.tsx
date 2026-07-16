import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* HEADER */}

        <LinearGradient
          colors={["#6D28D9", "#9333EA", "#F97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >

          <Text style={styles.logo}>
            🔐
          </Text>

          <Text style={styles.title}>
            VAMSI VAULT
          </Text>

          <Text style={styles.subtitle}>
            Your personal digital security space
          </Text>

          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              VERSION 1.0.0
            </Text>
          </View>

        </LinearGradient>


        {/* ABOUT ME */}

        <Text style={styles.sectionTitle}>
          ABOUT ME
        </Text>

        <View style={styles.aboutCard}>

          <View style={styles.aboutIcon}>
            <Text style={styles.iconText}>
              👨‍💻
            </Text>
          </View>

          <View style={styles.aboutContent}>

            <Text style={styles.aboutName}>
              Muluguru Vamsi
            </Text>

            <Text style={styles.aboutDescription}>
              I am a passionate developer interested in
              technology, cybersecurity, and building
              useful applications.
            </Text>

          </View>

        </View>


        {/* APPLICATION */}

        <Text style={styles.sectionTitle}>
          APPLICATION
        </Text>


        {/* VERSION */}

        <View style={styles.card}>

          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#FFF7ED" },
            ]}
          >
            <Text style={styles.iconText}>
              📱
            </Text>
          </View>

          <View style={styles.cardContent}>

            <Text style={styles.cardTitle}>
              Version
            </Text>

            <Text style={styles.cardValue}>
              1.0.0
            </Text>

          </View>

        </View>


        {/* DEVELOPER */}

        <View style={styles.card}>

          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#F3E8FF" },
            ]}
          >
            <Text style={styles.iconText}>
              👨‍💻
            </Text>
          </View>

          <View style={styles.cardContent}>

            <Text style={styles.cardTitle}>
              Developer
            </Text>

            <Text style={styles.cardValue}>
              Muluguru Vamsi
            </Text>

          </View>

        </View>


        {/* EDUCATION */}

        <View style={styles.card}>

          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#ECFDF5" },
            ]}
          >
            <Text style={styles.iconText}>
              🎓
            </Text>
          </View>

          <View style={styles.cardContent}>

            <Text style={styles.cardTitle}>
              Education
            </Text>

            <Text style={styles.cardValue}>
              Rayalaseema University
            </Text>

            <Text style={styles.cardSubValue}>
              College of Engineering
            </Text>

          </View>

        </View>


        {/* TECHNOLOGIES */}

        <Text style={styles.sectionTitle}>
          BUILT WITH
        </Text>

        <View style={styles.techContainer}>

          <View
            style={[
              styles.techBox,
              { backgroundColor: "#E0F2FE" },
            ]}
          >
            <Text style={styles.techIcon}>
              ⚛️
            </Text>

            <Text style={styles.techText}>
              React Native
            </Text>
          </View>


          <View
            style={[
              styles.techBox,
              { backgroundColor: "#FEF3C7" },
            ]}
          >
            <Text style={styles.techIcon}>
              🚀
            </Text>

            <Text style={styles.techText}>
              Expo Router
            </Text>
          </View>


          <View
            style={[
              styles.techBox,
              { backgroundColor: "#DCFCE7" },
            ]}
          >
            <Text style={styles.techIcon}>
              ⚡
            </Text>

            <Text style={styles.techText}>
              Supabase
            </Text>
          </View>


          <View
            style={[
              styles.techBox,
              { backgroundColor: "#FCE7F3" },
            ]}
          >
            <Text style={styles.techIcon}>
              💙
            </Text>

            <Text style={styles.techText}>
              TypeScript
            </Text>
          </View>

        </View>


        {/* SECURITY MESSAGE */}

        <LinearGradient
          colors={["#312E81", "#4C1D95"]}
          style={styles.securityCard}
        >

          <Text style={styles.securityIcon}>
            🛡️
          </Text>

          <View style={styles.securityContent}>

            <Text style={styles.securityTitle}>
              Your Security Matters
            </Text>

            <Text style={styles.securityText}>
              Vamsi Vault is designed to help you
              securely manage your important passwords
              in one private place.
            </Text>

          </View>

        </LinearGradient>


        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            © 2026 Vamsi Vault
          </Text>

          <Text style={styles.footerSubText}>
            Built with passion and technology
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    paddingBottom: 40,
  },


  // HEADER

  header: {
    paddingTop: 45,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: "center",
  },

  logo: {
    fontSize: 65,
    marginBottom: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 3,
  },

  subtitle: {
    color: "#F3E8FF",
    fontSize: 15,
    marginTop: 10,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  versionBadge: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  versionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },


  // SECTION

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    marginHorizontal: 22,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#64748B",
  },


  // ABOUT ME

  aboutCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#64748B",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  aboutIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },

  aboutContent: {
    flex: 1,
    marginLeft: 16,
  },

  aboutName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
  },

  aboutDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
  },


  // CARDS

  card: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#64748B",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  cardIcon: {
    width: 55,
    height: 55,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    fontSize: 27,
  },

  cardContent: {
    marginLeft: 16,
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 5,
  },

  cardValue: {
    fontSize: 15,
    color: "#64748B",
  },

  cardSubValue: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 3,
  },


  // TECHNOLOGIES

  techContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  techBox: {
    width: "48%",
    minHeight: 105,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  techIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  techText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },


  // SECURITY CARD

  securityCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 22,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    fontSize: 42,
  },

  securityContent: {
    flex: 1,
    marginLeft: 16,
  },

  securityTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },

  securityText: {
    color: "#DDD6FE",
    fontSize: 13,
    lineHeight: 20,
  },


  // FOOTER

  footer: {
    alignItems: "center",
    marginTop: 28,
  },

  footerText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "700",
  },

  footerSubText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 6,
  },

});

