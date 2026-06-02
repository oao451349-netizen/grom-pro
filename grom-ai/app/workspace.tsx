import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatInput } from "@/components/ChatInput";
import { MessageBubble } from "@/components/MessageBubble";
import { StarBackground } from "@/components/StarBackground";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Message } from "@/context/AppContext";

const INITIAL_DOC = `Quantum Entanglement Article

Quantum entanglement is a phenomenon in quantum mechanics where two or more particles become interconnected in such a way that the quantum state of each particle cannot be described independently of the others.

When particles are entangled, measuring the state of one particle instantaneously determines the state of its partner — regardless of the distance separating them.

This phenomenon, which Einstein famously called "spooky action at a distance," has profound implications for quantum computing, cryptography, and our fundamental understanding of reality.

Researchers continue to explore entanglement as a resource for quantum information processing and secure communications.`;

const INITIAL_WORKSPACE_MESSAGES: Message[] = [
  {
    id: "ws-1",
    role: "assistant",
    content: "Writing article on quantum entanglement... What's next?",
    timestamp: Date.now() - 3 * 60 * 1000,
  },
];

export default function WorkspaceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isStreaming, sendMessage } = useApp();
  const [docText, setDocText] = useState(INITIAL_DOC);
  const [workspaceMessages, setWorkspaceMessages] = useState<Message[]>(
    INITIAL_WORKSPACE_MESSAGES,
  );
  const [editingParagraph, setEditingParagraph] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const genId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleWorkspaceSend = async (text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: genId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const aiMsg: Message = {
      id: genId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setWorkspaceMessages((prev) => [...prev, userMsg, aiMsg]);

    const isDocEdit =
      text.toLowerCase().includes("rephrase") ||
      text.toLowerCase().includes("rewrite") ||
      text.toLowerCase().includes("edit") ||
      text.toLowerCase().includes("change") ||
      text.toLowerCase().includes("modify");

    if (isDocEdit && editingParagraph !== null) {
      setTimeout(() => {
        setWorkspaceMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content:
                    "I've rephrased the selected paragraph for clarity and improved flow. The updated version is now in the document.",
                }
              : m,
          ),
        );
        const paragraphs = docText.split("\n\n");
        if (paragraphs[editingParagraph]) {
          paragraphs[editingParagraph] =
            "Quantum entanglement represents one of the most profound and counterintuitive aspects of quantum physics — a phenomenon where particles become fundamentally linked, sharing a quantum state that transcends spatial boundaries.";
          setDocText(paragraphs.join("\n\n"));
        }
        setEditingParagraph(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setWorkspaceMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  content:
                    "I can help you refine this article. You can tap on any paragraph in the document to select it, then ask me to rephrase, expand, or improve it.",
                }
              : m,
          ),
        );
      }, 1000);
    }
  };

  const handleParagraphPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingParagraph(index);
  };

  const handleSaveDraft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const paragraphs = docText.split("\n\n");
  const [title, ...bodyParagraphs] = paragraphs;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarBackground />

      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border, backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="x" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerBrand, { color: colors.foreground }]}>GROM PRO</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Split-Screen Workspace (Active Draft)
          </Text>
        </View>
        <TouchableOpacity style={[styles.saveHeaderBtn, { backgroundColor: colors.primary }]} onPress={handleSaveDraft}>
          <Text style={[styles.saveHeaderText, { color: "#fff" }]}>
            {isSaved ? "Saved!" : "Save Draft"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.splitContainer}>
        <View style={[styles.leftPanel, { borderRightColor: colors.border }]}>
          <View style={[styles.panelHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.panelTitle, { color: colors.mutedForeground }]}>
              Chat & Instructions
            </Text>
          </View>

          <FlatList
            data={[...workspaceMessages].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.miniMessage}>
                <Text style={[styles.miniRole, { color: item.role === "user" ? colors.accent : colors.mutedForeground }]}>
                  {item.role === "user" ? "You:" : "AI GROM PRO"}
                </Text>
                <Text style={[styles.miniContent, { color: colors.foreground }]} numberOfLines={4}>
                  {item.content || "▌"}
                </Text>
              </View>
            )}
            inverted
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          />

          <ChatInput
            onSend={handleWorkspaceSend}
            isStreaming={false}
            placeholder="Talk to GROM PRO..."
          />
        </View>

        <View style={[styles.rightPanel, { backgroundColor: colors.docBg }]}>
          <View style={[styles.panelHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.panelTitle, { color: colors.mutedForeground }]}>
              Active Draft Workspace
            </Text>
          </View>

          <ScrollView style={styles.docScroll} contentContainerStyle={styles.docContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.docTitle, { color: colors.foreground }]}>
              {title?.trim()}
            </Text>

            {bodyParagraphs.map((para, idx) => {
              const isEditing = editingParagraph === idx + 1;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleParagraphPress(idx + 1)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.paragraph,
                      isEditing && {
                        backgroundColor: "rgba(124,111,224,0.15)",
                        borderColor: colors.primary,
                        borderWidth: 1,
                        borderRadius: 8,
                      },
                    ]}
                  >
                    {isEditing && (
                      <View style={[styles.editingBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.editingBadgeText}>
                          Editing Paragraph {idx + 1}
                        </Text>
                        <Feather name="chevron-left" size={12} color="#fff" />
                        <Feather name="chevron-right" size={12} color="#fff" />
                      </View>
                    )}
                    <Text style={[styles.paraText, { color: colors.foreground }]}>
                      {para?.trim()}
                    </Text>
                    {isEditing && (
                      <View style={[styles.rephraseHint, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.rephraseHintText, { color: colors.foreground }]}>
                          Highlight paragraph
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={[styles.headersSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.headersSectionTitle, { color: colors.mutedForeground }]}>
                Headers
              </Text>
              <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
            </View>
          </ScrollView>

          <View style={[styles.docActions, { borderTopColor: colors.border, paddingBottom: bottomPad + 4 }]}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleSaveDraft}
            >
              <Text style={styles.actionBtnText}>{isSaved ? "Saved!" : "Save Draft"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => Alert.alert("Export", "Document will be exported.")}
            >
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Export File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => Alert.alert("Share", "Share link copied!")}
            >
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  headerBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: "700" as const,
    letterSpacing: 1,
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  saveHeaderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  saveHeaderText: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  splitContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: "42%",
    borderRightWidth: 1,
  },
  rightPanel: {
    flex: 1,
  },
  panelHeader: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  panelTitle: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_600SemiBold",
  },
  miniMessage: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  miniRole: {
    fontSize: 10,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  miniContent: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Inter_400Regular",
  },
  docScroll: {
    flex: 1,
  },
  docContent: {
    padding: 12,
    gap: 12,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 4,
    padding: 4,
  },
  paraText: {
    fontSize: 11,
    lineHeight: 17,
    fontFamily: "Inter_400Regular",
  },
  editingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  editingBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
  rephraseHint: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  rephraseHintText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  headersSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  headersSectionTitle: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  docActions: {
    flexDirection: "row",
    padding: 8,
    gap: 6,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
});
