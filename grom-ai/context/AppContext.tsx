import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetch } from "expo/fetch";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
}

interface AppContextType {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  messages: Message[];
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  startNewChat: () => void;
  loadChat: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const genId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const SYSTEM_PROMPT = `You are GROM PRO — an advanced AI assistant with stellar intelligence. You are helpful, knowledgeable, creative, and precise. You have deep knowledge across all domains: science, technology, arts, business, philosophy, and more. Respond thoughtfully and clearly.`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: "hist-1",
      title: "Spaceflight Article v2",
      lastMessage: "Updated the introduction section...",
      timestamp: Date.now() - 27 * 60 * 1000,
      messages: [],
    },
    {
      id: "hist-2",
      title: "Deep Learning Algorithm...",
      lastMessage: "Explained backpropagation in detail",
      timestamp: Date.now() - 18 * 60 * 1000,
      messages: [],
    },
    {
      id: "hist-3",
      title: "New Product Launch Ideas",
      lastMessage: "Brainstormed 10 unique concepts",
      timestamp: Date.now() - 19 * 60 * 1000,
      messages: [],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    loadPersistedState();
  }, []);

  const loadPersistedState = async () => {
    try {
      const auth = await AsyncStorage.getItem("grom_auth");
      if (auth === "true") setIsAuthenticated(true);
      const savedMessages = await AsyncStorage.getItem("grom_messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch {}
  };

  const signIn = useCallback(async () => {
    setIsAuthenticated(true);
    await AsyncStorage.setItem("grom_auth", "true");
  }, []);

  const signOut = useCallback(async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("grom_auth");
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
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

      const updatedMessages = [...messages, userMsg, aiMsg];
      setMessages(updatedMessages);
      setIsStreaming(true);

      try {
        const domain = process.env.EXPO_PUBLIC_DOMAIN;
        const baseUrl = domain ? `https://${domain}` : "";
        const chatMessages = [
          { role: "system" as const, content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: text },
        ];

        const response = await fetch(`${baseUrl}/api/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatMessages }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullContent += data.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === aiMsg.id ? { ...m, content: fullContent } : m,
                    ),
                  );
                }
              } catch {}
            }
          }
        }

        const finalMessages = updatedMessages.map((m) =>
          m.id === aiMsg.id ? { ...m, content: fullContent } : m,
        );
        await AsyncStorage.setItem(
          "grom_messages",
          JSON.stringify(finalMessages),
        );
      } catch (err) {
        const errorContent =
          "I apologize, I'm having trouble connecting right now. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsg.id ? { ...m, content: errorContent } : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages],
  );

  const clearMessages = useCallback(async () => {
    setMessages([]);
    await AsyncStorage.removeItem("grom_messages");
  }, []);

  const startNewChat = useCallback(async () => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 30) + "..."
        : "New conversation";
      const newHist: ChatHistory = {
        id: genId(),
        title,
        lastMessage: messages[messages.length - 1]?.content?.slice(0, 40) || "",
        timestamp: Date.now(),
        messages: [...messages],
      };
      setChatHistory((prev) => [newHist, ...prev]);
    }
    setMessages([]);
    setCurrentChatId(null);
    await AsyncStorage.removeItem("grom_messages");
  }, [messages]);

  const loadChat = useCallback((id: string) => {
    const chat = chatHistory.find((c) => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(id);
    }
  }, [chatHistory]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut,
        messages,
        isStreaming,
        sendMessage,
        clearMessages,
        chatHistory,
        currentChatId,
        startNewChat,
        loadChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
