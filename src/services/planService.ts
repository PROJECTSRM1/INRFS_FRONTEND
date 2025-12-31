export interface InvestmentPlan {
    id?: number;
    name: string;
    returns_percentage: number;
    duration_months: number;
    description: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreatePlanPayload {
    name: string;
    returns_percentage: number;
    duration_months: number;
    description: string;
    is_active: boolean;
}

// Mock data for initial state
let mockPlans: InvestmentPlan[] = [
    {
        id: 1,
        name: 'Short-Term Starter',
        returns_percentage: 6.5,
        duration_months: 1,
        description: 'Perfect for testing the platform with a 1-month plan.',
        is_active: true
    },
    {
        id: 2,
        name: 'Quarterly Builder',
        returns_percentage: 9.2,
        duration_months: 3,
        description: 'Steady growth for your 3-month goals.',
        is_active: true
    },
    {
        id: 3,
        name: 'Growth Accelerate',
        returns_percentage: 12.5,
        duration_months: 6,
        description: 'Competitive returns for a 6-month tenure.',
        is_active: true
    }
];

export const planService = {
    getAllPlans: async (): Promise<InvestmentPlan[]> => {
        // Simulating API delay
        return new Promise((resolve) => {
            setTimeout(() => resolve([...mockPlans]), 500);
        });
    },

    createPlan: async (payload: CreatePlanPayload): Promise<InvestmentPlan> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newPlan: InvestmentPlan = {
                    ...payload,
                    id: mockPlans.length > 0 ? Math.max(...mockPlans.map(p => p.id!)) + 1 : 1,
                    created_at: new Date().toISOString()
                };
                mockPlans.push(newPlan);
                resolve(newPlan);
            }, 500);
        });
    },

    updatePlan: async (id: number, payload: CreatePlanPayload): Promise<InvestmentPlan> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockPlans.findIndex(p => p.id === id);
                if (index !== -1) {
                    mockPlans[index] = { ...mockPlans[index], ...payload, updated_at: new Date().toISOString() };
                    resolve(mockPlans[index]);
                } else {
                    reject(new Error('Plan not found'));
                }
            }, 500);
        });
    },

    deletePlan: async (id: number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockPlans = mockPlans.filter(p => p.id !== id);
                resolve();
            }, 500);
        });
    },

    togglePlanStatus: async (id: number, isActive: boolean): Promise<InvestmentPlan> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockPlans.findIndex(p => p.id === id);
                if (index !== -1) {
                    mockPlans[index].is_active = isActive;
                    resolve(mockPlans[index]);
                } else {
                    reject(new Error('Plan not found'));
                }
            }, 500);
        });
    }
};

