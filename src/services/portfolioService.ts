import type { PortfolioHolding, PortfolioSummary } from '../types/portfolio';
import type { Transaction } from '../types/transaction';

export const mockHoldings: PortfolioHolding[] = [
    {
        fundId: '1',
        fundName: 'BlueChip Equity Fund',
        category: 'Equity',
        units: 120.5,
        avgPrice: 110.2,
        currentPrice: 124.5,
        investedValue: 13279.1,
        currentValue: 15002.25,
        returns: 1723.15,
        returnsPercentage: 12.97,
    },
    {
        fundId: '2',
        fundName: 'Corporate Debt Fund',
        category: 'Debt',
        units: 500,
        avgPrice: 42.0,
        currentPrice: 45.2,
        investedValue: 21000.0,
        currentValue: 22600.0,
        returns: 1600.0,
        returnsPercentage: 7.62,
    },
];

export const mockSummary: PortfolioSummary = {
    totalInvested: 34279.1,
    currentValue: 37602.25,
    totalReturns: 3323.15,
    totalReturnsPercentage: 9.69,
    allocation: [
        { category: 'Equity', percentage: 40, value: 15002.25, color: '#1a73e8' },
        { category: 'Debt', percentage: 60, value: 22600.0, color: '#34a853' },
    ],
};

export const mockTransactions: Transaction[] = [
    { id: 'T1', date: '2024-12-10', fundName: 'BlueChip Equity Fund', type: 'Buy', amount: 5000, status: 'Completed' },
    { id: 'T2', date: '2024-12-05', fundName: 'Corporate Debt Fund', type: 'SIP', amount: 1000, status: 'Completed' },
    { id: 'T3', date: '2024-11-28', fundName: 'Aggressive Hybrid Fund', type: 'Buy', amount: 2000, status: 'Completed' },
    { id: 'T4', date: '2024-11-20', fundName: 'Nifty 50 Index Fund', type: 'Buy', amount: 3000, status: 'Completed' },
    { id: 'T5', date: '2024-11-15', fundName: 'Short Term Debt Fund', type: 'Sell', amount: 1500, status: 'Completed' },
];

export const getPortfolioSummary = async (): Promise<PortfolioSummary> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockSummary;
};

export const getPortfolioHoldings = async (): Promise<PortfolioHolding[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockHoldings;
};

export const getTransactions = async (): Promise<Transaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTransactions;
};






