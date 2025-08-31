import { SERVER_API_URL } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SERVER_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch workspaces");

      return response.json();
    },
  });

  console.log(data, isError, isLoading);
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-lg font-bold mb-4">User Profile</Text>
      </ScrollView>
    </View>
  );
}
