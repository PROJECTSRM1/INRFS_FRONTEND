import type { Fund } from '../types/fund';



export const mockFunds: Fund[] = [

    {

        id: '1',

        name: 'BlueChip Equity Fund',






        category: 'Equity',






        risk: 'High',






        returns: 15.4,






        minInvestment: 5000,






        nav: 124.5,






        description: 'Invests in top 100 companies by market capitalization.',






    },






    {






        id: '2',






        name: 'Corporate Debt Fund',






        category: 'Debt',






        risk: 'Low',






        returns: 7.2,






        minInvestment: 1000,






        nav: 45.2,






        description: 'Focuses on high-rated corporate bonds and debt instruments.',






    },






    {






        id: '3',






        name: 'Aggressive Hybrid Fund',






        category: 'Hybrid',






        risk: 'Moderate',






        returns: 12.8,






        minInvestment: 2000,






        nav: 88.3,






        description: 'A mix of equity and debt for balanced growth.',






    },






    {






        id: '4',






        name: 'Nifty 50 Index Fund',






        category: 'Index',






        risk: 'High',






        returns: 14.1,






        minInvestment: 500,






        nav: 210.6,






        description: 'Passive fund tracking the Nifty 50 index.',






    },






    {






        id: '5',






        name: 'Short Term Debt Fund',






        category: 'Debt',






        risk: 'Low',






        returns: 6.5,






        minInvestment: 1000,






        nav: 32.1,






        description: 'Ideal for parking surplus cash for short durations.',






    },






];













export const getFunds = async (): Promise<Fund[]> => {






    await new Promise((resolve) => setTimeout(resolve, 600));






    return mockFunds;






};



























