import apiClient from '../utils/apiClient';

export interface CreateInvestmentPayload {
    principal_amount: number;
    plan_type_id: number;
    maturity_date: string;
    created_date: string;
}

// API Response from POST /investments/
export interface InvestmentApiResponse {
    id?: number;
    wk_inv_id?: string;
    user_id?: number;
    plan_type_id?: number;
    principal_amount?: number;
    maturity_amount?: number;
    maturity_date?: string;
    created_date?: string;
    status?: string;
    bond_certificate?: string;
    interest_rate?: number;
    duration_months?: number;
    plan_name?: string;
}

// Frontend Investment interface
export interface Investment {
    id?: number;
    wk_inv_id?: string;
    user_id?: number;
    plan_type_id?: number;
    principal_amount?: number;
    maturity_amount?: number;
    maturity_date?: string;
    created_date?: string;
    status?: string;
    bond_certificate?: string;
    interest_rate?: number;
    duration_months?: number;
    plan_name?: string;
    // Legacy fields for compatibility
    planId?: string;
    planName?: string;
    amount?: number;
    returns?: number;
    maturityAmount?: number;
    tenure?: number;
    date?: string;
    startDate?: string;
    infrcNumber?: string;
}

export interface CreateInvestmentResponse extends InvestmentApiResponse {
    message?: string;
}

export const investmentService = {
    /**
     * Create a new investment
     * Endpoint: POST https://inrfs-be.onrender.com/investments/
     */
    createInvestment: async (payload: CreateInvestmentPayload): Promise<CreateInvestmentResponse> => {
        try {
            console.log('Creating investment with payload:', payload);
            const response = await apiClient.post('/investments/', payload);
            console.log('Investment created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating investment:', error);
            throw error;
        }
    },

    /**
     * Get all investments for the current user
     * Endpoint: GET https://inrfs-be.onrender.com/investments/
     */
    getInvestments: async (): Promise<Investment[]> => {
        try {
            const response = await apiClient.get('/investments/');
            console.log('Investments fetched:', response.data);

            // Handle different response structures
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data.investments && Array.isArray(response.data.investments)) {
                return response.data.investments;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }

            return [];
        } catch (error) {
            console.error('Error fetching investments:', error);
            throw error;
        }
    },

    /**
     * Calculate maturity date based on plan duration
     */
    calculateMaturityDate: (durationMonths: number): string => {
        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + durationMonths);
        return maturityDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    },

    /**
     * Get current date in ISO format
     */
    getCurrentDate: (): string => {
        return new Date().toISOString();
    }
};

export default investmentService;
