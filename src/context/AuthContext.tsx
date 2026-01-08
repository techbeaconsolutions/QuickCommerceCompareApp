import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup } from "../api/apiClient";

interface User {
  _id?: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Restore session on app start
  // -------------------------------
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
        }

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  // -------------------------------
  // LOGIN (CRITICAL FIX)
  // -------------------------------
  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      if (!res?.success || !res?.token || !res?.user) {
        throw new Error(res?.message || "Invalid login response");
      }

      setToken(res.token);
      setUser(res.user);

      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.user));
    } catch (error: any) {
      throw error; // 🔴 MUST THROW
    }
  };

  // -------------------------------
  // SIGNUP
  // -------------------------------
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await apiSignup(name, email, password);
      if (!res?.success) {
        throw new Error(res?.message || "Signup failed");
      }
    } catch (error) {
      throw error;
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
