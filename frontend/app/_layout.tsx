import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

import { useAppState } from "@/hooks/useAppState";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { WorkspaceProvider } from "@/src/context/WorkspaceContext";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import React from "react";
function RootLayoutNav() {
  const { isSignedIn } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isSignedIn ? (
        <Stack.Screen options={{ headerShown: true }} />
      ) : (
        <>
          <Stack.Screen name="workspace" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: true }} />
          <Stack.Screen name="sign-up" options={{ headerShown: true }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  // Initialize QueryClient only once
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
          },
        },
      })
  );

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useAppState();
  useOnlineManager();

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <WorkspaceProvider>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </WorkspaceProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
