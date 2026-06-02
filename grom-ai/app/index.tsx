import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StarBackground } from "@/components/StarBackground";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signIn();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
      <StarBackground />

      <View style={styles.inner}>
        <View style={styles.logoSection}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logoImage}
            contentFit="contain"
          />
          <Text style={[styles.brandName, { color: colors.foreground }]}>
            GROM PRO
          </Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Unlock Infinite{"\n"}Potential.
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
            Sign in to your journey.
          </Text>
        </View>

        <View style={styles.authSection}>
          <TouchableOpacity
            style={[
              styles.authBtn,
              { backgroundColor: "rgba(255,255,255,0.95)" },
            ]}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <AntDesign name="google" size={20} color="#4285F4" />
            <Text style={styles.authBtnText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.authBtn,
              { backgroundColor: "rgba(255,255,255,0.95)" },
            ]}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <FontAwesome name="apple" size={20} color="#000" />
            <Text style={styles.authBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.otherBtn} onPress={handleSignIn}>
            <Text style={[styles.otherText, { color: colors.mutedForeground }]}>
              Other methods
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            New to GROM PRO?{" "}
            <Text
              style={[styles.footerLink, { color: colors.accent }]}
              onPress={handleSignIn}
            >
              Create Account
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05090F",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-evenly",
  },
  logoSection: {
    alignItems: "center",
    gap: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: 3,
    fontFamily: "Inter_700Bold",
  },
  heroSection: {
    alignItems: "center",
    gap: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "700" as const,
    textAlign: "center",
    lineHeight: 44,
    fontFamily: "Inter_700Bold",
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  authSection: {
    gap: 12,
  },
  authBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 52,
    borderRadius: 28,
    paddingHorizontal: 24,
  },
  authBtnText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#111",
    fontFamily: "Inter_600SemiBold",
  },
  otherBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  otherText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontFamily: "Inter_600SemiBold",
  },
});
