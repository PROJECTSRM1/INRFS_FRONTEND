export type UserRole = 'investor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    customerId?: string; // Format: I1234
}

export type PlanCategory = 'Short-Term' | 'Long-Term';
export type PlanType = 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Yearly';

export interface InvestmentPlan {
    id: string;
    name: string;
    category: PlanCategory;
    type: PlanType;
    roi: number; // e.g., 12.5 for 12.5%
    duration: number; // in months
    minAmount: number;
    description: string;
    highlights: string[];
    infrcPrefix: string;
}

export interface Investment {
    id: string; // Format: INV-2024-001
    planId: string;
    planName: string;
    amount: number;
    returns: number;
    maturityAmount: number;
    tenure: number;
    status: 'Active' | 'Matured' | 'Completed';
    date: string;
    startDate?: string;
    maturityDate?: string;
    interest?: number;
    infrcNumber: string;
    investorName?: string;
    investorId?: string;
    settlementStatus?: 'Completed' | 'Pending';
}

export interface Investor extends User {
    mobile: string;
    totalInvested: number;
    activeInvestments: number;
    status: 'Active' | 'Pending' | 'Inactive';
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
