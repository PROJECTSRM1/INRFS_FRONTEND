export type UserRole = 'investor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    customerId?: string;
}

export type PlanCategory = 'Short-Term' | 'Long-Term';
export type PlanType = 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Yearly';

export interface InvestmentPlan {
    id: string;
    name: string;
    category: PlanCategory;
    type: PlanType;
    roi: number;
    duration: number;
    minAmount: number;
    maxAmount: number;
    description: string;
    highlights: string[];
    infrcPrefix: string;
}

export interface Investment {
    id: string;
    planId: string;
    planName: string;
    amount: number;
    returns: number;
    maturityAmount: number;
    tenure: number;
    status: 'Active' | 'Matured' | 'Completed' | 'Closed Early';
    date: string;
    startDate?: string;
    maturityDate?: string;
    interest?: number;
    infrcNumber: string;
    investorName?: string;
    investorId?: string;
    settlementStatus?: 'Completed' | 'Pending' | 'Adjusted';
}

export interface Investor {
    id: number;
    inv_reg_id?: string;
    name: string;
    email: string;
    mobile: string;
    status?: string;
    totalInvested?: number;
    activeInvestments?: number;
    customerId: string;
}


export interface DashboardStats {
    totalInvestors: number;
    investorsIncrease: number;
    activeInvestments: number;
    investmentsIncrease: number;
    totalInvested: number;
    investedIncrease: number;
    interestPayable: number;
    interestIncrease: number;
}

export interface Activity {
    id: string;
    type: 'New Investment' | 'New Registration' | 'Payment Received';
    description: string;
    timestamp: string;
    user?: string;
}

export interface AppState {
    user: User | null;
    investments: Investment[];
    plans: InvestmentPlan[];
}
