import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface Props {
  onSend: (text: string) => void;
  isStreaming: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isStreaming,
  placeholder = "Поговорите с GROM PRO...",
}: Props) {
  const [text, setText] = useState("");
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSend(trimmed);
    setText("");
  };

  const handleCamera = () => {
    if (Platform.OS === "web") {
      cameraInputRef.current?.click();
    }
  };

  const handleFile = () => {
    if (Platform.OS === "web") {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "camera" | "file",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = type === "camera" ? "📷 Фото" : "📎 Файл";
    onSend(`${label}: ${file.name}`);
    e.target.value = "";
  };

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const canSend = text.trim().length > 0 && !isStreaming;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBar,
          borderTopColor: colors.border,
          paddingBottom: bottomPad + 8,
        },
      ]}
    >
      {Platform.OS === "web" && (
        <>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelected(e, "camera")}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelected(e, "file")}
          />
        </>
      )}

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.iconBtn} onPress={handleCamera}>
          <Feather name="camera" size={19} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleFile}>
          <Feather name="paperclip" size={19} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialCommunityIcons
            name="microphone-outline"
            size={20}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>

        <TextInput
          style={[styles.textInput, { color: colors.foreground }]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={4000}
          onSubmitEditing={Platform.OS === "web" ? handleSend : undefined}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor: canSend ? colors.primary : colors.secondary,
            },
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.8}
        >
          {isStreaming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather
              name="send"
              size={17}
              color={canSend ? "#fff" : colors.mutedForeground}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 46,
    gap: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 6,
  },
  iconBtn: {
    padding: 5,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
});
