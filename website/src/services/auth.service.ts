import { SERVER_API_URL } from "../utils/api";

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

const API_URL = SERVER_API_URL;

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unknown error");
      }
      const data = await response.json();
      return { ...data };
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Authentication failed");
    }
  },

  async getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    console.log("Fetching current user", token);
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      this.signOut();
      return null;
    }
  },

  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  setAuthData(data: AuthResponse) {
    console.log("Setting auth data", data);
    localStorage.setItem("token", data.token);
    // localStorage.setItem("user", JSON.stringify(data.user));
  },
};
