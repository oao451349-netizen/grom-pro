import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useColors } from "@/hooks/useColors";

interface Props {
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  onMenuPress?: () => void;
}

export function GromHeader({
  showBack = false,
  title = "GROM PRO",
  subtitle = "v1.8 | Stellar Edition",
  rightAction,
  onMenuPress,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 8,
          backgroundColor: colors.headerBg,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.sideBtn}
        onPress={onMenuPress ?? (() => router.back())}
      >
        <MaterialCommunityIcons
          name={showBack ? "arrow-left" : "view-grid-outline"}
          size={22}
          color={colors.foreground}
        />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideBtn}>
        {rightAction ?? (
          <MaterialCommunityIcons
            name="view-grid-outline"
            size={22}
            color={colors.foreground}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  sideBtn: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: 1.5,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
});
