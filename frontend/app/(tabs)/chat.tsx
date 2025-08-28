import { SERVER_API_URL } from "@/config/api";
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
import { useAuth } from "../../src/context/AuthContext";
import { Message } from "@/src/utils/Types";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "Hello! How can I help you with your IoT environment monitoring today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
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
      const response = await fetch(`${SERVER_API_URL}/api/chat-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, there was an error processing your request. Please try again.",
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
      className={`p-3 rounded-lg mb-2 max-w-[80%] ${
        item.isUser
          ? "bg-primary-500 self-end rounded-tr-none"
          : "bg-gray-200 self-start rounded-tl-none"
      }`}
    >
      <Text
        className={`${item.isUser ? "text-white" : "text-gray-800"}`}
      >
        {item.text}
      </Text>
      <Text
        className={`text-xs mt-1 ${
          item.isUser ? "text-white/70" : "text-gray-500"
        }`}
      >
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white">
        <Header title="AI Assistant" />
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View className="p-2 border-t border-gray-200 bg-gray-50 flex-row items-center">
          <TextInput
            className="flex-1 p-2 bg-white border border-gray-300 rounded-full mr-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim()}
            className={`p-2 rounded-full ${
              isLoading || !inputText.trim() ? "bg-gray-300" : "bg-primary-500"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white px-3 py-1 font-medium">Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
//   );
// }
