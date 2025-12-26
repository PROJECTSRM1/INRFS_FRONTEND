import axios from 'axios';

// Use proxy in development to avoid CORS/405 errors
const API_URL = import.meta.env.DEV ? '/api' : 'https://inrfs-be.onrender.com';

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    password: string;
    gender_id: number;
    age: number;
    dob: string;
}

export interface RegisterResponse {
    message: string;
    user_id: number;
    inv_reg_id: string;
}

export interface LoginPayload {
    password: string;
    email?: string;
    inv_reg_id?: string;
}

export const authService = {
    registerUser: async (userData: RegisterPayload): Promise<RegisterResponse> => {
        try {
            const response = await axios.post(`${API_URL}/users/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    loginUser: async (credentials: LoginPayload) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
