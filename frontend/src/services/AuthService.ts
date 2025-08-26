import { SERVER_API_URL } from "@/config/api";

const API_URL = SERVER_API_URL;

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

export const authService = {
  async signIn(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("SignIn response:", response);
    const data = await response.json();
    console.log("SignIn data:", data);
    if (!response.ok) throw new Error(data.error);
    return data.token;
  },

  async signUp(data: SignUpData) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const respData = await response.json();
    if (!response.ok) throw new Error(respData.error);
    return respData.token;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw response.status;
      }
      const data = await response.json();
      throw new Error(data.error || 'Failed to fetch user info');
    }

    const data = await response.json();
    return data.user;
  },
};
