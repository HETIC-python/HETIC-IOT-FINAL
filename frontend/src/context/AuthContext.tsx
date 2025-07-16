import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";
import { authService } from "./../services/AuthService";

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const authContextValue = {
    token,
    signIn: async (email: string, password: string) => {
      const token = await authService.signIn(email, password);
      await SecureStore.setItemAsync("token", token);
      setToken(token);
    },
    signUp: async (data: SignUpData) => {
      const token = await authService.signUp(data);
      await SecureStore.setItemAsync("token", token);
      setToken(token);
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync("token");
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
