import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  verifyCode: (code: number) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedRole = await AsyncStorage.getItem("userRole");

      if (storedToken && storedUserId) {
        setAccessToken(storedToken);
        setUserId(storedUserId);
        setUserRole(storedRole);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading auth info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "http://192.168.160.117:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem("accessToken", data.access_token);
      await AsyncStorage.setItem("userRole", data.role);

      setAccessToken(data.access_token);
      setUserRole(data.role);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      await AsyncStorage.setItem("userId", data.userId);
      setUserId(data.userId);
    } catch (error) {
      throw error;
    }
  };

  const verifyCode = async (code: number) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) throw new Error("User ID not found");

      const response = await fetch(
        "http://192.168.160.117:3000/api/auth/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: storedUserId, code }),
        }
      );

      console.log("Verify response:", await response.clone().json());

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      if (data.access_token) {
        await AsyncStorage.setItem("accessToken", data.access_token);
        setAccessToken(data.access_token);
      }
      if (data.role) {
        await AsyncStorage.setItem("userRole", data.role);
        setUserRole(data.role);
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Verify error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(["accessToken", "userId", "userRole"]);
      setIsAuthenticated(false);
      setAccessToken(null);
      setUserId(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        userId,
        accessToken,
        userRole,
        signIn,
        signUp,
        verifyCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
