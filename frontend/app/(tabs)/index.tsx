import React from "react";
import {
  ScrollView,
  Text,
  View
} from "react-native";

type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-lg font-bold mb-4">User Profile</Text>
      </ScrollView>
    </View>
  );
}
