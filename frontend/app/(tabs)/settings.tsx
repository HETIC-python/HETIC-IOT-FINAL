import { UserProfile } from "@/src/utils/Types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SERVER_API_URL } from "../../config/api";
import { Header } from "../../src/components/Header";
import { useAuth } from "../../src/context/AuthContext";

export default function Settings() {
  const { token, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataRefreshRate, setDataRefreshRate] = useState("60"); // in seconds

  const { data: profil, isError, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>fetchUserProfile(),
    enabled: !!token,
    retry: (failureCount, error) => {
      console.log("Error fetching userData", failureCount);
      console.log("Error", error);
      return failureCount < 3;
    }
  })
  console.log("Profile data:", profil);

  const fetchUserProfile = async () => {
    // This is just a placeholder - replace with your actual API endpoint
    const response = await fetch(`${SERVER_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  };

  const handleUpdateProfile = async () => {
    if (!userProfile) return;
    
    try {
      // This is just a placeholder - replace with your actual API endpoint
      const response = await fetch(`${SERVER_API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        setEditMode(false);
        Alert.alert("Success", "Profile updated successfully");
        // Refetch the data to get the updated profile
        refetch();
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: async () => {
            await signOut();
            router.replace("/sign-in");
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderProfileSection = () => (
    <View className="mb-6 bg-white rounded-lg p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Profile Information</Text>
        {!editMode ? (
          <TouchableOpacity onPress={() => setEditMode(true)}>
            <Text className="text-primary-500 font-medium">Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleUpdateProfile} disabled={isLoading}>
            <Text className="text-primary-500 font-medium">
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {profil ? (
        <View className="space-y-4">
          <View>
            <Text className="text-sm text-gray-500 mb-1">Email</Text>
            <Text className="text-gray-800">{profil.email}</Text>
          </View>

          <View>
            <Text className="text-sm text-gray-500 mb-1">First Name</Text>
            {editMode ? (
              <TextInput
                className="p-2 border border-gray-300 rounded-md"
                value={profil.firstName}
                onChangeText={(text) =>
                  setUserProfile((prev) => prev ? { ...prev, firstName: text } : null)
                }
              />
            ) : (
              <Text className="text-gray-800">{profil.firstName}</Text>
            )}
          </View>

          <View>
            <Text className="text-sm text-gray-500 mb-1">Last Name</Text>
            {editMode ? (
              <TextInput
                className="p-2 border border-gray-300 rounded-md"
                value={profil.lastName}
                onChangeText={(text) =>
                  setUserProfile((prev) => prev ? { ...prev, lastName: text } : null)
                }
              />
            ) : (
              <Text className="text-gray-800">{profil.lastName}</Text>
            )}
          </View>

          {/* <View>
            <Text className="text-sm text-gray-500 mb-1">Phone</Text>
            {editMode ? (
              <TextInput
                className="p-2 border border-gray-300 rounded-md"
                value={profil.phone || ""}
                onChangeText={(text) =>
                  setUserProfile((prev) => prev ? { ...prev, phone: text } : null)
                }
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-gray-800">{profil.phone || "Not set"}</Text>
            )}
          </View> */}
        </View>
      ) : (
        <View className="py-4">
          <Text className="text-gray-500 text-center">
            {queryLoading ? "Loading profile..." : "No profile data available"}
          </Text>
        </View>
      )}
    </View>
  );

  const toggleEmailNotif = async () => {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/settings/email_notif`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Toggle failed");
      const json = await res.json();
      setEmailNotifications(json.email_notif);
    } catch (error) {
      console.log("Error", error);
    }
  }

  const toggleMobileNotif = async () => {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/settings/mobile_notif`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Toggle failed");
      const json = await res.json();
      setNotificationsEnabled(json.mobile_notif);
    } catch (error) {
      console.log("Error", error);
    }
  }
  
  const toggleTheme_mode = async () => {
    try {
      const res = await fetch(`${SERVER_API_URL}/api/settings/theme_mode`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Toggle failed");
      const json = await res.json();
      setDarkMode(json.theme_mode);
    } catch (error) {
      console.log("Error", error);
    }
  }

  const renderSettingItem = (
    label: string,
    value: boolean,
    onToggle: (newValue: boolean) => void,
    description?: string
  ) => (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
      <View>
        <Text className="text-gray-800 font-medium">{label}</Text>
        {description && (
          <Text className="text-gray-500 text-sm mt-1">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#d1d5db", true: "#0072ff" }}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Settings" />
      
      <ScrollView className="flex-1 p-4">
        {renderProfileSection()}

        <View className="mb-6 bg-white rounded-lg p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Notifications</Text>
          {renderSettingItem(
            "Push Notifications", 
            notificationsEnabled, 
            () => toggleMobileNotif(),
            "Receive alerts for sensor data changes"
          )}
          {renderSettingItem(
            "Email Notifications", 
            emailNotifications, 
            () => toggleEmailNotif(),
            "Receive alerts for sensor data changes"
          )}
        </View>

        <View className="mb-6 bg-white rounded-lg p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Appearance</Text>
          {renderSettingItem(
            "Dark Mode", 
            darkMode, 
            () => toggleTheme_mode(),
            "Enable dark theme for the app"
          )}
        </View>

        <View className="mb-6 bg-white rounded-lg p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Data Settings</Text>
          <View className="py-3">
            <Text className="text-gray-800 font-medium">Data Refresh Rate</Text>
            <Text className="text-gray-500 text-sm mb-3">
              How often to update sensor data (in seconds)
            </Text>
            <TextInput
              className="p-2 border border-gray-300 rounded-md"
              value={dataRefreshRate}
              onChangeText={setDataRefreshRate}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View className="mb-6 bg-white rounded-lg p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">About</Text>
          <View className="py-2">
            <Text className="text-gray-800">Version 1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="mb-6 bg-white rounded-lg p-4"
        >
          <Text className="text-error text-center font-medium">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
