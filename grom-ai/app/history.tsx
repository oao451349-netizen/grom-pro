import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
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

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 60000);
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { chatHistory, loadChat, startNewChat } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleChatSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadChat(id);
    router.back();
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startNewChat();
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.sidebarBg, paddingBottom: bottomPad }]}>
      <StarBackground />

      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>GROM PRO</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.accountSection, { borderBottomColor: colors.border }]}>
        <View style={[styles.accountAvatar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="account" size={26} color={colors.accent} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={[styles.accountName, { color: colors.foreground }]}>My Account</Text>
          <Text style={[styles.accountEmail, { color: colors.mutedForeground }]}>
            profile@example.com
          </Text>
        </View>
      </View>

      <View style={[styles.sectionHeader, { marginTop: 8 }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Chat History</Text>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatBtn}>
          <Feather name="plus" size={18} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.historyItem, { borderBottomColor: colors.border }]}
            onPress={() => handleChatSelect(item.id)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="chat-outline"
              size={16}
              color={colors.mutedForeground}
              style={{ marginTop: 2 }}
            />
            <View style={styles.historyText}>
              <Text
                style={[styles.historyTitle, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.historyTime, { color: colors.mutedForeground }]}>
                {timeAgo(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.bottomMenu, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={18} color={colors.mutedForeground} />
          <Text style={[styles.menuLabel, { color: colors.foreground }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={18} color={colors.mutedForeground} />
          <Text style={[styles.menuLabel, { color: colors.foreground }]}>Help & Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    letterSpacing: 2,
    fontFamily: "Inter_700Bold",
  },
  accountSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  accountInfo: {
    gap: 2,
  },
  accountName: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  accountEmail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
  newChatBtn: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  historyText: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  historyTime: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  bottomMenu: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
