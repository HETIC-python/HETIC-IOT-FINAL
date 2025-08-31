import { useRouter } from "expo-router";
import { Text, View } from "react-native";

export function NotSignedIn() {
  const router = useRouter();
  const goToSignIn = () => {
    router.push("/sign-in");
  };
  return (
    <View className="flex-1 justify-center items-center text-gray-500">
      <Text className="text-lg font-semibold text-gray-500">You are not signed in</Text>
      <Text className="text-gray-600" onPress={goToSignIn}>
        Please sign in to continue
      </Text>
    </View>
  );
}
