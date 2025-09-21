import { NotSignedIn } from "@/components/NotSignedIn";
import { SERVER_API_URL } from "@/config/api";
import { Header } from "@/src/components/Header";
import { useAuth } from "@/src/context/AuthContext";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, isSignedIn } = useAuth();
  const listRef = useRef<FlatList>(null);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_API_URL}/api/chat-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: data.response,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content:
            "Sorry, there was a problem with the server. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSignedIn) {
    return <NotSignedIn />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 60}
    >
      <Header title="Chat AI" />
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={messages}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 100 }} // Add padding to avoid overlap
          onContentSizeChange={() => {
            if (listRef.current && messages.length > 0) {
              listRef.current.scrollToEnd({ animated: true });
            }
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.isUser ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={item.isUser ? styles.userText : styles.aiText}>
                {item.content}
              </Text>
            </View>
          )}
        />

        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              // multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isLoading) && styles.disabledButton,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>
                {isLoading ? "..." : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#E9E9EB",
    alignSelf: "flex-start",
  },
  userText: {
    color: "white",
  },
  aiText: {
    color: "black",
  },
  inputWrapper: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E9E9EB",
    paddingBottom: Platform.OS === "ios" ? 20 : 0, // Add padding for iOS
    marginBottom: Platform.OS === "ios" ? 90 : 0,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    height: 40, // Fixed height
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 12,
    width: 60,
    height: 40, // Fixed height
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#B4B4B4",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
