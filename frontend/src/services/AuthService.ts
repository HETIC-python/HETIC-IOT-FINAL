import { SERVER_API_URL } from "@/config/api";

const API_URL = SERVER_API_URL;

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
};
