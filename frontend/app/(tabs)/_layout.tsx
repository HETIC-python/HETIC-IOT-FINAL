import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarInactiveTintColor: Colors.dark.secondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: Colors.dark.background,
            borderTopWidth: 1,
            borderTopColor: Colors.dark.border,
            height: 80,
            paddingBottom: 20,
          },
          default: {
            backgroundColor: Colors.dark.background,
            borderTopWidth: 1,
            borderTopColor: Colors.dark.border,
            height: 60,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="workspace"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="chatbubble" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}