import { SERVER_API_URL } from "@/config/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

type Workspace = {
  id: string;
  name: string;
};

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`${SERVER_API_URL}/api/workspace`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await response.json();
      setWorkspaces(data);
    } catch (error: any) {
      setError("Error fetching workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 p-4 justify-center items-center">
        <ActivityIndicator size="large" color="#0072ff" />
      </View>
    );
  }

  if (workspaces.length === 0) {
    return (
      <View className="flex-1 p-4 justify-center items-center">
        <Text className="text-base text-secondary-600 text-center mt-5">
          No workspaces available at the moment. You can purchase our kit or
          wait for your account activation if you&apos;ve already made a
          purchase.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 bg-white rounded-lg mb-3 shadow-sm border border-secondary-200">
            <Text className="text-lg font-bold text-secondary-800">
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
