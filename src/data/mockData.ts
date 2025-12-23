import type { InvestmentPlan, Investment, Investor, DashboardStats, Activity } from '../types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
    // ... existing plans (I'll keep them as is in the replacement content)
    {
        id: 'p1',
        name: 'Short-Term Starter',
        category: 'Short-Term',
        type: 'Monthly',
        roi: 6.5,
        duration: 1,
        minAmount: 1000,
        description: 'Perfect for testing the platform with a 1-month plan.',
        highlights: ['Monthly Interest', 'Low Entry Point', 'Institutional Grade'],
        infrcPrefix: 'ST-1M'
    },
    {
        id: 'p2',
        name: 'Quarterly Builder',
        category: 'Short-Term',
        type: 'Quarterly',
        roi: 9.2,
        duration: 3,
        minAmount: 5000,
        description: 'Steady growth for your 3-month goals.',
        highlights: ['Quarterly Payouts', 'High Returns', 'Secure Bond'],
        infrcPrefix: 'QB-3M'
    },
    {
        id: 'p3',
        name: 'Growth Accelerate',
        category: 'Short-Term',
        type: 'Bi-Annual',
        roi: 12.5,
        duration: 6,
        minAmount: 10000,
        description: 'Competitive returns for a 6-month tenure.',
        highlights: ['High Yield', 'Verified Portfolio', 'Priority Support'],
        infrcPrefix: 'GA-6M'
    },
    {
        id: 'p4',
        name: 'Wealth Multiplier',
        category: 'Long-Term',
        type: 'Yearly',
        roi: 15.8,
        duration: 12,
        minAmount: 25000,
        description: 'Maximize your wealth with our premium yearly plan.',
        highlights: ['Max Yield', 'Annual Compounding', 'VIP Advisory'],
        infrcPrefix: 'WM-1Y'
    }
];

export const MOCK_INVESTORS: Investor[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'investor',
        customerId: 'I1234',
        mobile: '+1 234 567 8900',
        totalInvested: 45000,
        activeInvestments: 5,
        status: 'Active'
    },
    {
        id: '2',
        name: 'Sarah Smith',
        email: 'sarah.smith@email.com',
        role: 'investor',
        customerId: 'I1235',
        mobile: '+1 234 567 8901',
        totalInvested: 32500,
        activeInvestments: 3,
        status: 'Active'
    },
    {
        id: '3',
        name: 'Michael Johnson',
        email: 'michael.j@email.com',
        role: 'investor',
        customerId: 'I1236',
        mobile: '+1 234 567 8902',
        totalInvested: 78000,
        activeInvestments: 8,
        status: 'Active'
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        role: 'investor',
        customerId: 'I1237',
        mobile: '+1 234 567 8903',
        totalInvested: 21000,
        activeInvestments: 2,
        status: 'Pending'
    }
];

export const MOCK_INVESTMENTS: Investment[] = [
    {
        id: 'INV-2024-001',
        planId: 'p3',
        planName: '6 Month',
        amount: 10000,
        returns: 1800,
        interest: 1800,
        maturityAmount: 11800,
        tenure: 6,
        status: 'Active',
        date: '2023-12-15',
        startDate: 'Dec 15, 2023',
        maturityDate: 'Jun 15, 2024',
        infrcNumber: 'GA-6M-001',
        investorName: 'John Doe (I1234)',
        investorId: '1'
    },
    {
        id: 'INV-2024-002',
        planId: 'p2',
        planName: '3 Month',
        amount: 5000,
        returns: 600,
        interest: 600,
        maturityAmount: 5600,
        tenure: 3,
        status: 'Active',
        date: '2024-01-20',
        startDate: 'Jan 20, 2024',
        maturityDate: 'Apr 20, 2024',
        infrcNumber: 'QB-3M-002',
        investorName: 'Sarah Smith (I1235)',
        investorId: '2'
    },
    {
        id: 'INV-2024-003',
        planId: 'p4',
        planName: 'Yearly',
        amount: 25000,
        returns: 6000,
        interest: 6000,
        maturityAmount: 31000,
        tenure: 12,
        status: 'Active',
        date: '2024-01-01',
        startDate: 'Jan 01, 2024',
        maturityDate: 'Jan 01, 2025',
        infrcNumber: 'WM-1Y-003',
        investorName: 'Michael Johnson (I1236)',
        investorId: '3'
    },
    {
        id: 'INV-2023-156',
        planId: 'p3',
        planName: '6 Month',
        amount: 15000,
        returns: 2700,
        interest: 2700,
        maturityAmount: 17700,
        tenure: 6,
        status: 'Completed',
        date: '2023-07-01',
        startDate: 'Jul 01, 2023',
        maturityDate: 'Jan 01, 2024',
        infrcNumber: 'GA-6M-156',
        investorName: 'Emily Davis (I1237)',
        investorId: '4'
    }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
    totalInvestors: 1247,
    investorsIncrease: 15,
    activeInvestments: 3456,
    investmentsIncrease: 22,
    totalInvested: 12500000, // 12.5M
    investedIncrease: 18,
    interestPayable: 2100000, // 2.1M
    interestIncrease: 12
};

export const MOCK_ACTIVITY: Activity[] = [
    {
        id: 'act1',
        type: 'New Investment',
        description: 'John Doe (I1234) invested $15,000 in 6 Month Plan',
        timestamp: '2 mins ago'
    },
    {
        id: 'act2',
        type: 'New Registration',
        description: 'Sarah Smith (I1235) registered as new investor',
        timestamp: '15 mins ago'
    }
];

export const MOCK_MONTHLY_DATA = [
    { name: 'Jan', value: 800 },
    { name: 'Feb', value: 950 },
    { name: 'Mar', value: 1100 },
    { name: 'Apr', value: 1000 },
    { name: 'May', value: 1250 },
    { name: 'Jun', value: 1400 },
    { name: 'Jul', value: 1350 },
    { name: 'Aug', value: 1550 },
    { name: 'Sep', value: 1450 },
    { name: 'Oct', value: 1700 },
    { name: 'Nov', value: 1900 },
    { name: 'Dec', value: 1950 },
];
