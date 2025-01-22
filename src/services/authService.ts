import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWTService from './JWTService';

const API_URL = process.env.EXPO_PUBLIC_API_HOST;

const AUTH_ENDPOINTS = {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    verify: `${API_URL}/auth/verify`,
};

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface VerifyData {
    id: string;
    code: number;
}

class AuthService {
    async register(data: RegisterData) {
        try {
            const response = await axios.post(AUTH_ENDPOINTS.register, data);
            console.log('Register response:', response.data);

            if (response.data && response.data.userId) {
                await AsyncStorage.setItem('userId', response.data.userId);
                return response.data;
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error: any) {
            console.error('Register error:', error.response || error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }

    async login(data: LoginData) {
        try {
            console.log('Login attempt with:', {
                email: data.email,
                apiUrl: AUTH_ENDPOINTS.login
            });

            const response = await axios.post(AUTH_ENDPOINTS.login, data);
            console.log('Server response:', response.data);

            if (response.data.access_token) {
                await JWTService.setToken(response.data.access_token);
                if (response.data.role) {
                    await AsyncStorage.setItem('userRole', response.data.role);
                }
            }
            return response.data;
        } catch (error: any) {
            console.error('Login error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            throw this.handleError(error);
        }
    }

    async verify(data: VerifyData) {
        try {
            const response = await axios.post(AUTH_ENDPOINTS.verify, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async logout() {
        try {
            await AsyncStorage.multiRemove(['userId', 'userRole']);
            await JWTService.removeToken();
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.response) {
            // Erreur avec réponse du serveur
            console.log('Server error response:', {
                status: error.response.status,
                data: error.response.data
            });
            return new Error(error.response.data.message || 'Une erreur est survenue');
        }
        if (error.request) {
            // Erreur sans réponse du serveur
            console.log('Network error:', error.request);
            return new Error('Impossible de joindre le serveur. Vérifiez votre connexion internet.');
        }
        // Autres types d'erreurs
        console.log('Other error:', error);
        return new Error('Erreur de connexion au serveur');
    }
}

export default new AuthService(); 