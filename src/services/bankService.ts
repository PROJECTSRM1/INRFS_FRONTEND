import apiClient from '../utils/apiClient';

export interface BankDetails {
    // Actual API response fields
    bank_id?: number;
    bank_account_no?: number | string;
    ifsc_code?: string;
    is_verified?: boolean;

    // Optional fields that might be added later
    id?: number;
    user_id?: number;
    account_holder_name?: string;
    account_number?: string;
    bank_name?: string;
    branch_name?: string;
    account_type?: string;
    created_at?: string;
    updated_at?: string;
}

// Response can be wrapped or direct bank details
export type BankDetailsResponse = BankDetails & {
    message?: string;
    data?: BankDetails;
    bank_details?: BankDetails;
};

export const bankService = {
    /**
     * Fetch bank details for the authenticated user
     * Requires valid access_token in localStorage
     */
    getBankDetails: async (): Promise<BankDetailsResponse> => {
        try {
            const response = await apiClient.get('/users/bank-details');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Add or update bank details for the authenticated user
     */
    updateBankDetails: async (bankData: Partial<BankDetails>): Promise<BankDetailsResponse> => {
        try {
            const response = await apiClient.post('/users/bank-details', bankData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Add bank details for the authenticated user
     * This is an alias for updateBankDetails
     */
    addBankDetails: async (bankData: Partial<BankDetails>): Promise<BankDetailsResponse> => {
        try {
            const response = await apiClient.post('/users/bank-details', bankData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
