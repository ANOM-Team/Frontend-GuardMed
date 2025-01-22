import axios from "axios";
import tokenService from "../services/JWTService";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_HOST,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
