import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../src/context/AuthContext";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, router]);

  const handleSignIn = async () => {
    try {
      setError(null);
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      console.log("Attempting sign in for user:", email);
      await signIn(email, password);
      console.log("SignIn successful for user:", email);
      router.replace("/(tabs)");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <View className="flex-1 justify-center p-4">
      <View className="h-12 mb-4">
        {error && (
          <View className="p-3 bg-error/10 rounded-md">
            <Text className="text-error text-center">{error}</Text>
          </View>
        )}
      </View>

      <View className="flex flex-col items-stretch gap-5">
        <View>
          <TextInput
            className="input-base-style flex-auto"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View>
          <TextInput
            className="input-base-style flex-auto"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <View className="flex flex-col items-center gap-5 mt-6">
        <TouchableOpacity
          className="w-full bg-primary-500 py-3 rounded-md"
          onPress={handleSignIn}
        >
          <Text className="text-white text-center font-semibold">Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full bg-secondary-200 py-3 rounded-md"
          onPress={() => router.push("/sign-up")}
        >
          <Text className="text-secondary-800 text-center font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
