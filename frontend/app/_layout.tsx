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

import { useColorScheme } from "@/hooks/useColorScheme";
import { WorkspaceProvider } from "@/src/context/WorkspaceContext";

function RootLayoutNav() {
  const { isSignedIn } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {isSignedIn ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
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
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <WorkspaceProvider>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </WorkspaceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
