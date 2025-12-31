import apiClient from '../utils/apiClient';

export interface Plan {
    id: number;
    name: string;
    returns_percentage: number;
    duration_months: number;
    description: string;
    is_active: boolean;
}

export const plansService = {
    /**
     * Fetch all active investment plans from the API
     */
    getPlans: async (): Promise<Plan[]> => {
        try {
            const response = await apiClient.get('/plans/');
            return response.data;
        } catch (error) {
            console.error('Error fetching plans:', error);
            throw error;
        }
    },

    /**
     * Fetch a specific plan by ID
     */
    getPlanById: async (id: number): Promise<Plan> => {
        try {
            const response = await apiClient.get(`/plans/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching plan ${id}:`, error);
            throw error;
        }
    }
};
