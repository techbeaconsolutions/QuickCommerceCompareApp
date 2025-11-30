import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, signup as apiSignup } from "../api/scrape"; // 🔹 uses your existing API file

// ----------------------------------------------------
// 🧩 Type Definitions
// ----------------------------------------------------
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

// ----------------------------------------------------
// 🧱 Context Creation
// ----------------------------------------------------
const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  login: async () => { },
  signup: async () => { },
  logout: async () => { },
});

// ----------------------------------------------------
// 🧠 Provider Component
// ----------------------------------------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-load token on app start
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(JSON.parse(storedToken));
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("❌ Error restoring auth state:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ----------------------------------------------------
  // 🔹 Login
  // ----------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      if (res.success && res.token) {
        setUser(res.user);
        setToken(res.token);
        await AsyncStorage.setItem("token", JSON.stringify(res.token));
        await AsyncStorage.setItem("user", JSON.stringify(res.user));
      } else {
        throw new Error("Login failed. Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      throw err;
    }
  };

  // ----------------------------------------------------
  // 🔹 Signup
  // ----------------------------------------------------
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await apiSignup(name, email, password);
      if (res.success && res.user) {
      } else {
        throw new Error("Signup failed.");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      throw err;
    }
  };

  // ----------------------------------------------------
  // 🔹 Logout
  // ----------------------------------------------------
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------------------------------
// 🧩 Hook for easy access
// ----------------------------------------------------
export const useAuth = () => useContext(AuthContext);
