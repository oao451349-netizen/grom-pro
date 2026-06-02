import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Message } from "@/context/AppContext";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const colors = useColors();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View
          style={[
            styles.userBubble,
            { backgroundColor: colors.userBubble, borderColor: "rgba(124,111,224,0.3)" },
          ]}
        >
          <Text style={[styles.bubbleText, { color: colors.foreground }]}>
            {message.content}
          </Text>
        </View>
        <View style={[styles.avatar, styles.userAvatar]}>
          <MaterialCommunityIcons name="account" size={16} color="#fff" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      <View style={[styles.aiAvatarContainer]}>
        <MaterialCommunityIcons
          name="brain"
          size={16}
          color={colors.accent}
        />
      </View>
      <View style={styles.aiContentCol}>
        <Text style={[styles.aiLabel, { color: colors.accent }]}>GROM PRO</Text>
        <View
          style={[
            styles.aiBubble,
            {
              backgroundColor: colors.aiBubble,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.bubbleText, { color: colors.foreground }]}>
            {message.content || "▌"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    marginVertical: 6,
    gap: 8,
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginVertical: 6,
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    backgroundColor: "rgba(124,111,224,0.4)",
  },
  aiAvatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(167,139,250,0.15)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  aiContentCol: {
    flex: 1,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: "Inter_700Bold",
  },
  userBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderTopRightRadius: 4,
    borderWidth: 1,
  },
  aiBubble: {
    maxWidth: "90%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
});
