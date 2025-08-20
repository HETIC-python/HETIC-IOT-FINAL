import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { authService } from "./../services/AuthService";

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  token: string | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      let storedToken: string | null = null;
      if (Platform.OS === "web") {
        storedToken = localStorage.getItem("token");
      } else {
        storedToken = await SecureStore.getItemAsync("token");
      }
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const authContextValue = {
    token,
    isSignedIn: !!token, // Determine if the user is signed in
    signIn: async (email: string, password: string) => {
      const token = await authService.signIn(email, password);
      console.log("Token received:", token, Platform.OS);
      if (Platform.OS === "web") {
        localStorage.setItem("token", token);
      } else {
        await SecureStore.setItemAsync("token", token);
      }
      setToken(token);
    },
    signUp: async (data: SignUpData) => {
      const token = await authService.signUp(data);
      if (Platform.OS === "web") {
        localStorage.setItem("token", token);
      } else {
        await SecureStore.setItemAsync("token", token);
      }
      setToken(token);
    },
    signOut: async () => {
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
      } else {
        await SecureStore.deleteItemAsync("token");
      }
      setToken(null);
    },
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
