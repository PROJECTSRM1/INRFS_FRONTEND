import axios from 'axios';

// Use proxy in development to avoid CORS/405 errors
const API_URL = import.meta.env.DEV ? '/api' : 'https://inrfs-be.onrender.com';

// Create axios instance with timeout configuration
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - backend might be sleeping or slow');
            error.message = 'Request timeout. The server might be starting up. Please try again.';
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
            console.error('Network error - connection issue');
            error.message = 'Network error. Please check your internet connection.';
        } else if (!error.response) {
            console.error('No response from server - might be down or unreachable');
            error.message = 'Cannot reach the server. It might be starting up or temporarily unavailable.';
        }
        return Promise.reject(error);
    }
);

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
            const response = await axiosInstance.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    loginUser: async (credentials: LoginPayload): Promise<LoginResponse> => {
        try {
            // Try JSON format first (custom endpoint)
            const response = await axiosInstance.post('/users/login', {
                email: credentials.email,
                password: credentials.password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    sendOTP: async (email: string) => {
        try {
            const response = await axiosInstance.post('/users/send-otp', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    verifyOTP: async (email: string, otp: string) => {
        try {
            const response = await axiosInstance.post('/users/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    forgotPassword: async (email: string) => {
        try {
            const response = await axiosInstance.post('/users/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    resetPassword: async (token: string, newPassword: string) => {
        try {
            const response = await axiosInstance.post('/users/reset-password', {
                token,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
