import axios from "axios";

export interface InvestmentPlan {
  id?: number;
  name: string;
  returns_percentage: number;
  duration_months: number;
  description: string;
  is_active: boolean;
  maxAmount?: number; // Maximum investment amount (optional for backward compatibility)
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
  },
  {
    id: 4,
    name: 'Wealth Multiplier',
    returns_percentage: 15.8,
    duration_months: 12,
    description: 'Maximize your wealth with our premium yearly plan.',
    is_active: true
  }
];

export const planService = {
  getAllPlans: async (): Promise<InvestmentPlan[]> => {
    const res = await axios.get("/plans/", {
      baseURL: "https://inrfs-be.onrender.com",
    });
    return res.data.map((item: any) => ({
      id: item.id,
      name: item.plan_type,
      returns_percentage: parseFloat(item.percentage),
      duration_months: parseInt(item.duration),
      description: item.description ?? "",
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  },

  createPlan: async (payload: CreatePlanPayload): Promise<InvestmentPlan> => {
    const apiPayload = {
      plan_type: payload.name,
      percentage: `${payload.returns_percentage} %`,
      duration: `${payload.duration_months} Months`,
      is_active: payload.is_active,
      description: payload.description,
    };

    const res = await axios.post("/plans/", apiPayload, {
      baseURL: "https://inrfs-be.onrender.com",
    });
    return res.data;
  },


  updatePlan: async (id: number, payload: CreatePlanPayload): Promise<InvestmentPlan> => {
    const apiPayload = {
      plan_type: payload.name,
      percentage: `${payload.returns_percentage} %`,
      duration: `${payload.duration_months} Months`,
      is_active: payload.is_active,
      description: payload.description,
    };

    return axios.put(`/plans/${id}`, apiPayload, {
      baseURL: "https://inrfs-be.onrender.com",
    }).then(res => res.data);
  },


  deletePlan: async (id: number): Promise<void> => {
    return axios.delete(`/plans/${id}`, {
      baseURL: "https://inrfs-be.onrender.com",
    }).then(res => res.data);
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

