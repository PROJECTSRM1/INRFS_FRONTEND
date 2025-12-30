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

export interface LoginResponse {
    message: string;
    "Customer-ID": string;
    First_Name: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
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
    loginUser: async (credentials: LoginPayload): Promise<LoginResponse> => {
        try {
            // Try JSON format first (custom endpoint)
            const response = await axios.post(`${API_URL}/users/login`, {
                email: credentials.email,
                password: credentials.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    sendOTP: async (email: string) => {
        try {
            const response = await axios.post(`${API_URL}/users/send-otp`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    verifyOTP: async (email: string, otp: string) => {
        try {
            const response = await axios.post(`${API_URL}/users/verify-otp`, { email, otp });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
