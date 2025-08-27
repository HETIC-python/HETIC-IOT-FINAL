import { SERVER_API_URL } from "@/config/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      if (!email) {
        setError("Email is required");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);

      const response = await fetch(
        `${SERVER_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset password email");
      }

      setSuccessMessage(
        "If an account exists with this email, you will receive password reset instructions."
      );

      // Automatically return to sign-in page after 5 seconds
      setTimeout(() => {
        router.replace("/sign-in");
      }, 5000);
    } catch (error) {
      setError(
        "There was an error processing your request. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center mb-2">
          Reset Password
        </Text>
        <Text className="text-secondary-600 text-center">
          Enter your email address and we&apos;ll send you instructions to reset your
          password.
        </Text>
      </View>

      <View className="space-y-4">
        {error && (
          <View className="p-3 bg-error/10 rounded-md">
            <Text className="text-error text-center">{error}</Text>
          </View>
        )}

        {successMessage && (
          <View className="p-3 bg-success/10 rounded-md">
            <Text className="text-success text-center">{successMessage}</Text>
          </View>
        )}

        <View>
          <TextInput
            className="input-base-style"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          className={`w-full py-3 rounded-md ${
            isLoading ? "bg-primary-300" : "bg-primary-500"
          }`}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Send Reset Instructions
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => router.replace("/sign-in")}
          disabled={isLoading}
        >
          <Text className="text-secondary-600 text-center">
            ← Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
