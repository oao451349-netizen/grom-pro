import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { ChatInput } from "@/components/ChatInput";
import { GromHeader } from "@/components/GromHeader";
import { MessageBubble } from "@/components/MessageBubble";
import { StarBackground } from "@/components/StarBackground";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ChatScreen() {
  const colors = useColors();
  const { messages, isStreaming, sendMessage } = useApp();
  const router = useRouter();
  const flatRef = useRef<FlatList>(null);

  const displayMessages = [...messages].reverse();

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/history");
  };

  const handleWorkspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/workspace");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <GromHeader
          onMenuPress={handleMenu}
          rightAction={
            <TouchableOpacity onPress={handleWorkspace}>
              <Feather name="edit-2" size={20} color={colors.foreground} />
            </TouchableOpacity>
          }
        />

        <FlatList
          ref={flatRef}
          data={displayMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          inverted
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!displayMessages.length}
        />

        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
});
