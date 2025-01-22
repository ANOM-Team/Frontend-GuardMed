import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "jwt_token";

const tokenService = {
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem("TOKEN_KEY", token);
    } catch (error) {
      console.error("Error storing token:", error);
      throw error;
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token:", error);
      throw error;
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  },

  hasToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error("Error checking token:", error);
      throw error;
    }
  },
};

export default tokenService;
