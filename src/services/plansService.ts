import { planService } from './planService';
import type { InvestmentPlan } from './planService';

export type Plan = InvestmentPlan;

export const plansService = {
    /**
     * Fetch all active investment plans from the shared mock service
     */
    getPlans: async (): Promise<Plan[]> => {
        try {
            return await planService.getAllPlans();
        } catch (error) {
            console.error('Error fetching plans:', error);
            throw error;
        }
    },

    /**
     * Fetch a specific plan by ID from the shared mock service
     */
    getPlanById: async (id: number): Promise<Plan> => {
        try {
            const plans = await planService.getAllPlans();
            const plan = plans.find(p => p.id === id);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.error(`Error fetching plan ${id}:`, error);
            throw error;
        }
    }
};
