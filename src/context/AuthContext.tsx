import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/api";

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
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token, role } = response.data;

      await AsyncStorage.setItem("accessToken", access_token);
      await AsyncStorage.setItem("userRole", role);

      setAccessToken(access_token);
      setUserRole(role);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { userId } = response.data;

      await AsyncStorage.setItem("userId", userId);
      setUserId(userId);
    } catch (error) {
      throw error;
    }
  };

  const verifyCode = async (code: number) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) throw new Error("User ID not found");

      const response = await axios.post(`${API_URL}/auth/verify`, {
        id: storedUserId,
        code,
      });

      console.log("Verify response:", response.data);

      const { access_token, role } = response.data;

      if (access_token) {
        await AsyncStorage.setItem("accessToken", access_token);
        setAccessToken(access_token);
      }
      if (role) {
        await AsyncStorage.setItem("userRole", role);
        setUserRole(role);
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
