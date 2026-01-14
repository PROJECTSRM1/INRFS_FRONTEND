import type { InvestmentPlan, Investment, DashboardStats, Activity } from '../types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
    {
        id: 'p1',
        name: 'Short-Term Starter',
        category: 'Short-Term',
        type: 'Monthly',
        roi: 6.5,
        duration: 1,
        minAmount: 1000,
        maxAmount: 1000000,
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
        maxAmount: 1000000,
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
        maxAmount: 1000000,
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
        maxAmount: 1000000,
        description: 'Maximize your wealth with our premium yearly plan.',
        highlights: ['Max Yield', 'Annual Compounding', 'VIP Advisory'],
        infrcPrefix: 'WM-1Y'
    }
];

// export const MOCK_INVESTORS: Investor[] = [
//     {
//         id: '1',
//         name: 'John Doe',
//         email: 'john.doe@email.com',
//         role: 'investor',
//         customerId: 'I1234',
//         mobile: '+91 98765 43210',
//         totalInvested: 45000,
//         activeInvestments: 5,
//         status: 'Active'
//     },
//     {
//         id: '2',
//         name: 'Sarah Smith',
//         email: 'sarah.smith@email.com',
//         role: 'investor',
//         customerId: 'I1235',
//         mobile: '+91 98765 43211',
//         totalInvested: 32500,
//         activeInvestments: 3,
//         status: 'Active'
//     },
//     {
//         id: '3',
//         name: 'Michael Johnson',
//         email: 'michael.j@email.com',
//         role: 'investor',
//         customerId: 'I1236',
//         mobile: '+91 98765 43212',
//         totalInvested: 78000,
//         activeInvestments: 8,
//         status: 'Active'
//     },
//     {
//         id: '4',
//         name: 'Emily Davis',
//         email: 'emily.davis@email.com',
//         role: 'investor',
//         customerId: 'I1237',
//         mobile: '+91 98765 43213',
//         totalInvested: 21000,
//         activeInvestments: 2,
//         status: 'Pending'
//     }
// ];

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
        investorId: '1',
        settlementStatus: 'Pending'
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
        investorId: '2',
        settlementStatus: 'Pending'
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
        investorId: '3',
        settlementStatus: 'Pending'
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
        investorId: '4',
        settlementStatus: 'Completed'
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
    { name: 'Jan', value: 800, count: 12 },
    { name: 'Feb', value: 950, count: 15 },
    { name: 'Mar', value: 1100, count: 18 },
    { name: 'Apr', value: 1000, count: 20 },
    { name: 'May', value: 1250, count: 25 },
    { name: 'Jun', value: 1400, count: 30 },
    { name: 'Jul', value: 1350, count: 35 },
    { name: 'Aug', value: 1550, count: 40 },
    { name: 'Sep', value: 1450, count: 38 },
    { name: 'Oct', value: 1700, count: 45 },
    { name: 'Nov', value: 1900, count: 50 },
    { name: 'Dec', value: 1950, count: 55 },
];

export const MOCK_STATS_BY_PERIOD: Record<string, DashboardStats> = {
    'Daily': {
        totalInvestors: 12,
        investorsIncrease: 2,
        activeInvestments: 45,
        investmentsIncrease: 5,
        totalInvested: 150000,
        investedIncrease: 3,
        interestPayable: 25000,
        interestIncrease: 1
    },
    'Monthly': MOCK_DASHBOARD_STATS,
    'Quarterly': {
        totalInvestors: 350,
        investorsIncrease: 12,
        activeInvestments: 1100,
        investmentsIncrease: 18,
        totalInvested: 4500000,
        investedIncrease: 15,
        interestPayable: 850000,
        interestIncrease: 10
    },
    'Annually': {
        totalInvestors: 1247,
        investorsIncrease: 15,
        activeInvestments: 3456,
        investmentsIncrease: 22,
        totalInvested: 12500000,
        investedIncrease: 18,
        interestPayable: 2100000,
        interestIncrease: 12
    }
};

export const MOCK_CHART_DATA_BY_PERIOD: Record<string, any[]> = {
    'Daily': [
        { name: '09:00', value: 50, count: 2 },
        { name: '12:00', value: 120, count: 5 },
        { name: '15:00', value: 180, count: 8 },
        { name: '18:00', value: 140, count: 6 },
        { name: '21:00', value: 90, count: 4 },
    ],
    'Monthly': MOCK_MONTHLY_DATA,
    'Quarterly': [
        { name: 'Q1', value: 2500, count: 120 },
        { name: 'Q2', value: 3200, count: 150 },
        { name: 'Q3', value: 2800, count: 130 },
        { name: 'Q4', value: 3900, count: 200 },
    ],
    'Annually': [
        { name: '2021', value: 12000, count: 800 },
        { name: '2022', value: 15000, count: 1000 },
        { name: '2023', value: 22000, count: 1500 },
        { name: '2024', value: 28000, count: 2000 },
    ]
};

export const MOCK_PIE_DATA = [
    { name: '1 Month', value: 400000, count: 45, color: '#926132' },
    { name: '3 Month', value: 300000, count: 30, color: '#10b981' },
    { name: '6 Month', value: 300000, count: 25, color: '#8b5cf6' },
    { name: 'Yearly', value: 200000, count: 12, color: '#f59e0b' },
];

export const MOCK_SYSTEM_USERS = [
    {
        id: 'a1',
        name: 'Admin User',
        email: 'admin@inrfs.com',
        role: 'Super Admin',
        mobile: '+91 98765 00000',
        status: 'Active',
        joinedDate: '2023-01-15'
    },
    {
        id: 'a2',
        name: 'John Moderator',
        email: 'john.mod@inrfs.com',
        role: 'Moderator',
        mobile: '+91 98765 11111',
        status: 'Active',
        joinedDate: '2023-05-20'
    },
    {
        id: 'a3',
        name: 'Jane Smith',
        email: 'jane.admin@inrfs.com',
        role: 'Admin',
        mobile: '+91 98765 22222',
        status: 'Inactive',
        joinedDate: '2024-02-10'
    }
];
