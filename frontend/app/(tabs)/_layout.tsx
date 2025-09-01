import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { IconSymbolIos } from "@/components/ui/IconSymbol.ios";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
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
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios" ? (
              <IconSymbolIos name="house" color={color} />
            ) : (
              <IconSymbol name="home" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios" ? (
              <IconSymbolIos name="bubble.left" color={color} />
            ) : (
              <IconSymbol name="chatbubble" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios" ? (
              <IconSymbolIos name="gear" color={color} />
            ) : (
              <IconSymbol name="settings" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) =>
            Platform.OS === "ios" ? (
              <IconSymbolIos name="person" color={color} />
            ) : (
              <IconSymbol name="person" color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
