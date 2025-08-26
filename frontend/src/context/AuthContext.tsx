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

type User = {
  id: number;
  username: string;
  email: string;
  is_validated: boolean;
  role: string;
  created_at: string | null;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  loadUserInfo: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fonction pour charger les informations de l'utilisateur depuis le backend
  const loadUserInfo = async () => {
    if (!token) return;
    
    try {
      const userInfo = await authService.getCurrentUser(token);
      setUser(userInfo);
    } catch (error) {
      console.error("Erreur lors du chargement des informations utilisateur:", error);
      // Si l'erreur est liée à l'authentification, déconnecter l'utilisateur
      if (error === 401 || error === 403) {
        // Déconnecter l'utilisateur en cas d'erreur d'authentification
        if (Platform.OS === "web") {
          localStorage.removeItem("token");
        } else {
          await SecureStore.deleteItemAsync("token");
        }
        setToken(null);
        setUser(null);
      }
    }
  };

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

  // Charger les informations utilisateur quand le token change
  useEffect(() => {
    if (token) {
      loadUserInfo();
    } else {
      setUser(null);
    }
  }, [token]);

  const authContextValue = {
    token,
    user,
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
      setUser(null);
    },
    loadUserInfo,
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
