import { SERVER_API_URL } from "@/config/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

function SuccessModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <View className="bg-white w-[90%] max-w-md rounded-2xl p-6 mx-4 items-center">
        <View className="w-16 h-16 bg-success/10 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">✓</Text>
        </View>

        <Text className="text-xl font-semibold text-center mb-2">
          Email Verified Successfully!
        </Text>

        <Text className="text-secondary-600 text-center mb-6">
          Your account has been verified. You can now sign in to access your
          account.
        </Text>

        <TouchableOpacity
          onPress={onClose}
          className="bg-primary-500 px-8 py-3 rounded-full w-full"
        >
          <Text className="text-white text-center font-semibold">
            Continue to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ValidateAccount() {
  const { token } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateAccount = async () => {
      try {
        if (!token) {
          setError("Invalid validation link");
          return;
        }

        const response = await fetch(
          `${SERVER_API_URL}/api/auth/validate/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to validate account");
        }

        setShowSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateAccount();
  }, [token]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#0072ff" />
        <Text className="text-secondary-600 mt-4">
          Validating your account...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center p-4">
        <View className="p-6 bg-white rounded-xl shadow-sm">
          <Text className="text-xl font-semibold text-center text-error mb-4">
            Validation Failed
          </Text>
          <Text className="text-secondary-600 text-center mb-6">{error}</Text>
          <TouchableOpacity
            onPress={() => router.replace("/sign-in")}
            className="bg-primary-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white text-center font-semibold">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-4">
      <SuccessModal
        isVisible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.replace("/sign-in");
        }}
      />
    </View>
  );
}
