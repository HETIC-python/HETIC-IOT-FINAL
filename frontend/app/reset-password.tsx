import { SERVER_API_URL } from "@/config/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Yup from "yup";

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

function SuccessModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <View className="bg-white w-[90%] max-w-md rounded-2xl p-6 mx-4 items-center">
        <View className="w-16 h-16 bg-success/10 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">✓</Text>
        </View>

        <Text className="text-xl font-semibold text-center mb-2">
          Password Reset Successful!
        </Text>

        <Text className="text-secondary-600 text-center mb-6">
          Your password has been updated. You can now sign in with your new password.
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

export default function ResetPassword() {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Validate passwords
      await resetPasswordSchema.validate({ password, confirmPassword });

      const response = await fetch(
        `${SERVER_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setShowSuccess(true);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <View className="flex-1 justify-center p-4">
        <Text className="text-error text-center">Invalid reset password link</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-4">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center mb-2">Reset Password</Text>
        <Text className="text-secondary-600 text-center">
          Please enter your new password
        </Text>
      </View>

      <View className="space-y-4">
        {error && (
          <View className="p-3 bg-error/10 rounded-md">
            <Text className="text-error text-center">{error}</Text>
          </View>
        )}

        <View>
          <Text className="text-secondary-700 text-sm mb-1">New Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className="input-base-style flex-auto"
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              className="absolute right-2"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text className="text-secondary-600">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-secondary-700 text-sm mb-1">Confirm Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className="input-base-style flex-auto"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              className="absolute right-2"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text className="text-secondary-600">
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
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
              Reset Password
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push("/sign-in")}
          disabled={isLoading}
        >
          <Text className="text-secondary-600 text-center">
            ← Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>

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
