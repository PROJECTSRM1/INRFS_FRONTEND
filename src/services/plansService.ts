import apiClient from '../utils/apiClient';

// API Response interface (what the backend actually returns)
export interface PlanApiResponse {
    id?: number;
    plan_type: string;
    percentage: string;
    duration: string;
    description: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// Frontend Plan interface (what we use in the app)
export interface Plan {
    id?: number;
    name: string;
    returns_percentage: number;
    duration_months: number;
    description: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PlansResponse {
    plans?: PlanApiResponse[];
    data?: PlanApiResponse[];
}

/**
 * Map API response to frontend Plan interface
 */
const mapApiResponseToPlan = (apiPlan: PlanApiResponse): Plan => {
    // Extract numeric value from percentage string (e.g., "15 %" or "30%" -> 15 or 30)
    const percentageMatch = apiPlan.percentage.match(/\d+(\.\d+)?/);
    const percentage = percentageMatch ? parseFloat(percentageMatch[0]) : 0;

    // Extract numeric value from duration string (e.g., "3 Months" or "1 month" -> 3 or 1)
    const durationMatch = apiPlan.duration.match(/\d+/);
    const durationMonths = durationMatch ? parseInt(durationMatch[0]) : 0;

    return {
        id: apiPlan.id,
        name: apiPlan.plan_type,
        returns_percentage: percentage,
        duration_months: durationMonths,
        description: apiPlan.description,
        is_active: apiPlan.is_active,
        created_at: apiPlan.created_at,
        updated_at: apiPlan.updated_at
    };
};

export const plansService = {
    /**
     * Fetch all investment plans from the API
     * Endpoint: GET https://inrfs-be.onrender.com/plans/
     */
    getPlans: async (): Promise<Plan[]> => {
        try {
            const response = await apiClient.get('/plans/');
            console.log('Plans API Response:', response.data);

            // Handle different response structures
            let apiPlans: PlanApiResponse[] = [];

            if (Array.isArray(response.data)) {
                // Response is directly an array of plans
                apiPlans = response.data;
            } else if (response.data.plans && Array.isArray(response.data.plans)) {
                // Response is wrapped in { plans: [...] }
                apiPlans = response.data.plans;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                // Response is wrapped in { data: [...] }
                apiPlans = response.data.data;
            }

            // Map API response to frontend Plan interface
            const plans = apiPlans.map(mapApiResponseToPlan);

            // Filter only active plans
            const activePlans = plans.filter(plan => plan.is_active);
            console.log('Active Plans (mapped):', activePlans);

            return activePlans;
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
            const plans = await plansService.getPlans();
            const plan = plans.find(p => p.id === id);
            if (!plan) throw new Error('Plan not found');
            return plan;
        } catch (error) {
            console.error(`Error fetching plan ${id}:`, error);
            throw error;
        }
    }
};

