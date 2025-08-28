import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../src/components/Header";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || "Pas de réponse du modèle.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erreur:", error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Erreur lors de la communication avec le serveur.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
        maxWidth: "80%",
        alignSelf: item.isUser ? "flex-end" : "flex-start",
        backgroundColor: item.isUser ? "#4f46e5" : "#e5e7eb",
      }}
    >
      <Text style={{ color: item.isUser ? "white" : "black" }}>{item.text}</Text>
      <Text style={{ fontSize: 10, marginTop: 4, color: item.isUser ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header title="AI Assistant" />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={{ flexDirection: "row", padding: 8, borderTopWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
          <TextInput
            style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 50, marginRight: 8, backgroundColor: "white" }}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre message..."
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim()}
            style={{
              padding: 12,
              borderRadius: 50,
              backgroundColor: isLoading || !inputText.trim() ? "#d1d5db" : "#4f46e5",
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={{ color: "white", fontWeight: "500" }}>Envoyer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
