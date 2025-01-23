import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import JWTService from "../services/JWTService";

const API_URL = process.env.EXPO_PUBLIC_API_HOST;

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  verifyCode: (code: number) => Promise<any>;
  signOut: () => Promise<any>;
  sendCode: (email: string) => Promise<any>;
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
      

      await JWTService.setToken(access_token);
      await AsyncStorage.setItem("userRole", role);

      setAccessToken(access_token);
      setUserRole(role);
      setIsAuthenticated(true);
    } catch (error: any) {
      return error.response.data;
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
    } catch (error: any) {
      throw error;
    }
  };

  const verifyCode = async (code: number) => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) throw new Error('User ID not found');
  
      const response = await axios.post(`${API_URL}/auth/verify`, {
        id: storedUserId,
        code,
      });
  
      console.log('Verify response:', response.data);
  
      const { access_token, role } = response.data;
  
      if (access_token) {
        await AsyncStorage.setItem('accessToken', access_token);
        setAccessToken(access_token);
      }
  
      if (role) {
        await AsyncStorage.setItem('userRole', role);
        setUserRole(role);
      }
  
      setIsAuthenticated(true);
  
      return response.data;
    } catch (error: any) {
      console.error('Verify error:', error);
      return { error: error.message || 'Verification failed' };
    }
  };

  const sendCode = async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend`, {
        email,
      });

      console.log("Send code response:", response.data);

      await AsyncStorage.setItem("userId", response.data.userId);
      return response.data;
    } catch (error: any) {
      console.error("Error sending code:", error);
      return { error: error.message || "Failed to send code" };
    }
  }

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
        sendCode,
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
